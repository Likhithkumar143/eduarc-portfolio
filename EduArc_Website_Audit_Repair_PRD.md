# EduArc Website Audit, Repair & Optimization PRD

**Project:** EduArc
**Goal:** Audit, repair, secure, and optimize the existing website without unnecessarily rebuilding it.

---

## 1. Instructions for the AI Coding Agent

Work inside the existing EduArc codebase. First inspect the repository, framework, routing, components, dependencies, deployment configuration, database integrations, and current behavior.

**Do not start by rebuilding the site.** Preserve working features, the existing brand identity, content, and visual direction unless a change is necessary to fix a verified issue or improve usability.

Before changing code:

1. Map the existing architecture and important user journeys.
2. Identify issues from direct code inspection and testing. Do not invent findings.
3. Create a prioritized repair plan.
4. Identify risky changes, environment variables, database dependencies, and migrations.
5. Establish a baseline for build, lint, tests, performance, and accessibility where supported.

Then implement fixes in small, reviewable steps. Do not expose secrets, commit `.env` files, disable security controls to make a feature work, or claim that something was tested unless it actually was.

## 2. Product Context

EduArc helps students who are confused about choosing a career path. The platform may offer:

- Career guidance and educational lessons
- Programs and certification programs
- Mentor profiles and introductions
- Student support or contact forms
- Information about EduArc and its services

Inspect the existing website to confirm which features are implemented. Improve existing features first; do not invent paid services, certifications, partnerships, mentor credentials, testimonials, or guarantees.

## 3. Primary Objectives

1. Fix verified functional bugs and broken navigation.
2. Address security and privacy risks.
3. Make the experience polished and consistent on mobile, tablet, and desktop.
4. Improve page speed and reliability.
5. Improve SEO, accessibility, and search-engine metadata.
6. Make forms, mentor pages, program pages, and calls to action easy to use.
7. Add useful documentation and a clear deployment/rollback process.

## 4. Phase 0 — Audit and Baseline

Inspect the full project, including:

- Framework, package manager, scripts, dependencies, and lockfile
- Pages, routes, navigation, reusable components, and layouts
- Authentication and role/permission checks, if present
- Database schema, API routes, server functions, and Supabase usage, if present
- File uploads and storage policies, if present
- Environment-variable usage and deployment configuration
- Form submission, validation, loading, error, and success states
- Responsive layouts and accessibility
- SEO metadata, sitemap, robots rules, and canonical URLs
- Console errors, failed requests, broken links, and runtime exceptions

Run the existing checks before modifying code, such as install validation, lint, type-check, tests, and production build. Record any pre-existing failures separately from newly introduced failures.

Create:

- `docs/WEBSITE_AUDIT.md`
- `docs/REPAIR_CHECKLIST.md`

Each finding should include severity, evidence, affected file/page, recommended fix, and verification steps. Prioritize actual findings over generic recommendations.

## 5. Phase 1 — Security and Privacy (P0)

Review and fix applicable risks:

### Secrets and configuration

- Search for exposed API keys, tokens, passwords, private keys, and service-role credentials.
- Never expose privileged credentials in browser/client-side code.
- Use environment variables and server-side access for secrets.
- Keep `.env` files out of version control; provide a safe `.env.example` containing placeholder values only.
- If a secret was committed, document the exposure and recommend rotation. Removing it from the latest commit alone is not sufficient.

### Authentication and authorization

- Verify that protected pages and server-side operations enforce authentication and authorization where required.
- Do not rely only on hiding buttons or client-side route guards.
- Check that administrative operations cannot be performed by ordinary users.
- Ensure user-facing error messages do not expose internal secrets or stack traces.

### Database and API access

- If Supabase is present, review Row Level Security (RLS) policies on tables exposed to client access.
- Ensure users can only read or modify records permitted by the product's access rules.
- Review storage bucket policies and uploaded-file access.
- Validate and authorize all server-side API operations.
- Do not make all tables publicly readable or writable as a shortcut.
- Do not apply destructive schema changes or migrations without documenting impact and a safe rollback plan.

### Inputs and abuse prevention

- Validate all inputs on the server as well as the client.
- Sanitize or safely render user-provided content to prevent injection and cross-site scripting.
- Protect forms and APIs from spam and abusive submissions using suitable rate limiting or bot protection where appropriate.
- Restrict upload types and sizes and generate safe file names where uploads exist.
- Avoid logging passwords, tokens, personal information, or sensitive form submissions.

### Browser security

- Review suitable security headers, including Content Security Policy (CSP), frame protections, MIME sniffing protection, referrer policy, and permissions policy.
- Configure headers to match actual dependencies and required integrations. Do not break legitimate assets, authentication, or embedded services with an overly restrictive policy.
- Check CORS configuration where APIs are used; allow only required origins.
- Review dependency vulnerabilities and update safely, avoiding unnecessary major-version upgrades.

