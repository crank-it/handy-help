import { NextRequest, NextResponse } from 'next/server'
import { createRedwoodsCustomer } from '@/lib/data/redwoods'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const customer = await createRedwoodsCustomer(body)
    
    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Error creating Redwoods customer:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}

