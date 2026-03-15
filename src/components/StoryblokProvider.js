'use client';
import { storyblokInit, apiPlugin } from '@storyblok/react/rsc';
import Page from './Page';
import HeroSection from './HeroSection';
import PhilosophySection from './PhilosophySection';
import CraftsmanshipSection from './CraftsmanshipSection';
import AtelierBanner from './AtelierBanner';

const components = {
  page: Page,
  hero_section: HeroSection,
  philosophy_section: PhilosophySection,
  craftsmanship_section: CraftsmanshipSection,
  atelier_banner: AtelierBanner,
};

storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
  use: [apiPlugin],
  components,
  apiOptions: {
    region: 'us', // Storyblok has 'us', 'ca' or 'eu' region. Default is EU. Often it's empty for EU. We can remove 'region'.
  }
});

export default function StoryblokProvider({ children }) {
  return children;
}
