#!/usr/bin/env node

/**
 * Handy Help NZ - Environment Setup Checker
 *
 * Run this script to verify your environment is configured correctly:
 * node check-setup.js
 */

const fs = require('fs')
const path = require('path')

const checks = {
  passed: [],
  failed: [],
  warnings: []
}

function checkmark(passed) {
  return passed ? '✅' : '❌'
}

function log(message, type = 'info') {
  const colors = {
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    info: '\x1b[36m',
    reset: '\x1b[0m'
  }
  console.log(`${colors[type]}${message}${colors.reset}`)
}

function check(name, passed, failMessage) {
  if (passed) {
    checks.passed.push(name)
    log(`${checkmark(true)} ${name}`, 'success')
  } else {
    checks.failed.push(name)
    log(`${checkmark(false)} ${name}`, 'error')
    if (failMessage) {
      log(`   → ${failMessage}`, 'warning')
    }
  }
}

function warn(name, message) {
  checks.warnings.push(name)
  log(`⚠️  ${name}`, 'warning')
  log(`   → ${message}`, 'info')
}

console.log('\n🔍 Checking Handy Help NZ Setup...\n')

// Check 1: .env.local exists
const envPath = path.join(__dirname, '.env.local')
const envExists = fs.existsSync(envPath)
check(
  '.env.local file exists',
  envExists,
  'Create .env.local from .env.example template'
)

// Check 2: Environment variables
if (envExists) {
  const envContent = fs.readFileSync(envPath, 'utf8')

  const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=') &&
                         !envContent.includes('NEXT_PUBLIC_SUPABASE_URL=your-project-url')
  check(
    'Supabase URL configured',
    hasSupabaseUrl,
    'Add your Supabase project URL to .env.local'
  )

  const hasAnonKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=') &&
                     !envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key')
  check(
    'Supabase anon key configured',
    hasAnonKey,
    'Add your Supabase anon key to .env.local'
  )

  const hasServiceKey = envContent.includes('SUPABASE_SERVICE_KEY=') &&
                        !envContent.includes('SUPABASE_SERVICE_KEY=your-service-role-key')
  check(
    'Supabase service key configured',
    hasServiceKey,
    'Add your Supabase service role key to .env.local'
  )

  const hasResendKey = envContent.includes('RESEND_API_KEY=re_')
  if (!hasResendKey) {
    warn(
      'Resend API key not configured',
      'Email notifications will not work. Sign up at resend.com if needed.'
    )
  } else {
    check('Resend API key configured (optional)', true)
  }

  const hasAdminPassword = envContent.includes('ADMIN_PASSWORD=') &&
                           !envContent.includes('ADMIN_PASSWORD=your-secure-password')
  if (!hasAdminPassword) {
    warn(
      'Admin password not set',
      'Set a secure password for admin access'
    )
  } else {
    check('Admin password configured', true)
  }
}

// Check 3: Required files exist
const requiredFiles = [
  'supabase/migrations/001_initial_schema.sql',
  'app/api/bookings/route.ts',
  'app/api/health/route.ts',
  'lib/supabase/client.ts',
  'lib/supabase/server.ts',
  'lib/data/customers.ts',
  'lib/data/visits.ts',
  'lib/data/schedule.ts'
]

let allFilesExist = true
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file))
  if (!exists) allFilesExist = false
})

check(
  'All required files present',
  allFilesExist,
  'Some files are missing - this may indicate incomplete setup'
)

// Check 4: node_modules
const nodeModulesExists = fs.existsSync(path.join(__dirname, 'node_modules'))
check(
  'Dependencies installed',
  nodeModulesExists,
  'Run: npm install'
)

// Check 5: package.json has required dependencies
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')
)
const hasSupabaseDeps =
  packageJson.dependencies['@supabase/ssr'] &&
  packageJson.dependencies['@supabase/supabase-js']
check(
  'Supabase dependencies in package.json',
  hasSupabaseDeps,
  'Install Supabase: npm install @supabase/ssr @supabase/supabase-js'
)

// Summary
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

if (checks.failed.length === 0) {
  log('🎉 Setup Complete!', 'success')
  console.log('\nNext steps:')
  console.log('1. Make sure you\'ve run the SQL migration in Supabase')
  console.log('2. Start the dev server: npm run dev')
  console.log('3. Test the connection: http://localhost:3002/api/health')
  console.log('4. Try creating a booking: http://localhost:3002')
} else {
  log(`⚠️  ${checks.failed.length} issue(s) need attention`, 'error')
  console.log('\nFailed checks:')
  checks.failed.forEach(item => console.log(`  • ${item}`))
  console.log('\nSee SUPABASE_SETUP.md for detailed instructions')
}

if (checks.warnings.length > 0) {
  log(`\n📋 ${checks.warnings.length} optional warning(s)`, 'warning')
}

console.log(`\nPassed: ${checks.passed.length} | Failed: ${checks.failed.length} | Warnings: ${checks.warnings.length}`)
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

process.exit(checks.failed.length > 0 ? 1 : 0)
