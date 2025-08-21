# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based Content Management System (CMS) with a multi-tier permission system. The project consists of a frontend-only application using React, Vite, and Tailwind CSS. Data persistence is handled through localStorage.

## Commands

### Development
```bash
cd frontend
npm run dev    # Start Vite dev server with hot reload
```

### Build
```bash
cd frontend
npm run build  # Build for production with Vite
```

### Linting
```bash
cd frontend
npm run lint   # Run ESLint on the codebase
```

### Preview Production Build
```bash
cd frontend
npm run preview  # Preview the production build locally
```

## Architecture

### Tech Stack
- **Frontend Framework**: React 19 with React Router DOM
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Flowbite components
- **Icons**: FontAwesome and Flaticon
- **Data Storage**: localStorage (no backend currently)
- **Deployment**: Frontend-only static site

### Permission System
The application implements a three-tier permission hierarchy:
1. **Super Admin**: Full system access, can create projects and manage all content
2. **Project Admin**: Manages specific projects, users, and content within their assigned projects
3. **Regular Users**: Can access projects, post content, and interact with boards

Authentication is managed through `localStorage` with permission utilities in `frontend/src/utils/permissions.js`.

### Core Routes
- `/login` - Public login page
- `/dashboard` - Super admin dashboard
- `/create-project` - Super admin project creation
- `/project/:projectId` - Public project homepage
- `/project/:projectId/admin` - Project admin dashboard

### Key Components Structure

#### Pages
- `LoginPage` - Unified login for all user types with mountain background
- `DashboardPage` - Super admin main dashboard
- `CreateProjectPage` - Project creation interface
- `ProjectHomePage` - Dynamic project frontend with customizable categories
- `ProjectAdminDashboard` - Project-specific admin panel

#### Admin Components (`frontend/src/components/admin/`)
- `DashboardTab` - Overview statistics
- `UserManagementTab` - User CRUD operations
- `CategoryManagementTab` - Dynamic menu/category management
- `BoardManagementTab` - Board content management
- `SettingsTab` - Project settings

#### Shared Components
- `UserAuth` - Login/signup modal
- `PageEditor` - HTML content editor for pages
- `PostEditor` - Board post creation/editing
- `ProfileManager` - User profile management

### Data Flow
1. **Category Management**: Admin creates/edits categories → Saved to localStorage → Real-time sync via storage events and postMessage → Homepage updates dynamically
2. **User Authentication**: Login → Role detection → localStorage session → Permission-based UI rendering
3. **Content Editing**: Admin edits page → HTML saved to localStorage → Immediate UI update

### Styling Conventions
- Glassmorphism design with `bg-white/90 backdrop-blur-sm`
- Consistent mountain background image across login, dashboard, and project creation pages
- Tailwind utility classes for all styling
- Responsive design with mobile-first approach

## Development Notes

### localStorage Keys Pattern
- User data: `users` (global user list)
- Session: `currentUser` (active session)
- Project data: `project_${projectId}_${dataType}` (e.g., `project_1_categories`)

### Real-time Sync Implementation
The application uses a dual approach for cross-tab communication:
1. Storage events for cross-tab sync
2. PostMessage for same-tab updates

See `notifyProjectHomepage` function in `CategoryManagementTab.jsx` for implementation details.

### Component Communication
- Parent-child: Props and callbacks
- Cross-component: localStorage events
- Same-tab: PostMessage API

### File Upload Handling
File uploads are managed through the `FileUpload` component with localStorage-based storage simulation. In production, this would need backend integration.