Create `docs/SECURITY_AUDIT.md` with findings, fixes, remaining risks, and any required manual configuration.

## 6. Phase 2 — Functional Reliability (P1)

Test and repair:

- Main navigation and footer links
- Home page and all existing public routes
- Mentor directory, mentor detail pages, and profile links, if present
- Programs, courses, and certification information pages, if present
- Contact, enquiry, registration, and other existing forms
- Login, logout, password recovery, and protected pages, if present
- Search, filtering, pagination, and sorting, if present
- External links and WhatsApp/contact calls to action, if present
- Loading, empty, success, validation-error, and server-error states

Requirements:

- No dead buttons or links that appear functional but do nothing.
- No blank screens when an API or database request fails.
- Forms should prevent duplicate submissions while processing.
- Show clear success and failure messages.
- Preserve entered form data when safe and useful after recoverable errors.
- Add appropriate confirmation for destructive actions.
- Provide a useful not-found page and safe error handling.
- Do not remove working functionality merely to make tests pass.

## 7. Phase 3 — UI/UX and Responsive Design (P1)

Preserve EduArc's recognizable brand and improve consistency.

- Use a clear visual hierarchy and consistent spacing, typography, buttons, cards, and form styles.
- Ensure the main value proposition explains how EduArc helps students choose and navigate career paths.
- Use clear calls to action appropriate to the actual services, such as exploring programs, finding mentors, or requesting guidance.
- Keep the interface professional, modern, approachable, and student-friendly.
- Avoid excessive animations, visual clutter, and unnecessary redesigns.
- Ensure readable contrast in both light and dark themes if both are supported.
- Make layouts work at common mobile, tablet, laptop, and wide-desktop sizes.
- Prevent horizontal overflow, clipped content, overlapping elements, and inaccessible mobile menus.
- Ensure interactive elements have comfortable touch targets.
- Optimize images and avoid layout shifts while assets load.
- Include sensible loading, empty, and error states for dynamic sections.

Review at minimum narrow mobile, typical mobile, tablet, laptop, and wide-desktop viewports. Fix issues found through actual inspection.

## 8. Phase 4 — Mentor and Program Content (P1)

If mentor and program pages exist:

### Mentor profiles

- Present each mentor's introduction, role, expertise, and relevant experience clearly.
- Use consistent profile layouts and image dimensions.
- Provide useful fallback imagery when a profile photo is unavailable.
- Add alt text for meaningful profile images.
- Do not fabricate qualifications, employment history, achievements, or endorsements.
- Ensure profile links and contact actions work as intended.

### Programs and certifications

- Clearly display the program name, intended audience, learning outcomes, duration, prerequisites, delivery method, and fees only when verified information is available.
- Explain the actual registration or enquiry process.
- Distinguish certificates of completion from accredited or externally recognized qualifications.
- Do not imply accreditation, job placement, guaranteed outcomes, or official partnerships unless verified.
- Avoid displaying stale or contradictory program details.

If these sections do not exist, document the opportunity rather than creating unsupported content.

## 9. Phase 5 — Performance and Reliability (P1/P2)

- Identify the actual causes of slow loading before optimizing.
- Reduce unnecessary JavaScript and remove unused dependencies only when safe.
- Use route-level or component-level code splitting where appropriate.
- Optimize images with suitable formats, dimensions, compression, and lazy loading below the fold.
- Avoid lazy loading the main above-the-fold hero image when it harms perceived performance.
- Prevent repeated API calls and unnecessary component re-renders.
- Add pagination or bounded queries for large lists instead of loading unlimited records.
- Use caching only where it will not expose private or stale user data.
- Handle network timeouts, transient failures, and empty API responses gracefully.
- Avoid introducing extra services or paid infrastructure without documenting the need and alternatives.

Measure performance before and after using available tools. Aim for strong Core Web Vitals, while recording any remaining issues and the evidence behind them.

## 10. Phase 6 — SEO and Discoverability (P2)

For relevant public pages:

- Add unique, descriptive page titles and meta descriptions.
- Use one clear primary heading and a logical heading hierarchy.
- Configure canonical URLs where appropriate.
- Add Open Graph and social-sharing metadata.
- Generate or update `sitemap.xml` and `robots.txt` according to the actual public routes.
- Ensure important pages are discoverable through internal links.
- Add descriptive alt text to meaningful images.
- Use structured data only when accurate and applicable.
- Avoid indexing private dashboards, account pages, staging pages, and duplicate or low-value routes.
- Check for broken links, missing metadata, and incorrect canonical domains.

Do not promise search rankings. Record the changes and any external steps needed in search-console tools.

