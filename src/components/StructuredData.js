import { INTAKE_FORM_URL, INSTAGRAM_URL } from '../lib/links';

const person = {
  '@type': 'Person',
  '@id': 'https://emelifts.com/#person',
  name: 'Emelifts',
  jobTitle: 'Fitness Coach & Personal Trainer',
  description:
    'Coach-led strength training for women at home. Structured programming, check-ins, and accountability.',
  url: 'https://emelifts.com',
  image: 'https://emelifts.com/emelifts.png',
  sameAs: [INSTAGRAM_URL],
  offers: [
    {
      '@type': 'Service',
      name: 'Lift with EME, Monthly',
      description:
        'Monthly strength program with progressive at-home training and personalized coaching check-ins.',
      provider: { '@type': 'Person', name: 'Emelifts' },
    },
  ],
  knowsAbout: [
    'Strength Training',
    "Women's Fitness",
    'Personal Training',
    'Weight Lifting',
    'Muscle Building',
    'At-home workouts',
  ],
};

const organization = {
  '@type': 'Organization',
  '@id': 'https://emelifts.com/#organization',
  name: 'Emelifts',
  description:
    'Strength coaching for women: structured at-home training with a real coach in your corner.',
  url: 'https://emelifts.com',
  logo: 'https://emelifts.com/emelifts_logo.svg',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: INTAKE_FORM_URL,
  },
  sameAs: [INSTAGRAM_URL],
};

/** Single JSON-LD payload for layout (one script tag). */
export const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [person, organization],
};
