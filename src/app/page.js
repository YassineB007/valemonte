/* Server Component — pure composition, no client JS */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CollectionSection from "@/components/CollectionSection";
import Footer from "@/components/Footer";
import '@/lib/storyblok';
import { getStoryblokApi, StoryblokStory } from "@storyblok/react/rsc";

export const dynamic = 'force-dynamic';

async function fetchData() {
  try {
    const storyblokApi = getStoryblokApi();
    const { data } = await storyblokApi.get(`cdn/stories/home`, { 
      version: "draft", 
    }, { cache: "no-store" });
    return data.story;
  } catch (error) {
    console.error("Storyblok Error: ", error.message);
    return null;
  }
}

export default async function Home() {
  const story = await fetchData();

  return (
    <>
      <Navbar />
      {story ? <StoryblokStory story={story} /> : <HeroSection />}
      <Footer />
    </>
  );
}
