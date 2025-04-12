// src/app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create Status Page Account</h1>
          <p className="mt-2 text-gray-600">Start monitoring your services</p>
        </div>
        <SignUp appearance={{ 
          elements: { 
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case'
          } 
        }} />
      </div>
    </div>
  );
}