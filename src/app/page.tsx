'use client';

import Link from "next/link";


export default function Home() {
  return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-white to-gray-100 text-gray-800">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Manage Your Tasks Effortlessly</h1>
          <p className="text-lg md:text-xl mb-8">
            A powerful and user-friendly task management platform with authentication,
            role-based access, sharing functionality, multilingual support, and more.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Link href="/register">
              <button className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
                Get Started - Sign Up
              </button>
            </Link>
            <Link href="/login">
              <button className="cursor-pointer bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition">
                Already have an account? Login
              </button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 text-left">
            <FeatureCard
                title="📋 Task Management"
                description="Create, update, and organize your todo lists and tasks easily."
            />
            <FeatureCard
                title="👥 Share with Others"
                description="Share your todo lists with teammates with editable or read-only access."
            />
            <FeatureCard
                title="🌐 Multilingual Support"
                description="Use the app in English or French with a built-in language switcher."
            />
            <FeatureCard
                title="🔐 Secure Authentication"
                description="Signup, login, and password reset with secure authentication."
            />
          </div>
        </div>
      </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
      <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
  );
}
