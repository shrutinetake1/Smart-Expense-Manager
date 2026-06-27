# Smart Expense Manager

A production-ready, full-stack Smart Expense Manager SaaS with premium UI/UX, scalable backend architecture, JWT authentication, analytics dashboard, AI-powered insights, and responsive design.

## Tech Stack

### Frontend
- React 18+ with TypeScript
- Vite (build tool)
- Tailwind CSS v4
- Shadcn UI components
- Framer Motion animations
- React Router v6
- React Hook Form + Zod validation
- Zustand (state management)
- Recharts (charts & graphs)
- Axios (HTTP client)

### Backend
- Node.js + Express.js + TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication with Refresh Tokens
- bcrypt password hashing
- Multer + Cloudinary (file uploads)
- OpenAI API (AI insights)
- Nodemailer (email)
- Winston (logging)
- Helmet, CORS, Rate Limiting

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or pnpm

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database URL and secrets
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

### Environment Variables

#### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/expense_manager
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
PORT=5000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
OPENAI_API_KEY=your-openai-key
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
CLIENT_URL=http://localhost:5173
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/  # UI components (Shadcn + custom)
│   │   ├── pages/       # Route-level pages
│   │   ├── hooks/       # Custom React hooks
│   │   ├── services/    # API service layer
│   │   ├── store/       # Zustand stores
│   │   ├── types/       # TypeScript types
│   │   ├── utils/       # Helpers & formatters
│   │   └── layouts/     # Page layouts
│   └── ...
│
├── backend/           # Node.js + Express + TypeScript
│   ├── prisma/        # Database schema & migrations
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── routes/      # Express routes
│   │   ├── middleware/  # Auth, error, validation
│   │   ├── services/    # Business logic
│   │   ├── utils/       # Logger, helpers
│   │   └── config/      # Configuration
│   └── ...
│
└── README.md
```

## License

MIT