## 11. Phase 7 — Accessibility (P2)

Use WCAG 2.2 AA as the target where practical.

- Ensure keyboard navigation works across menus, dialogs, forms, and controls.
- Provide visible focus indicators.
- Use semantic HTML and accessible names for interactive elements.
- Associate form fields with labels and communicate validation errors clearly.
- Maintain adequate text and interface contrast.
- Add appropriate alternative text for informative images; use empty alt text for decorative images.
- Respect reduced-motion preferences.
- Ensure dialogs and menus manage focus appropriately.
- Do not rely on color alone to convey status.
- Test with automated accessibility tools where available and manually verify important keyboard paths.

## 12. Phase 8 — Analytics and Trust (P2)

- Review any existing analytics and ensure it does not collect unnecessary personal data.
- If analytics is absent, document whether it would be useful before adding a new provider.
- Ensure privacy, terms, contact, and other trust pages accurately reflect actual business practices and data handling.
- Do not invent a physical address, phone number, legal entity, policy, or accreditation.
- Collect only information needed for the stated purpose.
- Clearly explain form purpose and any relevant data use.

## 13. Testing Requirements

Use the repository's existing test setup where possible. Add or update tests for important functionality.

Verify as applicable:

- Production build succeeds.
- Lint and type checks pass.
- Main routes render successfully.
- Navigation and primary calls to action work.
- Forms validate correctly and handle success/failure states.
- Authentication and authorization behave correctly.
- Unauthorized users cannot access protected data or perform privileged actions.
- Database access rules work as intended.
- Mobile layouts do not overflow.
- No new browser console errors or failed critical requests occur.
- SEO metadata exists on relevant public pages.
- Keyboard navigation and accessible labels work.
- Existing working features remain functional.

Do not report a test as passed unless it was run. If a test cannot be run due to missing credentials, services, or environment configuration, document the limitation and exact manual steps needed.

Create `docs/TESTING_REPORT.md` listing checks performed, results, failures, environment limitations, and remaining work.

## 14. Deployment and Rollback

- Confirm the project's existing deployment platform and configuration before changing them.
- Preserve the current production setup unless a change is necessary.
- Verify required environment variables and document them using placeholder values only.
- Do not print secret values in logs or documentation.
- Review database migrations and backward compatibility before deployment.
- Run production build and tests before recommending deployment.
- Provide a concise rollback plan for code and any database changes.
- Do not deploy, alter production data, or run destructive migrations without explicit authorization and appropriate access.

Create `docs/DEPLOYMENT_GUIDE.md` with setup, environment variables, build/test commands, deployment steps, verification, and rollback instructions.

## 15. Priority Definitions

- **P0 — Critical:** Exposed secrets, unauthorized access, data exposure, severe security vulnerabilities, or production-breaking failures.
- **P1 — High:** Broken core journeys, unusable forms, serious responsive problems, or major reliability/performance issues.
- **P2 — Medium:** SEO, accessibility, consistency, and moderate performance improvements.
- **P3 — Low:** Cosmetic refinements and optional enhancements with limited user impact.

Fix P0 issues first, then P1, P2, and P3. Explain any issue that cannot safely be fixed without credentials, product decisions, or production access.

## 16. Required Deliverables

At completion, provide:

1. `docs/WEBSITE_AUDIT.md` — verified findings and evidence.
2. `docs/REPAIR_CHECKLIST.md` — prioritized tasks with completion status.
3. `docs/SECURITY_AUDIT.md` — security findings and remediation.
4. `docs/TESTING_REPORT.md` — actual test commands and results.
5. `docs/DEPLOYMENT_GUIDE.md` — deployment and rollback instructions.
6. A concise summary of code changes and the reason for each.
7. A list of environment variables or external configuration that the owner must set.
8. A list of unresolved risks and recommended next steps.

## 17. Completion Criteria

The work is complete only when:

- Verified P0 and P1 issues are fixed or clearly documented with a safe reason why they remain.
- Existing core features still work.
- The production build and available automated checks pass, or their failures are explicitly documented.
- Security and authorization checks are reviewed.
- Mobile and desktop layouts are tested.
- Important forms and navigation flows are verified.
- The required documentation is created.
- No secrets are added to source control.
- No unapproved destructive database changes or production deployments occur.

## 18. Final Report Format

When finished, summarize:

- **What was inspected**
- **Verified issues found**
- **Fixes implemented**
- **Files changed**
- **Tests run and exact results**
- **Security issues fixed and remaining**
- **Environment/configuration actions required**
- **Deployment status**
- **Remaining tasks and risks**

Start by auditing the current repository, then implement the highest-priority verified fixes. Do not stop after producing a plan unless blocked by missing access, credentials, or a decision that only the owner can make.
