# EDUARC — Convert Existing Pages into a Continuous Scrolling Homepage

## Objective
Transform the existing EDUARC website homepage into a seamless, vertically scrolling experience by reusing the existing website pages, sections, components, designs and content.

IMPORTANT: Do not create new designs or duplicate existing pages. Use the actual existing pages and integrate their existing components into the homepage in the required order.

## 1. Required section sequence

Integrate the existing pages/components in this order:

1. Home / Hero
2. About EDUARC
3. Programs
4. Features & Benefits
5. Testimonials
6. Contact Us
7. Partner With Us

## 2. Reuse existing pages

Before implementation:
- Inspect all existing routes, page components and layouts.
- Identify the existing About, Programs, Testimonials, Contact and Partnership pages.
- Reuse their existing content, images, styling and functional components.
- Extract reusable sections from existing pages where necessary.
- Do not recreate content that already exists.
- Preserve existing database connections and Supabase functionality.

## 3. Homepage integration

Render the existing page sections sequentially inside the main homepage route (`/`).

Each section should:
- Maintain its existing visual identity and functionality.
- Fit naturally into the continuous homepage layout.
- Have a unique section ID.
- Use appropriate vertical spacing.
- Animate smoothly into view while scrolling.

Do not embed entire page layouts inside the homepage if they contain duplicate navigation bars, footers or page-specific headers. Reuse their actual content sections instead.

## 4. Navigation behavior

Keep the existing website header and navigation.

Update navigation links to scroll to the corresponding homepage sections:
- Home → Hero
- About Us → Existing About section
- Programs → Existing Programs section
- Testimonials → Existing Testimonials section
- Contact → Existing Contact section
- Partner With Us → Existing Partnership section

Use smooth anchor scrolling and highlight the active navigation item based on the visible section.

## 5. Scrolling experience

- Natural continuous vertical scrolling.
- Smooth transitions between sections.
- Subtle fade-in and slide-up animations.
- Maintain existing section backgrounds and visual styles.
- No forced scroll snapping or scroll locking.
- Sticky navigation with suitable top offset for anchor navigation.
- Respect reduced-motion accessibility settings.

## 6. Preserve existing functionality

All existing functionality must continue working:
- Program cards must open their existing program detail pages.
- Mentor cards must open existing mentor profiles.
- Institution links must open existing institution pages.
- Testimonial links must work.
- Contact actions must remain functional.
- Partnership CTAs must navigate to the existing partnership page.
- Authentication and profile functionality must remain unchanged.

## 7. Dedicated pages must remain accessible

This change applies to the homepage presentation only.

Do not remove, overwrite or convert existing dedicated routes into homepage sections.

Visitors must still be able to open individual pages directly using their existing URLs.

## 8. Final technical requirements

- Use the existing Next.js and TypeScript architecture.
- Reuse existing components instead of duplicating them.
- Preserve Supabase integrations and existing data.
- Avoid unnecessary dependencies.
- Avoid breaking existing routes.
- Ensure desktop, tablet and mobile responsiveness.
- Optimize animations and below-the-fold image loading.

## Acceptance criteria

The homepage should become one continuous scrolling experience using existing EDUARC content.

Visitors scroll through all seven sections without navigating away from the homepage.

The original dedicated pages remain independently accessible and fully functional.

DO NOT redesign the existing pages. DO NOT generate duplicate sections. DO NOT replace existing content with placeholder content.

First audit the existing codebase, then implement the integration with minimal changes.