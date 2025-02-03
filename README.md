# Next.js Project Setup Guide

## Prerequisites
- Node.js (v18.17 or later)
- npm (Node Package Manager)

## Initial Project Setup

### 1. Clone the Repository
```bash
git clone git@github.com:CMSC-128-A2/UPCampus-backend.git
cd UPCampus-backend
```

### 2. Install Dependencies
```bash
npm install
```

<!-- ### 3. Environment Configuration
1. Copy `.env.example` to `.env.local`
2. Update environment variables as needed -->

### 4. Development Server
Start the local development server:
```bash
npm run dev
```
Access the app at `http://localhost:3000`

### 5. Production Build
Generate a production build:
```bash
npm run build
```

### 6. Run Production Build
```bash
npm start
```

## Project Structure
- `app/`: Next.js App Router pages
- `components/`: Reusable React components
- `public/`: Static assets
- `styles/`: Global CSS files

## Key Scripts
- `dev`: Start development server
- `build`: Create production build
- `start`: Run production build
- `lint`: Run ESLint
- `test`: Run project tests

## Recommended Tools
- VS Code
- ESLint extension
- Prettier extension


## Troubleshooting
- Ensure Node.js and npm are updated
- Clear npm cache: `npm cache clean --force`
- Reinstall dependencies if issues persist