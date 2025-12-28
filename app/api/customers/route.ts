import { NextRequest, NextResponse } from 'next/server'
import { createCustomer } from '@/lib/data/customers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.phone || !body.address) {
      return NextResponse.json(
        { error: 'Name, phone, and address are required' },
        { status: 400 }
      )
    }

    // Create customer
    const result = await createCustomer({
      name: body.name,
      email: body.email || undefined,
      phone: body.phone,
      address: body.address,
      suburb: body.suburb || undefined,
      lawn_size: body.lawn_size || undefined,
      package_type: body.package_type || undefined,
      special_instructions: body.special_instructions || undefined,
      start_date: body.start_date || undefined,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create customer' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, customerId: result.customerId },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in POST /api/customers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

