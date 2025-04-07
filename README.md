# Next.js Project Setup Guide

## Prerequisites

-   Node.js (v18.17 or later)
-   npm (Node Package Manager)

## Initial Project Setup

### 1. Clone the Repository

```
git clone git@github.com:CMSC-128-A2/UPCampus-frontend.git
cd UPCampus-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

1. Create a new file in the root directory named `.env.local`
2. Paste this:
    ```
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiZG9uZG9uZG9uIiwiYSI6ImNsdDFycmgzeTAwamoya3A3N2RzaWRqYXIifQ.HvB01bmNjXn-eqwJ2FSP5Q
    ```

### 4. Development Server

Start the local development server:

```bash
npm run dev
```

Access the app at `http://localhost:3000`
