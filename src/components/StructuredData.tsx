'use client';

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VozenPark.mk',
    url: 'https://vozenpark.mk',
    logo: 'https://vozenpark.mk/VozenPark_logo.svg',
    description: 'Smart vehicle reminder system for tracking registration, insurance, and inspection dates.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MK',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@vozenpark.mk',
      contactType: 'customer service',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SoftwareApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'VozenPark.mk',
    operatingSystem: 'Web, iOS, Android',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '990',
      priceCurrency: 'MKD',
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
    description: 'Track your vehicle registration, insurance, and inspection dates. Get timely reminders before they expire.',
    featureList: [
      'Automatic reminders 30, 7, and 1 day before expiration',
      'Dashboard view of all vehicles',
      'CSV import/export',
      'Multi-user support',
      'Mobile-friendly PWA',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
