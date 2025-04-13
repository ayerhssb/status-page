# Status Page

Status Page is a modern, multi-tenant monitoring dashboard that allows teams to track the operational status of their services, incidents, and maintenance events in real-time. Built with Next.js App Router, it features Clerk authentication, organization-based access, and a beautifully minimal UI with Tailwind CSS.

---

## 🧭 Screenshots

| Dashboard with Services | Empty Org Dashboard |
|--------------------------|----------------------|
| ![Services](./public/screenshots/screenshot-1.png) | ![Empty Org](./public/screenshots/screenshot-2.png) |

| Clerk Profile Dropdown | Clerk Sign-In Page |
|------------------------|--------------------|
| ![Clerk Dropdown](./public/screenshots/screenshot-3.png) | ![Sign In](./public/screenshots/screenshot-4.png) |

---

## 🛠 Tech Stack

- **Next.js 14 (App Router)**
- **React**
- **Tailwind CSS**
- **Prisma ORM**
- **PostgreSQL**
- **Clerk (Auth & Organizations)**

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/status-page.git
cd status-page
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root of the project with the following:

```env
# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 4. Setup the database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

## 🚀 Run the App

```bash
npm run dev
```

Your app will be running at [http://localhost:3000](http://localhost:3000)

---

## 🔐 Auth & Orgs

This app uses **Clerk** to support:
- Email/password & OAuth login
- Multi-organization access
- Role-based navigation for services/incidents

---

## 📁 Folder Structure (Simplified)

```
src/
  app/
    (dashboard)/
      incidents/
      services/
      maintenance/
  components/
  lib/
  prisma/
```

---

## 📄 License

MIT

---

## 💬 Contributions

PRs and improvements welcome! Just open an issue first for discussion.
