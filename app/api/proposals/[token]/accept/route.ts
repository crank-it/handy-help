import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateCustomerVisits } from '@/lib/data/visits'

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

    // Check if expired
    const now = new Date()
    const expiresAt = new Date(proposal.expires_at)
    if (now > expiresAt) {
      // Mark as expired
      await supabase
        .from('proposals')
        .update({ status: 'expired' })
        .eq('id', proposal.id)

      return NextResponse.json(
        { error: 'Proposal has expired' },
        { status: 400 }
      )
    }

    // Update proposal status to accepted
    const { error: updateProposalError } = await supabase
      .from('proposals')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', proposal.id)

    if (updateProposalError) {
      console.error('Error updating proposal:', updateProposalError)
      return NextResponse.json(
        { error: 'Failed to accept proposal' },
        { status: 500 }
      )
    }

    // Update customer status to active
    const { error: updateCustomerError } = await supabase
      .from('customers')
      .update({
        status: 'active',
        proposal_accepted_at: new Date().toISOString(),
      })
      .eq('id', proposal.customer_id)

    if (updateCustomerError) {
      console.error('Error updating customer:', updateCustomerError)
      return NextResponse.json(
        { error: 'Failed to update customer status' },
        { status: 500 }
      )
    }

    // Generate year of visits using simplified fixed frequency
    const visits = generateCustomerVisits(
      proposal.customer_id,
      proposal.package_type,
      proposal.lawn_size
    )

    // Insert visits
    const { error: visitsError } = await supabase
      .from('visits')
      .insert(visits)

    if (visitsError) {
      console.error('Error creating visits:', visitsError)
      // Don't fail the acceptance if visits creation fails
      // Visits can be regenerated manually
    }

    return NextResponse.json({
      success: true,
      message: 'Proposal accepted successfully',
      visitCount: visits.length,
    })
  } catch (error) {
    console.error('Proposal acceptance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
