## Project rules

- All site copy, prices and contact details live in `src/content/eduarc.ts`; pages read from it so brochure facts change in one place.
- Shared marketing UI lives in `src/components/site/`; header/footer are mounted in `__root.tsx` so every page shares the shell.
- Styling uses tokens and `@utility` classes in `src/styles.css` (type-_, container-_, gradients); components never hardcode colors.
- Site content is editable at `/admin`: one password-protected admin (hashed in `admin_credentials`, seeded from the `ADMIN_INITIAL_PASSWORD` secret) with an encrypted session cookie; every admin server function calls `requireAdmin()` because the page gate is UI only.
- Edits are saved as one JSON document in `site_content` and merged over `defaultContent`, so new fields always fall back to brochure defaults.
