# Todo List

This is a monorepo containing a full-stack Todo List application with Angular frontend and ASP.NET backend.

## Project Structure

- `/frontend` - Angular application
  - `/src/app` - Angular components and modules
  - `/src/styles.scss` - Global styles
  - `tailwind.config.js` - Tailwind CSS configuration

- `/backend` - ASP.NET Core API
  - `/Controllers` - API endpoints
  - `/Models` - Data models
  - `/DTOs` - Data transfer objects
  - `/Services` - Business logic
  - `/Repositories` - Data access layer
  - `/Data` - Database context
  - `/Middleware` - Custom middleware
  - `/Migrations` - Database migrations

## Technologies Used

### Frontend
- Angular (Latest LTS)
- TypeScript
- Angular Material
- Tailwind CSS

### Backend
- ASP.NET Core (Latest LTS)
- Entity Framework Core
- SQLite Database

## Prerequisites

- Node.js and npm
- .NET SDK
- Visual Studio Code (recommended)

## Getting Started

### Setup Instructions

1. Clone the repository

2. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

3. Set up the backend:
   ```bash
   cd backend
   dotnet restore
   dotnet ef database update
   ```

4. Start the backend API:
   ```bash
   cd backend
   dotnet run
   ```

5. Start the frontend application:
   ```bash
   cd frontend
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:4200
- Backend API: http://localhost:5000
