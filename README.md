# 🚗 Sheggar Wheels

**A peer-to-peer car rental marketplace for Addis Ababa, Ethiopia.**

Sheggar Wheels is a full-stack web application designed to connect car owners with people looking to rent cars. The platform aims to make discovering cars, managing rental bookings, communicating with owners, and coordinating rentals easier through one centralized marketplace.

## ✨ Planned Features

- **Authentication & Authorization** — Secure user authentication and role-based access control.
- **Car Listings** — Create, manage, and browse car listings.
- **Search & Filtering** — Discover cars based on relevant criteria.
- **Booking Management** — Request and manage car rentals with booking statuses.
- **Real-Time Chat** — Enable renters and car owners to communicate.
- **Email Notifications** — Send important updates about bookings and account activities.
- **In-App Notifications** — Keep users informed about relevant events.
- **Reviews & Feedback** — Allow renters to review completed rental experiences.
- **Payment Tracking** — Track payment status for bookings.
- **Admin Management** — Support administrative oversight and platform moderation.

> Features will be implemented progressively as development continues.

## 🛠️ Tech Stack

### Frontend
- Next.js
- React
- TypeScript

### Backend
- NestJS
- TypeScript
- REST API

### Database & ORM
- PostgreSQL
- Prisma ORM

### Additional Technologies
- WebSocket-based real-time communication
- Email delivery integration
- Authentication and authorization tools

Specific libraries and external services will be documented as they are selected and integrated.

## 🏗️ Architecture

Sheggar Wheels follows a full-stack architecture with a separate frontend and backend.

```text
sheggar-wheels/
├── client/       # Next.js application
├── server/        # NestJS API
└── README.md
```

The directory structure above is a suggested layout and may evolve during development.

## 🚀 Getting Started

The setup instructions will be added as the application is implemented.

In general, running the project locally will require:

- Node.js and npm
- A PostgreSQL database
- Environment variables for database connectivity and other configured services

Once the application setup is established, this section will include installation, configuration, database migration, and development commands.

## 🔐 Environment Variables

Configuration will be managed through environment variables.

A local environment file may be needed for values such as:

- Database connection URL
- Authentication secrets
- Email service credentials
- Other integration credentials

**Never commit real secrets or production credentials to version control.** Provide a sanitized `.env.example` file when the required variables are defined.

## 🗺️ Development Roadmap

- [ ] Project setup and architecture
- [ ] Database schema and Prisma configuration
- [ ] Authentication and authorization
- [ ] Car listing management
- [ ] Booking lifecycle and availability validation
- [ ] Real-time chat
- [ ] Email and in-app notifications
- [ ] Reviews and feedback
- [ ] Payment tracking
- [ ] Admin functionality
- [ ] Testing, deployment, and documentation

## 🎯 Project Goals

Sheggar Wheels is being developed as a portfolio project to practice and demonstrate full-stack development, relational database design, backend architecture, API development, and real-time application features.

## 📄 License

A license will be selected and added as the project evolves.
