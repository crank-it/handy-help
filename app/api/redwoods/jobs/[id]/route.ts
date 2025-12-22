import { NextRequest, NextResponse } from 'next/server'
import { updateRedwoodsJob } from '@/lib/data/redwoods'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const job = await updateRedwoodsJob(id, body)
    
    return NextResponse.json(job)
  } catch (error) {
    console.error('Error updating Redwoods job:', error)
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    )
  }
}

