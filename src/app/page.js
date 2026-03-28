/* Server Component — pure composition, no client JS */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CollectionSection from "@/components/CollectionSection";
import Footer from "@/components/Footer";
import { getHomeStory } from "@/lib/cached-storyblok-home";
import { StoryblokStory } from "@storyblok/react/rsc";

export const revalidate = 60;

export default async function Home() {
  const story = await getHomeStory();

  return (
    <>
      <Navbar />
      {story ? <StoryblokStory story={story} /> : <HeroSection />}
      <Footer />
    </>
  );
}
