# AnyForm

AnyForm is a powerful, modern, open-source form builder platform designed for seamless data collection, advanced analytics, and complete customization. Built with a focus on developer experience and end-user simplicity, AnyForm allows individuals and organizations to create, share, and analyze complex forms with ease.

## Key Features

- **Intuitive Visual Builder**: A fully drag-and-drop interface for constructing forms quickly without writing a single line of code.
- **Multi-Step & Single-Step Workflows**: Create complex multi-page surveys or straightforward single-page data collection forms.
- **Extensive Field Types**: Support for a wide variety of input types including text, numbers, dates, selections, and file uploads.
- **Advanced Theming and Customization**: Complete control over form layouts, branding, and styling to match your organizational identity.
- **Comprehensive Analytics Dashboard**: Built-in visual analytics and charts to track form performance, submission rates, and user engagement over time.
- **Seamless Publishing & Sharing**: Generate instant shareable links, embeddable code snippets, and downloadable QR codes for immediate distribution.
- **Robust Security**: Enterprise-grade encryption and access controls to ensure your collected data remains private and secure.

## Technology Stack

AnyForm is built upon a cutting-edge, high-performance technology stack, utilizing a monorepo architecture for scalability and maintainability.

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4, Radix UI, Base UI, Framer Motion
- **Backend & API**: tRPC (Type-safe RPC), Better Auth
- **Database & ORM**: PostgreSQL, Drizzle ORM
- **Tooling**: Turborepo, pnpm, TypeScript, ESLint, Prettier

## Monorepo Architecture

The project is structured as a monorepo managed by Turborepo and pnpm workspaces, dividing responsibilities into distinct applications and shared packages:

### Applications

- `apps/web`: The primary Next.js user interface, encompassing the dashboard, form builder, and public form rendering.
- `apps/api`: The backend service layer handling requests and background tasks.

### Packages

- `packages/database`: Database schemas, migrations, and Drizzle ORM configurations.
- `packages/trpc`: The tRPC router and API definitions for type-safe client-server communication.
- `packages/services`: Core business logic, separated from the transport layer.
- `packages/logger`: Shared logging utilities across the monorepo.
- `packages/eslint-config`: Shared linting rules.
- `packages/typescript-config`: Shared TypeScript configurations.

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js (v20.9.0 or higher)
- pnpm (v9.0.0 or higher)
- PostgreSQL database

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/TheSoumenMondal/anyform.git
   cd anyform
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory based on `.env.example` (if provided) or configure your database connection string and authentication secrets.

   ```bash
   DATABASE_URL="postgres://user:password@localhost:5432/anyform"
   ```

4. **Database Migrations**
   Generate and apply the database migrations using Drizzle.

   ```bash
   pnpm run db:generate
   pnpm run db:migrate
   ```

5. **Start the Development Server**
   ```bash
   pnpm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

## Scripts & Commands

- `pnpm run dev`: Starts the development servers for all applications.
- `pnpm run build`: Compiles and builds all applications and packages for production.
- `pnpm run lint`: Runs ESLint across the entire workspace.
- `pnpm run format`: Formats code using Prettier.
- `pnpm run check-types`: Runs TypeScript compiler checks without emitting files.
