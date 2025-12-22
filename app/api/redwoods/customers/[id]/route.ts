import { NextRequest, NextResponse } from 'next/server'
import { getRedwoodsCustomer, updateRedwoodsCustomer } from '@/lib/data/redwoods'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const customer = await getRedwoodsCustomer(id)
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error fetching Redwoods customer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const customer = await updateRedwoodsCustomer(id, body)
    
    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error updating Redwoods customer:', error)
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    )
  }
}

