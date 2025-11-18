# ShelfWise Library Management System - Project Instructions

## Project Overview
This is **ShelfWise** - a modern web application built with React, TypeScript, and Vite. The system provides role-based access control for managing library resources, users, and transactions.

## Tech Stack
- **Package Manager**: `pnpm`
- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM v7
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Native fetch with cookie-based auth
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Theme**: next-themes for dark/light mode support

## Authentication & Authorization
- **Auth Type**: HTTP cookie-based JWT authentication
- **Roles**: SUPER_ADMIN, ADMIN, MEMBER
- **Auth Store**: Zustand-based auth state management
- **Protected Routes**: Role-based route protection
- **Auto-redirect**: Users are redirected to role-specific dashboards

## API Integration
- **Base URL**: `/api`
- **Specification**: OpenAPI 3.0.3 (openapi.yaml)
- **Auth Endpoints**: `/auth/login`, `/auth/logout`, `/auth/me`, `/auth/refresh`
- **Response Format**: Standardized API responses with status, message, data, and timestamp
- **Error Handling**: Centralized error handling with user-friendly messages

## Development Guidelines
- Use TypeScript for type safety
- Follow shadcn/ui component patterns
- Implement proper error boundaries and loading states
- Use Framer Motion for smooth animations
- Maintain consistent styling with Tailwind CSS
- Follow React Router v7 patterns for navigation
- Use Zustand for global state management
- Implement proper form validation with React Hook Form + Zod

## Environment Setup
- Node.js with pnpm
- Backend Spring API running on localhost:9080 with serving this project build files

## Important Notes
- All API calls include `credentials: "include"` for cookie handling
- Authentication state is managed globally via Zustand
- Role-based access control is enforced at both frontend and backend
- The system uses modern React patterns (hooks, functional components)
- Styling follows a consistent design system with shadcn/ui
