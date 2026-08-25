"use client";
import { useEffect, useState } from "react";
import {
  fetchProjects, fetchLayouts, fetchPlots, fetchSettings, fetchHeroBanners,
  fetchGallery, fetchAmenities, fetchTestimonials, fetchFAQs, fetchTeam,
  fetchOffers, fetchBrochures, fetchNews, fetchNearbyPlaces, fetchVideos,
  fetchStats, fetchTimeline,
} from "@/lib/data";
import type {
  Project, Layout, Plot, CompanySettings, HeroBanner, GalleryImage,
  Amenity, Testimonial, FAQ, TeamMember, Offer, Brochure, NewsItem,
  NearbyPlace, VideoItem, CompanyStat, TimelineEvent,
} from "@/lib/types";

// Generic async hook with loading/error state and periodic refetch to reflect admin updates.
export function useAsync<T>(fn: () => Promise<T>, refetchMs = 0) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let interval: ReturnType<typeof setInterval> | undefined;
    const load = async () => {
      try {
        const result = await fn();
        if (active) { setData(result); setError(null); }
      } catch (e: unknown) {
        if (active) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    if (refetchMs > 0) interval = setInterval(load, refetchMs);
    return () => {
      active = false;
      if (interval) clearInterval(interval);
    };
  }, [refetchMs]);

  return { data, loading, error };
}

export const useProjects = (refetchMs = 0) => useAsync<Project[]>(fetchProjects, refetchMs);
export const useLayouts = (refetchMs = 0) => useAsync<Layout[]>(fetchLayouts, refetchMs);
export const usePlots = (refetchMs = 30000) => useAsync<Plot[]>(fetchPlots, refetchMs);
export const useSettings = () => useAsync<CompanySettings>(fetchSettings);
export const useHeroBanners = () => useAsync<HeroBanner[]>(fetchHeroBanners);
export const useGallery = () => useAsync<GalleryImage[]>(fetchGallery);
export const useAmenities = () => useAsync<Amenity[]>(fetchAmenities);
export const useTestimonials = () => useAsync<Testimonial[]>(fetchTestimonials);
export const useFAQs = () => useAsync<FAQ[]>(fetchFAQs);
export const useTeam = () => useAsync<TeamMember[]>(fetchTeam);
export const useOffers = () => useAsync<Offer[]>(fetchOffers);
export const useBrochures = () => useAsync<Brochure[]>(fetchBrochures);
export const useNews = () => useAsync<NewsItem[]>(fetchNews);
export const useNearbyPlaces = () => useAsync<NearbyPlace[]>(fetchNearbyPlaces);
export const useVideos = () => useAsync<VideoItem[]>(fetchVideos);
export const useStats = () => useAsync<CompanyStat[]>(fetchStats);
export const useTimeline = () => useAsync<TimelineEvent[]>(fetchTimeline);
