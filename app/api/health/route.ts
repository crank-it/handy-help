import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
      resendApiKey: !!process.env.RESEND_API_KEY,
    },
    database: {
      connected: false,
      tables: [] as string[],
      error: null as string | null,
    },
  }

  // Check database connection
  try {
    const supabase = await createClient()

    // Try to query the database - data variable not used, just checking connection
    const { error } = await supabase
      .from('customers')
      .select('count')
      .limit(1)

    if (error) {
      checks.database.error = error.message
    } else {
      checks.database.connected = true
    }

    // List tables
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    if (tables) {
      checks.database.tables = tables.map((t: { table_name: string }) => t.table_name)
    }
  } catch (error: unknown) {
    checks.database.error = error instanceof Error ? error.message : 'Unknown error'
  }

  const allGood =
    checks.environment.supabaseUrl &&
    checks.environment.supabaseAnonKey &&
    checks.database.connected

  return NextResponse.json(
    {
      status: allGood ? 'healthy' : 'unhealthy',
      ...checks,
    },
    { status: allGood ? 200 : 503 }
  )
}
