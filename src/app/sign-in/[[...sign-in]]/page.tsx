// src/app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign In to Status Page</h1>
          <p className="mt-2 text-gray-600">Monitor and manage your services</p>
        </div>
        <SignIn appearance={{ 
          elements: { 
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case'
          } 
        }} />
      </div>
    </div>
  );
}