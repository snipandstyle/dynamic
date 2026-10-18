import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin",
        "/account",
        "/cart",
        "/checkout",
        "/design-reference.html",
      ],
    },
    sitemap: "https://snipandstyle.pet/sitemap.xml",
  };
}
