# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based multi-tenant Content Management System with hierarchical permissions. Frontend-only application using React 19, Vite, and Tailwind CSS. All data persists in localStorage (no backend).

## Commands

```bash
# Development
cd frontend && npm run dev      # Start Vite dev server (http://localhost:5173)

# Build & Deploy
cd frontend && npm run build    # Production build
cd frontend && npm run preview  # Preview production build

# Code Quality
cd frontend && npm run lint     # Run ESLint
```

## Architecture

### Permission Hierarchy
1. **Super Admin** - System-wide control, project creation/deletion
2. **Project Admin** - Project-specific management, user/content control  
3. **Regular User** - Content posting, board interaction

Permission checks via `frontend/src/utils/permissions.js`:
- `isSuperAdmin()` - Check super admin status
- `isProjectAdmin(projectId)` - Check project admin status
- `hasProjectManagementPermission(projectId)` - Check management access

### Routing Structure

Protected routes enforced in `App.jsx`:
- `/login` - Unified login (all user types)
- `/dashboard` - Super admin only
- `/create-project` - Super admin only
- `/project/:projectId` - Public project homepage
- `/project/:projectId/admin` - Project admin dashboard

### Data Storage Pattern

localStorage keys:
- `superAdmin` - Super admin session
- `project_${projectId}_user` - Project user session
- `project_${projectId}_categories` - Dynamic menu items
- `project_${projectId}_posts` - Board posts
- `project_${projectId}_pageContent_${categoryId}` - Page HTML content

### Real-time Updates

Cross-tab/window synchronization:
1. **Storage events** - Cross-tab communication
2. **PostMessage API** - Same-tab updates between admin panel and homepage

Implementation in `CategoryManagementTab.jsx:notifyProjectHomepage()`:
```javascript
// Notify same-tab windows
window.postMessage({ type: 'categoriesUpdated', projectId }, '*');
// Storage event triggers automatically for other tabs
```

### Component Architecture

#### Core Pages
- `LoginPage` - Mountain background, unified auth
- `DashboardPage` - Super admin project management
- `CreateProjectPage` - New project setup
- `ProjectHomePage` - Dynamic public-facing site
- `ProjectAdminDashboard` - Project management interface

#### Admin Tabs (`frontend/src/components/admin/`)
- `DashboardTab` - Statistics overview
- `UserManagementTab` - User CRUD
- `CategoryManagementTab` - Menu/page management
- `BoardManagementTab` - Post moderation
- `SettingsTab` - Project configuration

#### Shared Components
- `UserAuth` - Login/signup modal
- `PageEditor` - HTML content editor
- `PostEditor` - Board post creation
- `ProfileManager` - User profile editing

### Content Types

1. **Page** - Static HTML content, admin-editable
2. **Board** - User-generated posts with comments
3. **Gallery** - Image-focused board variant

Default categories on project creation:
- 소개 (Introduction) - Page type
- 일반 (General) - Page type  
- 게시판 (Board) - Board type
- 갤러리 (Gallery) - Board type

### Styling System

Consistent glassmorphism design:
- Background: Mountain image with dark overlay
- Components: `bg-white/90 backdrop-blur-sm`
- Active states: Blue accent (`border-blue-500 text-blue-600`)
- Transitions: `transition-colors` for smooth interactions

## Development Workflow

### Adding New Features
1. Check permission requirements in route protection
2. Use existing localStorage patterns for data persistence
3. Implement real-time sync with storage events/postMessage
4. Follow existing component structure and styling

### Testing User Flows
Development accounts (stored in localStorage):
- Super Admin: `admin` / `admin123`
- Project Admin: Created via admin panel
- Regular User: Self-registration via signup

### Important Considerations
- All file uploads stored as base64 in localStorage (production needs backend)
- Korean text in UI (consider i18n for production)
- No data validation on client (add backend validation for production)
- Cross-tab sync relies on storage events (may not work in private browsing)