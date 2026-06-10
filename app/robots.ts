import type { MetadataRoute } from "next";

// Demo dashboard with mock data — block all crawlers.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
