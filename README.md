# UPSee

UPSee is a University of the Philippines Cebu campus explorer web application that provides an interactive aerial map of the university. Users can navigate the campus virtually, click on buildings to view detailed information, enter buildings to explore classrooms, and access room-specific details such as schedules and availability. The platform features a powerful search functionality to quickly locate campus facilities. UPSee also includes an admin interface that allows authorized personnel to manage and update room information, schedules, contact details, and other relevant data.

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
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=<your-access-token>
    ```

### 4. Development Server

Start the local development server:

```bash
npm run dev
```

Access the app at `http://localhost:3000`

## CI/CD

This project uses GitHub Actions for continuous integration. The workflow automatically builds the application whenever changes are pushed to any branch or when pull requests are created.

### Build Workflow

The build workflow:

1. Runs on all branch pushes and pull requests
2. Sets up Node.js v18
3. Installs dependencies
4. Builds the Next.js application
5. Uploads the build artifacts for later use

You can view the workflow status in the Actions tab of the GitHub repository.
