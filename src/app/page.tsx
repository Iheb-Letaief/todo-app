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
      <div className="page-wrapper">
        <div className="page-body">
          <div className="container-fluid">
            <div className="row min-vh-100 align-items-center justify-content-center py-5">
              <div className="col-12 col-sm-10 col-lg-8">
                  <div className="card-body text-center p-4 p-md-5">
                    <h1 className="display-3 mb-3 mb-md-4 text-wrap">
                      {t('home.hero.title')}
                    </h1>
                    <p className="text-muted fs-lg mb-4 px-lg-5">
                      {t('home.hero.subtitle')}
                    </p>

                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 gap-sm-3 mb-5">
                      <Link href="/register" className="btn btn-primary btn-lg">
                        {t('home.hero.getStarted')}
                      </Link>
                      <Link href="/login" className="btn btn-secondary btn-lg">
                        <span className="">
                          {t('home.hero.login')}
                        </span>
                      </Link>
                    </div>

                    <div className="row g-3 g-md-4">
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
            </div>
          </div>
        </div>
      </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
      <div className="col-12 col-sm-6">
        <div className="card h-100">
          <div className="card-body p-4">
            <h3 className="card-title h4 mb-3">{title}</h3>
            <p className="text-muted mb-0">{description}</p>
          </div>
        </div>
      </div>
  );
}