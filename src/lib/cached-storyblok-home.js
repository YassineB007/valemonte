import { unstable_cache } from "next/cache";
import { getStoryblokApi } from "@storyblok/react/rsc";
import "@/lib/storyblok";

export const getHomeStory = unstable_cache(
  async () => {
    try {
      const storyblokApi = getStoryblokApi();
      const version = process.env.NODE_ENV === "development" ? "draft" : "published";
      const { data } = await storyblokApi.get(`cdn/stories/home`, { version });
      return data.story;
    } catch {
      return null;
    }
  },
  ["storyblok-home-story"],
  { revalidate: 60, tags: ["storyblok-home"] }
);
