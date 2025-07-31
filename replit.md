# Web5 DID Creator - Replit Development Guide

## Overview

This is a full-stack Web5 Decentralized Identity (DID) management application built with React, Express.js, and Web5 SDK. The application allows users to create, resolve, and manage Decentralized Identifiers using the Web5 platform for truly self-sovereign identity management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component system
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Style**: RESTful endpoints under `/api` prefix
- **Web5 Integration**: @web5/api SDK for DID operations and decentralized web node (DWN) interactions
- **Data Storage**: In-memory storage (MemStorage) with interface for future database integration
- **Development**: Hot reloading with Vite middleware integration

## Key Components

### DID Management System
- **DID Creation**: Supports multiple connection methods (auto, custom DWN endpoints, community nodes)
- **DID Resolution**: Resolves DIDs to their DID documents
- **Key Management**: Handles Ed25519 signing keys and X25519 encryption keys
- **Document Viewer**: JSON formatter for DID documents with copy functionality

### User Interface Components
- **DID Creation Card**: Form-based DID generation with configurable options
- **DID Display Card**: Shows generated DID with copy/refresh functionality
- **DID Resolver Card**: Input field for resolving external DIDs
- **System Status Card**: Real-time system health monitoring
- **Console Logs Section**: Live system logs with filtering and export

### Storage Layer
- **Interface-based Design**: IStorage interface allows for pluggable storage backends
- **Current Implementation**: In-memory storage for development
- **Schema Support**: Drizzle ORM schema defined for future PostgreSQL integration
- **Data Types**: DIDs, DID resolutions, and system logs

## Data Flow

1. **DID Creation Flow**:
   - User configures creation options (method, endpoints, sync settings)
   - Frontend sends request to `/api/did/create`
   - Backend initializes Web5 with specified configuration
   - Web5 SDK generates DID and associated keys
   - DID data stored in memory storage
   - Success response returned with DID document

2. **DID Resolution Flow**:
   - User enters DID identifier
   - Frontend calls `/api/did/resolve`
   - Backend uses Web5 SDK to resolve DID document
   - Resolution result cached in storage
   - Document displayed in formatted viewer

3. **System Monitoring Flow**:
   - Real-time status checks via `/api/status` endpoint
   - System logs streamed via `/api/logs` with automatic refresh
   - Error handling and user notifications via toast system

## External Dependencies

### Core Web5 Stack
- **@web5/api**: Primary Web5 SDK for DID operations
- **Web Crypto API**: Polyfilled for Node.js compatibility
- **DWN Endpoints**: Configurable decentralized web nodes for data storage

### Database Integration (Prepared)
- **Drizzle ORM**: Type-safe ORM with PostgreSQL dialect configured
- **@neondatabase/serverless**: Neon PostgreSQL driver ready for integration
- **Schema**: Defined in `shared/schema.ts` with tables for DIDs, resolutions, and logs

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library
- **TanStack Query**: Server state management with caching

## Deployment Strategy

### Development Setup
- **Hot Reloading**: Vite dev server with Express middleware integration
- **Environment**: NODE_ENV=development triggers development-specific features
- **Replit Integration**: Cartographer plugin and runtime error overlay for Replit environment

### Production Build
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Static Serving**: Production server serves built frontend assets
- **Database**: Environment expects DATABASE_URL for PostgreSQL connection

### Key Architectural Decisions

1. **Monorepo Structure**: Frontend (`client/`), backend (`server/`), and shared (`shared/`) code in single repository for easier development and deployment

2. **Memory Storage**: Chosen for development simplicity with clear migration path to PostgreSQL via Drizzle ORM interface

3. **Web5 SDK Integration**: Direct integration with @web5/api provides access to latest decentralized identity features while abstracting low-level cryptographic operations

4. **Type Safety**: Full TypeScript implementation with shared schema definitions ensures type consistency across frontend and backend

5. **Component Architecture**: Modular UI components with clear separation of concerns and reusable design system

6. **Real-time Monitoring**: Live system logs and status updates provide transparency into Web5 operations for debugging and user confidence