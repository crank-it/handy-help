import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const formData = await request.formData()
    const message = formData.get('message') as string

    if (!message || message.trim() === '') {
      return NextResponse.redirect(`/c/${slug}?error=empty_message`)
    }

    const supabase = await createClient()

    // Get customer by slug
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('url_slug', slug)
      .single()

    if (customerError || !customer) {
      return NextResponse.redirect(`/c/${slug}?error=customer_not_found`)
    }

    // Insert message
    const { error: messageError } = await supabase
      .from('portal_messages')
      .insert({
        customer_id: customer.id,
        sender: 'customer',
        message: message.trim(),
      })

    if (messageError) {
      console.error('Error creating message:', messageError)
      return NextResponse.redirect(`/c/${slug}?error=message_failed`)
    }

    return NextResponse.redirect(`/c/${slug}?success=message_sent`)
  } catch (error) {
    console.error('Portal message error:', error)
    const { slug } = await params
    return NextResponse.redirect(`/c/${slug}?error=server_error`)
  }
}

