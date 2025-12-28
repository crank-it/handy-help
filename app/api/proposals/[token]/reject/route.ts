import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const supabase = await createClient()

    // Fetch proposal by token
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('*')
      .eq('token', token)
      .single()

    if (proposalError || !proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      )
    }

    // Check if proposal is still valid
    if (proposal.status !== 'sent') {
      return NextResponse.json(
        { error: `Proposal already ${proposal.status}` },
        { status: 400 }
      )
    }

    // Update proposal status to rejected
    const { error: updateProposalError } = await supabase
      .from('proposals')
      .update({
        status: 'rejected',
      })
      .eq('id', proposal.id)

    if (updateProposalError) {
      console.error('Error updating proposal:', updateProposalError)
      return NextResponse.json(
        { error: 'Failed to reject proposal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Proposal rejected',
    })
  } catch (error) {
    console.error('Proposal rejection error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

