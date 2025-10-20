# SayDraft Client

Next.js frontend for the SayDraft AI-powered contract platform.

## Environment Variables

Create a `.env.local` file in this directory with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# Stripe Configuration (Client-side)
# Get this from your Stripe Dashboard > Products > [Your Product] > Pricing
NEXT_PUBLIC_STRIPE_PRICE_ID=price_1234567890abcdef
```

## Getting Started

1. Install dependencies:
```bash
yarn install
```

2. Create `.env.local` file with the variables above

3. Run the development server:
```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
yarn build
yarn start
```

