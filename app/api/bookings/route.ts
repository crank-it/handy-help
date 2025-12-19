import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateCustomerVisits } from '@/lib/data/visits'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      address,
      suburb,
      services,
      otherServiceDescription,
      name,
      phone,
      email,
      specialInstructions,
    } = body

    // Validate required fields
    if (!address || !services || services.length === 0 || !name || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Create customer record
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert({
        name,
        email: email || null,
        phone,
        address,
        suburb: suburb || null,
        services,
        other_service_description: otherServiceDescription || null,
        special_instructions: specialInstructions || null,
        status: 'pending_inspection',
      })
      .select()
      .single()

    if (customerError) {
      console.error('Error creating customer:', customerError)
      return NextResponse.json(
        { error: 'Failed to create booking', details: customerError.message },
        { status: 500 }
      )
    }

    // Note: Visits will be generated after proposal acceptance, not at booking time

    // Send notification email (if Resend is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const serviceLabels: Record<string, string> = {
          lawn_clearing: 'Lawn Clearing',
          edge_trimming: 'Edge Trimming',
          hedging: 'Hedging',
          other: otherServiceDescription || 'Other Service',
        }
        const servicesHtml = services.map((s: string) => serviceLabels[s]).join(', ')

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'Handy Help <bookings@handyhelp.nz>',
            to: process.env.NOTIFICATION_EMAIL || 'william@handyhelp.nz',
            subject: `New Site Inspection Request: ${name}`,
            html: `
              <h2>New Site Inspection Booking</h2>
              <p><strong>Customer:</strong> ${name}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
              <p><strong>Address:</strong> ${address}${suburb ? ', ' + suburb : ''}</p>
              <p><strong>Services Requested:</strong> ${servicesHtml}</p>
              ${specialInstructions ? `<p><strong>Special Instructions:</strong> ${specialInstructions}</p>` : ''}
              <p><strong>Status:</strong> Pending Inspection</p>
              <p><strong>Next Step:</strong> Schedule and complete site inspection, then create proposal</p>
              <p><a href="https://handyhelp.nz/admin/customers/${customer.id}">View Customer Details</a></p>
            `,
          }),
        })
      } catch (emailError) {
        console.error('Error sending email:', emailError)
        // Don't fail the booking if email fails
      }
    }

    return NextResponse.json({
      success: true,
      customerId: customer.id,
    })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
