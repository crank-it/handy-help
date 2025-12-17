import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateCustomerVisits } from '@/lib/data/visits'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      address,
      suburb,
      lawnSize,
      packageType,
      name,
      phone,
      email,
      specialInstructions,
    } = body

    // Validate required fields
    if (!address || !lawnSize || !packageType || !name || !phone) {
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
        lawn_size: lawnSize,
        package_type: packageType,
        special_instructions: specialInstructions || null,
        status: 'pending_assessment',
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

    // Generate visits for the year
    const visits = generateCustomerVisits(customer.id, packageType, lawnSize)

    // Insert all visits
    const { error: visitsError } = await supabase
      .from('visits')
      .insert(visits)

    if (visitsError) {
      console.error('Error creating visits:', visitsError)
      // Customer was created but visits failed - still return success
      // as the customer record exists and visits can be regenerated
    }

    // Send notification email (if Resend is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'Handy Help <bookings@handyhelp.nz>',
            to: process.env.NOTIFICATION_EMAIL || 'william@handyhelp.nz',
            subject: `New Booking: ${name}`,
            html: `
              <h2>New Lawn Care Booking</h2>
              <p><strong>Customer:</strong> ${name}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
              <p><strong>Address:</strong> ${address}${suburb ? ', ' + suburb : ''}</p>
              <p><strong>Lawn Size:</strong> ${lawnSize}</p>
              <p><strong>Package:</strong> ${packageType}</p>
              ${specialInstructions ? `<p><strong>Special Instructions:</strong> ${specialInstructions}</p>` : ''}
              <p><strong>Status:</strong> Pending Assessment</p>
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
