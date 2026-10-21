import aboutFallback from "@/data/about.json";
import brandsFallback from "@/data/brands.json";
import galleryFallback from "@/data/gallery.json";
import selectedWorksFallback from "@/data/selected-works.json";
import socialsFallback from "@/data/socials.json";
import testimonialsFallback from "@/data/testimonials.json";
import toolsFallback from "@/data/tools.json";
import worksFallback from "@/data/works.json";

import { client } from "./client";
import {
  ABOUT_PAGE_QUERY,
  ALL_WORKS_QUERY,
  FEATURED_WORKS_QUERY,
  HOME_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
  TESTIMONIALS_QUERY,
} from "./queries";

export type GalleryItem = {
  id: string | number;
  type: "image" | "video";
  src: string;
  alt: string;
  thumbnail?: string;
  poster?: string;
};

export type AboutFocusCard = {
  id: number;
  title: string;
  description: string;
  color: string;
};

export type IconItem = {
  id: string;
  icon: string;
  label: string;
};

export type BrandItem = {
  id: string;
  icon: string;
  label?: string;
};

export type SiteSettings = {
  contactHeading: string;
  contactIntro: string;
  email?: string;
  bookingLink?: string;
  socials: Array<{ id: string | number; label: string; link: string }>;
};

export type HomePageContent = {
  heroHeadline: string;
  heroIntro: string;
  heroCtaLabel: string;
  heroCtaLink: string;
  gallery: GalleryItem[];
  quoteText: string;
  quoteAttribution: string;
};

export type AboutPageContent = {
  headline: string;
  body: string;
  headshot: string;
  focusCards: AboutFocusCard[];
  tools: IconItem[];
  brands: BrandItem[];
};

export type TestimonialItem = {
  id: string | number;
  quote: string;
  name: string;
  title: string;
  rating: number;
  image: string;
};

export type WorkContent = {
  _id?: string;
  title: string;
  type: string;
  production: string;
  year: string | number;
  imageUrl: string;
  link: string;
  featuredLayout?: "auto" | "standard" | "wide" | null;
  role?: string;
  previewTitle?: string;
  synopsis?: string;
};

const fallbackHome: HomePageContent = {
  heroHeadline: "LAUGHTER EPHRAIM",
  heroIntro:
    "I am an AMVCA-nominated film editor with a passion to create stories. With 6 years in the film industry, I have developed a love for bringing stories to life with precision and creativity.",
  heroCtaLabel: "Get in touch",
  heroCtaLink: "/#contact-me",
  gallery: galleryFallback as GalleryItem[],
  quoteText:
    "The essence of cinema is editing. It's the combination of what can be extraordinary images of people during emotional moments, or images in a general sense, put together in a kind of alchemy.",
  quoteAttribution: "Francis Ford Coppola",
};

const fallbackAbout: AboutPageContent = {
  headline: "About Laughter",
  body: "Hi there! I'm Laughter Ephraim, an AMVCA-nominated film editor with a passion to create stories. With 6 years in the film industry, I have developed a love for bringing stories to life with precision and creativity. I believe in the power of storytelling and its ability to connect, inspire and entertain. It's more than just editing. It's about conveying a message that matters.",
  headshot: "/images/laughter-headshot.jpg",
  focusCards: aboutFallback as AboutFocusCard[],
  tools: toolsFallback as IconItem[],
  brands: (brandsFallback as Array<{ id: string; icon: string }>).map(
    (brand) => ({
      ...brand,
      label: brand.id,
    }),
  ),
};

const fallbackSettings: SiteSettings = {
  contactHeading: "Contact Me",
  contactIntro:
    "Share a brief, timeline, or collaboration idea and I'll get back to you.",
  bookingLink: "https://calendar.app.google/f4RhQrpnjYe2uv6y5",
  socials: socialsFallback,
};

type FetchOptions = {
  label: string;
  timeoutMs?: number;
};

const getSanityFetchTimeout = () => {
  const configuredTimeout = Number(process.env.SANITY_FETCH_TIMEOUT_MS);

  if (Number.isFinite(configuredTimeout) && configuredTimeout > 0) {
    return configuredTimeout;
  }

  return 15000;
};

async function sanityFetch<T>(
  query: string,
  { label, timeoutMs = getSanityFetchTimeout() }: FetchOptions,
): Promise<T | null> {
  const controller = new AbortController();
  const timeout = windowlessTimeout(() => controller.abort(), timeoutMs);

  try {
    return await client.fetch<T>(query, {}, { signal: controller.signal });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Sanity fetch error";

    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `Failed to fetch Sanity content for ${label}: ${message}`,
      );
    }

    console.warn(`Using local fallback for ${label}: ${message}`);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function windowlessTimeout(callback: () => void, ms: number) {
  return setTimeout(callback, ms);
}

export async function getHomePageContent(): Promise<HomePageContent> {
  const data = await sanityFetch<Partial<HomePageContent>>(HOME_PAGE_QUERY, {
    label: "homePage",
  });
  return {
    ...fallbackHome,
    ...data,
    gallery: data?.gallery?.length ? data.gallery : fallbackHome.gallery,
  };
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  const data = await sanityFetch<Partial<AboutPageContent>>(ABOUT_PAGE_QUERY, {
    label: "aboutPage",
  });
  return {
    ...fallbackAbout,
    ...data,
    focusCards: data?.focusCards?.length
      ? data.focusCards.map((card, index) => ({ ...card, id: index + 1 }))
      : fallbackAbout.focusCards,
    tools: data?.tools?.length ? data.tools : fallbackAbout.tools,
    brands: data?.brands?.length ? data.brands : fallbackAbout.brands,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await sanityFetch<Partial<SiteSettings>>(SITE_SETTINGS_QUERY, {
    label: "siteSettings",
  });
  return {
    ...fallbackSettings,
    ...data,
    socials: data?.socials?.length ? data.socials : fallbackSettings.socials,
  };
}

export async function getFeaturedWorks(): Promise<WorkContent[]> {
  const data = await sanityFetch<WorkContent[]>(FEATURED_WORKS_QUERY, {
    label: "featuredWorks",
  });
  return data?.length ? data : (selectedWorksFallback as WorkContent[]);
}

export async function getAllWorks(): Promise<WorkContent[]> {
  const data = await sanityFetch<WorkContent[]>(ALL_WORKS_QUERY, {
    label: "allWorks",
  });
  return data?.length ? data : (worksFallback as WorkContent[]);
}

export async function getTestimonials(): Promise<TestimonialItem[]> {
  const data = await sanityFetch<TestimonialItem[]>(TESTIMONIALS_QUERY, {
    label: "testimonials",
  });
  return data?.length
    ? data.map((item, index) => ({ ...item, id: item.id ?? index + 1 }))
    : (testimonialsFallback as TestimonialItem[]);
}
