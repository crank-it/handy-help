// GET /api/messages - Get messages with optional filters
import { NextRequest, NextResponse } from 'next/server'
import { getMessages, getConversation, getMessageStats } from '@/lib/data/messages'
import type { MessageStatus } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const customerId = searchParams.get('customerId')
    const direction = searchParams.get('direction') as 'outbound' | 'inbound' | null
    const status = searchParams.get('status') as MessageStatus | null
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined
    const conversation = searchParams.get('conversation') === 'true'
    const stats = searchParams.get('stats') === 'true'

    // Return stats only
    if (stats) {
      const messageStats = await getMessageStats()
      return NextResponse.json(messageStats)
    }

    // Return conversation for a specific customer
    if (customerId && conversation) {
      const messages = await getConversation(customerId)
      return NextResponse.json({ messages })
    }

    // Return filtered messages
    const messages = await getMessages({
      customerId: customerId || undefined,
      direction: direction || undefined,
      status: status || undefined,
      limit,
      offset,
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
