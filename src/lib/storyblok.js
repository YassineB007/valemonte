import { storyblokInit, apiPlugin } from '@storyblok/react/rsc';
import Page from '@/components/Page';
import HeroSection from '@/components/HeroSection';
import PhilosophySection from '@/components/PhilosophySection';
import CraftsmanshipSection from '@/components/CraftsmanshipSection';
import AtelierBanner from '@/components/AtelierBanner';
import CollectionSection from '@/components/CollectionSection';

const components = {
  page: Page,
  hero_section: HeroSection,
  philosophy_section: PhilosophySection,
  craftsmanship_section: CraftsmanshipSection,
  atelier_banner: AtelierBanner,
  collection_section: CollectionSection,
};

storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
  use: [apiPlugin],
  components,
});
