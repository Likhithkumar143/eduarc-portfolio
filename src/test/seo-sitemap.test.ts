import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("SEO, Sitemap & AI Search Readiness", () => {
  const rootDir = process.cwd();

  describe("Sitemap (public/sitemap.xml)", () => {
    const sitemapPath = path.join(rootDir, "public", "sitemap.xml");

    it("exists and is non-empty", () => {
      expect(fs.existsSync(sitemapPath)).toBe(true);
      const content = fs.readFileSync(sitemapPath, "utf-8");
      expect(content.length).toBeGreaterThan(100);
    });

    it("has valid XML declaration and standard sitemap namespace", () => {
      const content = fs.readFileSync(sitemapPath, "utf-8");
      expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(content).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    });

    it("contains all core public navigation routes", () => {
      const content = fs.readFileSync(sitemapPath, "utf-8");
      const expectedRoutes = [
        "https://eduarc-connect.in/",
        "https://eduarc-connect.in/about",
        "https://eduarc-connect.in/features",
        "https://eduarc-connect.in/programs",
        "https://eduarc-connect.in/mentors",
        "https://eduarc-connect.in/testimonials",
        "https://eduarc-connect.in/partner",
        "https://eduarc-connect.in/contact",
        "https://eduarc-connect.in/privacy-policy",
      ];
      for (const route of expectedRoutes) {
        expect(content).toContain(`<loc>${route}</loc>`);
      }
    });

    it("contains conducted program case study URLs", () => {
      const content = fs.readFileSync(sitemapPath, "utf-8");
      const programSlugs = [
        "sri-venkateshwara",
        "st-marys",
        "kendriya-vidyalaya",
        "dav-public",
        "psg-college",
        "sri-chaitanya",
        "chinmaya-vidyalaya",
        "vit-vellore",
        "bishop-heber",
      ];
      for (const slug of programSlugs) {
        expect(content).toContain(`<loc>https://eduarc-connect.in/programs/${slug}</loc>`);
      }
    });

    it("excludes private routes, redirects and admin portals", () => {
      const content = fs.readFileSync(sitemapPath, "utf-8");
      expect(content).not.toContain("/admin");
      expect(content).not.toContain("/reception");
      expect(content).not.toContain("/impact");
      expect(content).not.toContain("/mentor<");
      expect(content).not.toContain("/pricing");
    });

    it("contains valid W3C YYYY-MM-DD lastmod dates and omits deprecated priority/changefreq", () => {
      const content = fs.readFileSync(sitemapPath, "utf-8");
      const lastmodMatches = content.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g);
      expect(lastmodMatches).not.toBeNull();
      expect(lastmodMatches!.length).toBeGreaterThanOrEqual(18);

      // Modern Google guideline: <priority> and <changefreq> are ignored by Google
      expect(content).not.toContain("<priority>");
      expect(content).not.toContain("<changefreq>");
    });
  });

  describe("Robots configuration (public/robots.txt)", () => {
    const robotsPath = path.join(rootDir, "public", "robots.txt");

    it("exists and defines access rules", () => {
      expect(fs.existsSync(robotsPath)).toBe(true);
      const content = fs.readFileSync(robotsPath, "utf-8");
      expect(content).toContain("User-agent:");
    });

    it("allows AI search engines and crawler agents", () => {
      const content = fs.readFileSync(robotsPath, "utf-8");
      const aiAgents = [
        "GPTBot",
        "ChatGPT-User",
        "ClaudeBot",
        "PerplexityBot",
        "Google-Extended",
        "Applebot",
      ];
      for (const agent of aiAgents) {
        expect(content).toContain(`User-agent: ${agent}`);
      }
    });

    it("permits social link preview bots (WhatsApp, Facebook, Twitter)", () => {
      const content = fs.readFileSync(robotsPath, "utf-8");
      expect(content).toContain("User-agent: WhatsApp");
      expect(content).toContain("User-agent: facebookexternalhit");
      expect(content).toContain("User-agent: Twitterbot");
    });

    it("protects admin and reception staff portals from indexing", () => {
      const content = fs.readFileSync(robotsPath, "utf-8");
      expect(content).toContain("Disallow: /admin");
      expect(content).toContain("Disallow: /reception");
    });

    it("points directly to the canonical sitemap", () => {
      const content = fs.readFileSync(robotsPath, "utf-8");
      expect(content).toContain("Sitemap: https://eduarc-connect.in/sitemap.xml");
    });
  });

  describe("AI Agent & LLM Discovery (public/llms.txt and llms-full.txt)", () => {
    it("public/llms.txt provides structured briefing for AI search engines", () => {
      const llmsPath = path.join(rootDir, "public", "llms.txt");
      expect(fs.existsSync(llmsPath)).toBe(true);
      const content = fs.readFileSync(llmsPath, "utf-8");
      expect(content).toContain("EDUARC");
      expect(content).toContain("Bengaluru, Karnataka, India");
      expect(content).toContain("https://eduarc-connect.in");
      expect(content).toContain("partnerships@eduarc.in");
    });

    it("public/llms-full.txt provides detailed programmatic context", () => {
      const fullPath = path.join(rootDir, "public", "llms-full.txt");
      expect(fs.existsSync(fullPath)).toBe(true);
      const content = fs.readFileSync(fullPath, "utf-8");
      expect(content).toContain("Class 10 Students & Parents");
      expect(content).toContain("Class 12 & Pre-University");
      expect(content).toContain("Dr. Gayathri G N");
    });
  });

  describe("Social & WhatsApp Link Preview Assets (public/og-image.jpg)", () => {
    const ogImagePath = path.join(rootDir, "public", "og-image.jpg");

    it("exists and has a valid file size under 300KB for WhatsApp compatibility", () => {
      expect(fs.existsSync(ogImagePath)).toBe(true);
      const stats = fs.statSync(ogImagePath);
      // WhatsApp requires image < 300KB for instantaneous rich card previews
      expect(stats.size).toBeGreaterThan(10_000);
      expect(stats.size).toBeLessThan(300_000);
    });

    it("has valid JPEG magic bytes (FF D8)", () => {
      const buf = fs.readFileSync(ogImagePath);
      expect(buf[0]).toBe(0xff);
      expect(buf[1]).toBe(0xd8);
    });
  });

  describe("Google Site Verification (Search Console)", () => {
    it("public/googlee87f8b26b8c2d2b8.html exists with required verification string", () => {
      const gPath = path.join(rootDir, "public", "googlee87f8b26b8c2d2b8.html");
      expect(fs.existsSync(gPath)).toBe(true);
      const content = fs.readFileSync(gPath, "utf-8");
      expect(content).toContain("google-site-verification: googlee87f8b26b8c2d2b8.html");
    });

    it("src/routes/__root.tsx defines google-site-verification meta tags", () => {
      const rootPath = path.join(rootDir, "src", "routes", "__root.tsx");
      const content = fs.readFileSync(rootPath, "utf-8");
      expect(content).toContain('name: "google-site-verification"');
      expect(content).toContain("googlee87f8b26b8c2d2b8");
    });
  });
});


