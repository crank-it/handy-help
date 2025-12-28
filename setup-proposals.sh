#!/bin/bash

# Proposal System Setup Script
# This script helps set up the proposal system features

echo "🌿 Handy Help - Proposal System Setup"
echo "======================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found!"
    echo "   Please copy ENV_VARIABLES.txt to .env.local first:"
    echo "   cp ENV_VARIABLES.txt .env.local"
    echo ""
    exit 1
fi

# Check for database migration
echo "📊 Checking database migration status..."
echo ""
echo "To apply the new migration (add custom_message to proposals):"
echo "Run this SQL against your Supabase database:"
echo ""
cat supabase/migrations/007_add_custom_message_to_proposals.sql
echo ""
echo "You can run it via Supabase Dashboard → SQL Editor"
echo ""

# Check email configuration
echo "📧 Checking email configuration..."
if grep -q "RESEND_API_KEY=.\+" .env.local; then
    echo "✅ Resend API key configured"
elif grep -q "SENDGRID_API_KEY=.\+" .env.local; then
    echo "✅ SendGrid API key configured"
else
    echo "⚠️  No email service configured"
    echo "   Proposals will be created but emails won't be sent"
    echo "   Add RESEND_API_KEY or SENDGRID_API_KEY to .env.local"
fi
echo ""

# Check site URL
if grep -q "NEXT_PUBLIC_SITE_URL=.\+" .env.local; then
    SITE_URL=$(grep "NEXT_PUBLIC_SITE_URL=" .env.local | cut -d '=' -f2)
    echo "✅ Site URL configured: $SITE_URL"
else
    echo "⚠️  NEXT_PUBLIC_SITE_URL not set"
    echo "   Proposal links may not work correctly"
fi
echo ""

echo "🚀 Setup checklist:"
echo "   1. ✓ Proposal creation modal implemented"
echo "   2. ✓ Email templates created"
echo "   3. ✓ API endpoints ready"
echo "   4. ⏳ Run database migration (see above)"
echo "   5. ⏳ Configure email service (optional)"
echo ""

echo "To start the development server:"
echo "   npm run dev"
echo ""

echo "To access the proposal system:"
echo "   1. Navigate to http://localhost:3002/admin/proposals"
echo "   2. Click 'Create Proposal'"
echo "   3. Follow the 3-step wizard"
echo ""

echo "Documentation:"
echo "   See PROPOSAL_SYSTEM.md for complete details"
echo ""

