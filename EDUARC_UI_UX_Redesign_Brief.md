# EDUARC — Enquiry Form & Reception Dashboard Enhancement

## Objective

Enhance the existing EDUARC website by adding role-based enquiry forms, an optional remarks field, and improved enquiry management in the Reception dashboard.

**IMPORTANT:** Modify the existing project only. Preserve all working features, existing Supabase data, authentication, database policies, APIs, and UI components. Do not rebuild the application or reset the database.

### 1. Inspect the Existing Project

Before making changes:

- Identify the existing framework, project structure, enquiry form, Reception dashboard, database schema, Supabase configuration, and authentication system.
- Find the existing enquiry submission logic and Excel export implementation.
- Reuse existing components, utilities, and design conventions.
- Identify the safest database migration needed for the new fields.
- Do not assume the framework or database table names; inspect the actual code.

### 2. Add Role Selection to the Enquiry Form

Add a required field labelled **“I am a…”** with four options:

1. Student
2. Parent / Guardian
3. School / College (Institution)
4. Mentor

Use EDUARC's professional navy-and-gold branding, clean Apple-inspired design, and responsive form layout.

Show only the fields relevant to the selected role.

**Student**

- Student name
- Current education level: Class 10, Class 12 / PUC, Degree / College, Other
- Phone number
- Email address

**Parent / Guardian**

- Parent / Guardian name
- Child's education level: Class 10, Class 12 / PUC, Degree / College, Other
- Child's name (optional)
- Phone number
- Email address

**School / College (Institution)**

- Contact person's name
- Institution name (required)
- Designation at the institution
- Phone number
- Email address

**Mentor**

- Mentor's name
- Professional designation
- Area of expertise
- Phone number
- Email address

Preserve existing enquiry-type fields and any other useful fields already in the form. Avoid duplicating fields that already exist.

When the user changes their selected role, update the visible fields appropriately. Validate all required fields and show clear, user-friendly error messages.

### 3. Add an Optional Remarks Field

Add a multiline textarea to the enquiry form.

- **Label:** Remarks / Anything you'd like us to know?
- **Placeholder:** Share your questions, career goals, requirements, or additional information here…
- Optional; the user must be able to submit without entering remarks.
- Maximum length: 500 characters.
- Display a live character counter, for example `0/500`.
- Prevent input beyond the limit and validate it on the server.
- Preserve the entered text during validation errors wherever practical.
- Make the field responsive, keyboard-accessible, and easy to use on mobile.

Save the remarks in the existing enquiry record using an appropriate nullable text column.

Display submitted remarks safely as plain text. Never execute or interpret submitted HTML or JavaScript.

### 4. Database and Supabase Integration

Inspect the existing schema before modifying it.

Extend the existing enquiry table and submission flow rather than creating a separate system.

Store the selected role and relevant role-specific information, including:

- Role
- Education level
- Child's name, where applicable
- Institution name, where applicable
- Designation
- Mentor expertise, where applicable
- Remarks
- Existing contact details and enquiry fields
- Existing timestamps and follow-up status, where supported

Requirements:

- Use a safe, incremental database migration.
- Preserve all existing records and relationships.
- Backfill existing roles as `Unknown` when the role cannot be reliably identified.
- Use nullable fields where appropriate.
- Preserve existing Row Level Security (RLS) policies and authorization rules.
- Do not drop tables, reset the database, or delete existing data.
- Never expose the Supabase service-role key in client-side code.
- Ensure database errors are handled gracefully and users receive appropriate feedback.

Reuse existing columns wherever possible instead of introducing duplicates.

### 5. Improve the Reception Dashboard

Update the existing Reception dashboard to display real enquiry data.

**Summary cards**

- Total enquiries
- Students
- Parents / Guardians
- Institutions
- Mentors

Use accurate database counts. Do not use hardcoded or mock data.

**Enquiry list/table**

Display:

- Name
- Role badge
- Phone number
- Email address
- Education level, when applicable
- Institution name, when applicable
- Enquiry type
- Remarks preview
- Submission date
- Follow-up status
- Available contact actions

Show a shortened remarks preview in the table and allow authorized staff to open the full enquiry details.

**Search and filters**

Support searching and filtering by:

- Name
- Phone number
- Email address
- Role
- Education level
- Institution name
- Enquiry type
- Follow-up status
- Remarks, where practical

Include a clear-filters option and a helpful empty state.

**Follow-up statuses**

Support:

- New
- Contacted
- Follow-up Required
- Resolved

Reuse the existing status system if present. Ensure updates are saved to the database and show success or error feedback.

**Contact actions**

Provide:

- Call via the stored phone number
- WhatsApp using the stored phone number
- Email using the stored email address

Use the actual submitted contact details. Do not invent or substitute numbers or email addresses.

**Enquiry details**

Show all submitted information, including the selected role, applicable role-specific fields, contact details, full remarks, submission date, and follow-up status.

### 6. Update Excel Export

Extend the existing Excel export to include:

- Name and contact details
- Role
- Education level
- Child's name
- Institution name
- Designation
- Mentor expertise
- Enquiry type
- Remarks
- Follow-up status
- Submission date
- All other relevant existing enquiry fields

Leave inapplicable fields blank rather than filling them with invented information.

Respect the current export behavior and active filters where applicable. Maintain existing access restrictions so unauthorized users cannot export private enquiry data.

### 7. UI/UX Requirements

Maintain EDUARC's existing design language:

- Professional Apple-inspired interface
- Navy-and-gold color palette
- Clean typography and consistent spacing
- Subtle borders and shadows
- Clear buttons, form controls, tables, and role badges
- Responsive desktop, tablet, and mobile layouts
- Accessible contrast and visible keyboard focus
- Clear validation, loading, success, and error states

Do not redesign unrelated pages or remove existing features.

### 8. Security and Validation

- Validate input on both the client and server.
- Safely render all user-submitted text.
- Preserve authentication and existing authorization.
- Ensure only authorized Reception staff can view private enquiries and update follow-up statuses.
- Preserve and verify Supabase RLS policies.
- Prevent unauthorized database writes and exports.
- Avoid exposing secrets, tokens, or sensitive enquiry information.
- Do not trust client-side validation alone.

### 9. Testing and Acceptance Criteria

Verify that:

1. All four roles can submit enquiries successfully.
2. Role-specific fields appear and validate correctly.
3. Switching roles does not accidentally submit incorrect role-specific data.
4. Remarks are optional and can be submitted empty.
5. Remarks up to 500 characters are accepted; longer input is prevented or rejected.
6. Remarks are saved and displayed correctly in the Reception dashboard.
7. HTML or JavaScript entered into remarks is displayed safely as text.
8. Summary counts, search, filters, and follow-up updates use real database records.
9. Call, WhatsApp, and email actions use the stored contact details.
10. Excel exports include the new fields.
11. Existing enquiries remain intact.
12. Authentication and RLS continue to protect private data.
13. The form and dashboard work on desktop and mobile.
14. Existing website functionality continues to work.
15. Type checks, linting, relevant tests, and production build pass where supported.

### 10. Execution Instructions

Work directly in the current EDUARC repository.

1. Inspect the existing implementation.
2. Identify the files and database schema requiring changes.
3. Implement the form and dashboard enhancements.
4. Create safe, incremental migrations without resetting the database.
5. Run the available checks and fix issues introduced by the changes.
6. Report the files changed, migrations created, tests actually performed, and any remaining manual steps.

**Do not stop after producing a plan. Implement the changes in the existing project. Do not replace real database operations with mock data, remove working features, or claim success for tests that were not executed. Before applying any destructive or production database operation, stop and request approval.**
