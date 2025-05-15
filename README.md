# Currency Futures Arbitrage Platform

This platform calculates and visualizes implied interest rate differentials from currency futures contracts to identify arbitrage opportunities. It incorporates advanced yield curve modeling functionality powered by QuantLib with an enhanced UI optimized for 1920x1080 resolution.

## Features

- Dashboard with summary stats and currency pair data
- Historical data visualization with interactive charts
- Arbitrage opportunity detection with heatmap visualization
- Authentication system with email/password login
- Responsive design with a custom purple theme
- Advanced yield curve construction with QuantLib integration
- Interactive visualization optimized for 1920x1080 display resolution
- Modern UI components with multiple styling variants
- Redesigned yield curves page with 3-column layout featuring:
  - QuantLib feature highlights and educational content
  - Parameter controls with advanced configuration options
  - Interactive chart with multiple visualization modes

## Tech Stack

- Next.js 14+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- NextAuth.js for authentication
- Recharts for data visualization
- QuantLib integration for advanced financial modeling

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

### GitHub Integration

1. Push your code to GitHub:
   ```bash
   # Add all changes
   git add .
   
   # Commit changes
   git commit -m "Update README and finalize UI improvements"
   
   # Push to GitHub
   git push origin main
   ```

### Connecting to Vercel

1. Import your GitHub repository to Vercel:
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Select "Import Git Repository"
   - Choose this repository
   - Click "Deploy"

2. For subsequent deployments, simply push to your GitHub repository:
   ```bash
   git push origin main
   ```
   Vercel will automatically detect the push and start a new deployment.

### Environment Variables

After deployment, configure these environment variables in the Vercel project settings:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add the following variables:
   - `NEXTAUTH_URL`: The URL of your deployed application (e.g., `https://sp-frontend.vercel.app`)
   - `NEXTAUTH_SECRET`: A secure random string for production (use a password generator)

Vercel automatically detects Next.js projects and configures the appropriate build settings.

### Branch Previews

Vercel automatically creates preview deployments for each branch and pull request, allowing you to test changes before merging to the main branch.

## Auth Credentials

For testing purposes, you can use:
- Email: `test@example.com`
- Password: `password123`

## Project Structure

- `/src/app`: App Router pages and API routes
- `/src/components`: Reusable UI components
  - `/src/components/ui`: UI components like Card, Badge, etc.
  - `/src/components/layout`: Layout components including MainLayout, Header, Sidebar
  - `/src/components/charts`: Data visualization components
- `/src/utils`: Utility functions including calculations
- `/src/types`: TypeScript interfaces and types
- `/src/actions`: Server actions for authentication

## UI Components

The platform features several enhanced UI components:

- **Card**: Multiple variants including default, elevated, outlined, and glass with accent color support
- **Badge**: Flexible badge component with various sizes, colors, and display variants
- **Header**: Enhanced header with breadcrumbs, actions, tabs, and status indicators
- **MainLayout**: Responsive layout with collapsible sidebar
- **YieldCurveChart**: Interactive chart with QuantLib integration, multiple view modes, and enhanced controls

## API Endpoints

- `/api/currency-pairs`: Get list of available currency pairs
- `/api/historical-data`: Get historical data for a currency pair
- `/api/market-data`: Get current market data
- `/api/yield-curve`: Get yield curve data with optional parameters for interpolation method

## QuantLib Integration

The platform integrates QuantLib for advanced term structure modeling with the following features:

- **Interpolation Methods**: Cubic spline, linear, Nelson-Siegel-Svensson, and Smith-Wilson
- **Curve Types**: Zero rates, par rates, and forward rates
- **Visualization**: Interactive charts with zooming, highlighting, and reference lines
- **Parameter Control**: Adjustable resolution and model parameters
- **Educational Information**: Technical documentation about each curve building method
- **Enhanced UI**: Optimized for 1920x1080 resolution with properly sized components
- **Model Comparison**: Side-by-side visualization of different curve building techniques
- **Forward Rate Calculation**: Derivation and display of forward rates from zero curves
- **Market Data Table**: Detailed display of market data points with calculated metrics
- **Curve Information Cards**: Clear presentation of curve metadata and parameters

## License

This project is licensed under the MIT License - see the LICENSE file for details.
