EDUARC CONNECT – COMPLETE PREMIUM INTERACTION & ANIMATION SYSTEM

Website: https://eduarc-connect.in

I want to implement three premium interactive animation systems throughout my existing website.

The overall design should feel elegant, sophisticated, fluid and professionally art-directed.

Use the existing EduArc Connect brand identity:

Forest Green: #243B35
Warm Ivory: #E8E0D1
Muted Terracotta: #B47A4B
Charcoal: #343A36
Off White: #FAF9F5
Sage Green: #9AAB94

Typography:

Headings: Lora.
Body and navigation: DM Sans.

IMPORTANT: This is an enhancement of the existing website, NOT a complete redesign.

1. MAGNETIC DOCK NAVIGATION ANIMATION

Enhance the existing desktop header navigation with a subtle macOS Dock-inspired magnetic interaction.

Hover Behaviour

When the mouse moves over a navigation item:

The hovered item smoothly enlarges.
Nearby navigation items scale proportionally based on cursor distance.
Add subtle magnetic movement towards the cursor.
Use smooth spring-based animation.
Keep text readable and navigation stable.

Suggested scaling:

Normal: 1.0.
Nearby items: 1.04–1.08.
Hovered item: 1.10–1.15.
Active Navigation Indicator
Add a smooth sliding active-page indicator.
Move it between navigation items when routes change.
Detect the active route using TanStack Router.
Support browser back and forward navigation.
Keep the active indicator correctly synchronised with the current URL.
Page Transition Animation

When switching pages:

Fade out the current page.
Fade in the next page.
Add a subtle upward movement of approximately 8–12px.
Use a 250–350ms transition.
Keep navigation responsive without artificial loading delays.

Avoid remounting persistent layout components unnecessarily.

Responsive Behaviour
Desktop: Full magnetic interaction.
Tablet: Reduced magnetic movement.
Mobile: Disable mouse-based magnetic effects and retain touch-friendly navigation. 2. BLUR-UP IMAGE LOADING ANIMATION

Implement a Progressive Image Loading / LQIP system throughout the entire website.

Image Loading Behaviour

For every existing image:

Display a small blurred image preview immediately.
Load the original high-resolution image in the background.
Smoothly transition from blurred to sharp after loading.
Remove the placeholder after successful loading.
Preserve image dimensions to prevent layout shifts.
Animation Settings
Initial blur: 15–20px.
Final blur: 0px.
Initial opacity: 0.8.
Final opacity: 1.
Transition duration: 350–600ms.
Easing: Smooth ease-out.
Apply To
Homepage hero images.
Programme images.
Mentor profiles.
About page images.
Cards and thumbnails.
Gallery images.
Blog images.
Footer images.
All other existing website images.
Image Performance
Use WebP or AVIF where supported.
Generate lightweight low-resolution placeholders.
Use lazy loading for below-the-fold images.
Prioritise hero images and important above-the-fold content.
Avoid preloading every image.
Reuse browser and CDN caching.
Use responsive image sizes.
Avoid unnecessary JavaScript.
Reusable Image Component

Inspect the existing image architecture and implement a reusable ProgressiveImage component where appropriate.

It should support:

Original image URL.
Low-resolution placeholder.
Alt text.
Aspect ratio.
Responsive image sources.
Loading priority.
Error fallback.

Do not replace existing images or change their content.

3. PAPER PLANE FORM SUBMISSION ANIMATION

Implement a subtle paper plane flying animation for all relevant forms.

Trigger Conditions

The animation must ONLY start after the backend confirms successful form submission.

Never play the animation when:

Validation fails.
The API returns an error.
The network request fails.
The submission is unsuccessful.
Animation Sequence
Visitor clicks Submit.
Validate the form.
Send the existing submission request.
Wait for confirmed backend success.
Temporarily disable the submit button.
A small paper plane emerges from the button.
The paper plane flies diagonally upwards and slightly right.
The plane gently rotates and fades away.
Display a success checkmark.
Change the button text to "Submitted Successfully".
Animation Settings
Duration: 800–1200ms.
Horizontal movement: 80–120px.
Vertical movement: -90 to -140px.
Rotation: 10–20 degrees.
Opacity: 1 to 0.
Smooth ease-out animation.
Success Message

Display:

"Thank you! Your enquiry has been submitted successfully. Our team will get back to you soon."

Failed Submission

If submission fails:

Do not show the paper plane.
Preserve entered form data.
Display an understandable error message.
Re-enable the submit button.
Allow the visitor to retry.
Apply To Existing Forms
Contact form.
Student enquiry form.
Programme enquiry form.
Admission enquiry form.
Other relevant existing forms.

Do not change existing API endpoints, field names or validation rules unnecessarily.

4. ANIMATION AND PERFORMANCE INTEGRATION

All three animation systems must work together without conflicting.

Requirements:

Use the existing Motion / Framer Motion library if already installed.
Otherwise, use lightweight CSS animations where practical.
Avoid unnecessary animation dependencies.
Keep animations GPU-friendly.
Avoid layout shifts.
Prevent unnecessary React re-renders.
Respect prefers-reduced-motion.
Ensure animations work on slower devices.
Ensure keyboard accessibility.
Maintain good Core Web Vitals.
Never delay navigation or form submission artificially. 5. TECHNICAL IMPLEMENTATION

Before modifying anything, inspect the complete existing project.

Identify:

Frontend framework.
TanStack Router configuration.
Header and navigation components.
Existing form components.
Image loading architecture.
Existing animation libraries.
CSS and styling architecture.
Backend form submission logic.

Implement the three features using the existing architecture.

Create reusable components and shared animation utilities rather than duplicating animation code throughout the project.

6. STRICT PRESERVATION RULES
   Do not rebuild the website.
   Do not change existing page layouts.
   Do not modify existing URLs.
   Do not remove navigation links.
   Do not change website content.
   Do not replace existing images.
   Do not break form submissions.
   Do not alter existing API integrations.
   Do not introduce unnecessary dependencies.
   Do not add exaggerated animations.
   Preserve desktop, tablet and mobile functionality.
7. TESTING AND VERIFICATION

Test all three systems:

Navigation
Magnetic hover interaction.
Nearby item scaling.
Active route indicator.
Browser back and forward.
Page transitions.
Mobile navigation.
Images
Blur placeholder visibility.
Full-resolution loading.
Smooth sharp-image transition.
Lazy loading.
Image caching.
Broken image fallback.
No layout shifts.
Forms
Successful submission animation.
Failed submission handling.
Validation errors.
Duplicate submission prevention.
Retry functionality.
Mobile compatibility.

Run TypeScript checks and the production build.

Do not mark the task complete until all three features work with actual website components and real backend responses.

FINAL DESIGN OBJECTIVE

Transform EduArc Connect into a polished, interactive and premium educational website.

The website should feature:

Magnetic and fluid navigation.
Instant-feeling progressive image loading.
Delightful paper plane submission feedback.

All animations should be subtle, elegant, fast and consistent with the Forest Green, Warm Ivory and Terracotta brand identity.

The final result must feel intentionally designed by a professional frontend developer, not like a generic AI-generated template.
