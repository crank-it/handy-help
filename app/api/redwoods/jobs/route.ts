import { NextRequest, NextResponse } from 'next/server'
import { createRedwoodsJob } from '@/lib/data/redwoods'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const job = await createRedwoodsJob(body)
    
    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('Error creating Redwoods job:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
}

