import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'
import { sendEmail } from '@/lib/email/service'
import { generateProposalEmail } from '@/lib/email/templates'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerId,
      lawnSize,
      packageType,
      visitFrequencyDays,
      pricePerVisitCents,
      estimatedAnnualVisits,
      includedServices,
      notes,
      customMessage,
    } = body

    // Validate required fields
    if (
      !customerId ||
      !lawnSize ||
      !packageType ||
      !visitFrequencyDays ||
      pricePerVisitCents === undefined ||
      !estimatedAnnualVisits
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify customer exists
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id, name, phone, email, address, suburb')
      .eq('id', customerId)
      .single()

    if (customerError || !customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Generate secure token for proposal access
    const token = crypto.randomUUID()

    // Set expiry date (14 days from now)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 14)

    // Create proposal
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .insert({
        customer_id: customerId,
        token,
        lawn_size: lawnSize,
        package_type: packageType,
        visit_frequency_days: visitFrequencyDays,
        price_per_visit_cents: pricePerVisitCents,
        estimated_annual_visits: estimatedAnnualVisits,
        included_services: includedServices || [],
        notes: notes || null,
        custom_message: customMessage || null,
        status: 'sent',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (proposalError) {
      console.error('Error creating proposal:', proposalError)
      return NextResponse.json(
        { error: 'Failed to create proposal', details: proposalError.message },
        { status: 500 }
      )
    }

    // Update customer status to proposal_sent
    await supabase
      .from('customers')
      .update({
        status: 'proposal_sent',
        lawn_size: lawnSize,
        package_type: packageType,
      })
      .eq('id', customerId)

    // Generate proposal URL
    const proposalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/proposal/${token}`

    // Send proposal email
    let emailSent = false
    let emailError = null

    if (customer.email) {
      const expiryDate = new Date(proposal.expires_at).toLocaleDateString('en-NZ', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })

      const emailHtml = generateProposalEmail({
        customerName: customer.name,
        address: customer.address || '',
        suburb: customer.suburb || undefined,
        lawnSize,
        packageType,
        visitFrequencyDays,
        pricePerVisit: pricePerVisitCents / 100,
        estimatedAnnualVisits,
        estimatedAnnualCost: (pricePerVisitCents / 100) * estimatedAnnualVisits,
        includedServices,
        notes: notes || undefined,
        customMessage: customMessage || undefined,
        proposalUrl,
        expiryDate,
      })

      const emailResult = await sendEmail(
        customer.email,
        '🌿 Your Lawn Care Proposal from Handy Help',
        emailHtml
      )

      emailSent = emailResult.success
      emailError = emailResult.error || null

      if (!emailResult.success) {
        console.error('Failed to send proposal email:', emailResult.error)
      }
    }

    return NextResponse.json({
      success: true,
      proposalId: proposal.id,
      token: proposal.token,
      proposalUrl,
      expiresAt: proposal.expires_at,
      emailSent,
      emailError,
    })
  } catch (error) {
    console.error('Proposal creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to list all proposals (for admin)
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: proposals, error } = await supabase
      .from('proposals')
      .select(`
        *,
        customers:customer_id (
          name,
          phone,
          email,
          address,
          suburb
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching proposals:', error)
      return NextResponse.json(
        { error: 'Failed to fetch proposals' },
        { status: 500 }
      )
    }

    return NextResponse.json({ proposals })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
