// GET /api/messages/templates - Get message templates
// POST /api/messages/templates - Create a new template
import { NextRequest, NextResponse } from 'next/server'
import { getTemplates, createTemplate, updateTemplate } from '@/lib/data/messages'
import type { TemplateCategory } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get('category') as TemplateCategory | null
    const activeOnly = searchParams.get('activeOnly') !== 'false'

    const templates = await getTemplates({
      category: category || undefined,
      activeOnly,
    })

    // Group templates by category for easier use in UI
    const grouped = templates.reduce((acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = []
      }
      acc[template.category].push(template)
      return acc
    }, {} as Record<string, typeof templates>)

    return NextResponse.json({
      templates,
      grouped,
      categories: Object.keys(grouped),
    })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.category || !body.template_body) {
      return NextResponse.json(
        { error: 'name, category, and template_body are required' },
        { status: 400 }
      )
    }

    const template = await createTemplate({
      name: body.name,
      category: body.category,
      template_body: body.template_body,
      whatsapp_template_name: body.whatsapp_template_name,
      whatsapp_template_namespace: body.whatsapp_template_namespace,
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Failed to create template' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, template })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    const { id, ...updates } = body

    const success = await updateTemplate(id, updates)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update template' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}
