import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/grooming",
    "/boarding",
    "/about",
    "/contact",
    "/safety",
    "/terms",
    "/privacy",
  ].map((path) => ({
    url: `https://snipandstyle.pet${path}`,
    changeFrequency: "monthly",
    priority:
      path === ""
        ? 1
        : path === "/grooming" || path === "/boarding"
          ? 0.9
          : 0.5,
  }));
}
