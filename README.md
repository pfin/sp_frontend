# Currency Futures Arbitrage Platform

This platform calculates and visualizes implied interest rate differentials from currency futures contracts to identify arbitrage opportunities.

## Features

- Dashboard with summary stats and currency pair data
- Historical data visualization with interactive charts
- Arbitrage opportunity detection with heatmap visualization
- Authentication system with email/password login
- Responsive design with a custom purple theme

## Tech Stack

- Next.js 14+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- NextAuth.js for authentication
- Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/sp_frontend.git
   cd sp_frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-development-secret
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Automated Deployment

1. Push your code to GitHub
2. Import your GitHub repository to Vercel
3. Configure environment variables in the Vercel dashboard:
   - `NEXTAUTH_URL`: Your production URL
   - `NEXTAUTH_SECRET`: A secure random string for production

### Manual Deployment

1. Install Vercel CLI
   ```bash
   npm install -g vercel
   ```

2. Log in to Vercel
   ```bash
   vercel login
   ```

3. Deploy to Vercel
   ```bash
   vercel
   ```

4. For production deployment
   ```bash
   vercel --prod
   ```

## Auth Credentials

For testing purposes, you can use:
- Email: `test@example.com`
- Password: `password123`

## Project Structure

- `/src/app`: App Router pages and API routes
- `/src/components`: Reusable UI components
- `/src/utils`: Utility functions including calculations
- `/src/types`: TypeScript interfaces and types
- `/src/components/charts`: Data visualization components

## API Endpoints

- `/api/currency-pairs`: Get list of available currency pairs
- `/api/historical-data`: Get historical data for a currency pair
- `/api/market-data`: Get current market data

## License

This project is licensed under the MIT License - see the LICENSE file for details.
