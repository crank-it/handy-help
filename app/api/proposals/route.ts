import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

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

    // Validate enum values
    const validLawnSizes = ['small', 'medium', 'large']
    const validPackageTypes = ['standard', 'premium']
    
    if (!validLawnSizes.includes(lawnSize)) {
      return NextResponse.json(
        { error: `Invalid lawn size. Must be one of: ${validLawnSizes.join(', ')}` },
        { status: 400 }
      )
    }
    
    if (!validPackageTypes.includes(packageType)) {
      return NextResponse.json(
        { error: `Invalid package type. Must be one of: ${validPackageTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate numeric values
    if (visitFrequencyDays <= 0) {
      return NextResponse.json(
        { error: 'Visit frequency must be greater than 0' },
        { status: 400 }
      )
    }

    if (pricePerVisitCents < 0) {
      return NextResponse.json(
        { error: 'Price per visit cannot be negative' },
        { status: 400 }
      )
    }

    if (estimatedAnnualVisits <= 0) {
      return NextResponse.json(
        { error: 'Estimated annual visits must be greater than 0' },
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

    // Validate customer has required fields
    if (!customer.address) {
      return NextResponse.json(
        { error: 'Customer must have an address to create a proposal' },
        { status: 400 }
      )
    }

    // Generate secure token for proposal access
    const token = crypto.randomUUID()

    // Set expiry date (14 days from now)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 14)

    // Create proposal
    // Note: custom_message requires migration 007 to be run
    const proposalData: any = {
      customer_id: customerId,
      token,
      lawn_size: lawnSize,
      package_type: packageType,
      visit_frequency_days: visitFrequencyDays,
      price_per_visit_cents: pricePerVisitCents,
      estimated_annual_visits: estimatedAnnualVisits,
      included_services: includedServices || [],
      notes: notes && notes.trim() !== '' ? notes : null,
      status: 'sent',
      expires_at: expiresAt.toISOString(),
    }

    // Only add custom_message if it's provided (backwards compatible)
    if (customMessage && customMessage.trim() !== '') {
      proposalData.custom_message = customMessage
    }

    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .insert(proposalData)
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
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    const proposalUrl = `${baseUrl}/proposal/${token}`

    return NextResponse.json({
      success: true,
      proposalId: proposal.id,
      token: proposal.token,
      proposalUrl,
      expiresAt: proposal.expires_at,
    })
  } catch (error) {
    console.error('Proposal creation error:', error)
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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
