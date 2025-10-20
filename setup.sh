#!/bin/bash

# SayDraft Client Setup Script

echo "🚀 Setting up SayDraft Client..."
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists. Skipping creation."
    echo "   If you want to recreate it, delete it first."
else
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Stripe Configuration (Client-side)
# Get this from your Stripe Dashboard > Products > [Your Product] > Pricing
# Replace with your actual Stripe Price ID
NEXT_PUBLIC_STRIPE_PRICE_ID=price_1234567890abcdef
EOF
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Update NEXT_PUBLIC_STRIPE_PRICE_ID in .env.local with your actual Stripe Price ID"
fi

echo ""
echo "📦 Installing dependencies..."
yarn install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "🎯 Next steps:"
    echo "   1. Update NEXT_PUBLIC_STRIPE_PRICE_ID in .env.local"
    echo "   2. Make sure the server is running on port 5000 (set PORT=5000 in server/.env)"
    echo "   3. Run 'yarn dev' to start the development server"
    echo ""
else
    echo ""
    echo "❌ Installation failed. Please check the errors above."
    exit 1
fi

