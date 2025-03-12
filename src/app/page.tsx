'use client';

import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export default function Home() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-white to-gray-100 text-gray-800">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('home.hero.title')}
          </h1>
          <p className="text-lg md:text-xl mb-8">
            {t('home.hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Link href="/register">
              <button className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
                {t('home.hero.getStarted')}
              </button>
            </Link>
            <Link href="/login">
              <button className="cursor-pointer bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition">
                {t('home.hero.login')}
              </button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 text-left">
            <FeatureCard
                title={t('home.features.taskManagement.title')}
                description={t('home.features.taskManagement.description')}
            />
            <FeatureCard
                title={t('home.features.sharing.title')}
                description={t('home.features.sharing.description')}
            />
            <FeatureCard
                title={t('home.features.multilingual.title')}
                description={t('home.features.multilingual.description')}
            />
            <FeatureCard
                title={t('home.features.security.title')}
                description={t('home.features.security.description')}
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