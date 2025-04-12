// src/app/(dashboard)/layout.tsx
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { MdDashboard, MdOutlineWeb, MdWarning, MdOutlineSchedule } from "react-icons/md";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link href="/dashboard" className="text-xl font-semibold text-blue-600">
            Status Page
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
            <MdDashboard className="mr-3 text-gray-500" />
            Dashboard
          </Link>
          <Link href="/services" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
            <MdOutlineWeb className="mr-3 text-gray-500" />
            Services
          </Link>
          <Link href="/incidents" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
            <MdWarning className="mr-3 text-gray-500" />
            Incidents
          </Link>
          <Link href="/maintenance" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
            <MdOutlineSchedule className="mr-3 text-gray-500" />
            Maintenance
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <header className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white">
          <h1 className="text-lg font-medium">Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}