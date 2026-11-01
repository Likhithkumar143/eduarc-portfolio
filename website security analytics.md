EDUARC CONNECT – COMBINED WEBSITE SECURITY & SITE ANALYTICS SYSTEM

Website: https://eduarc-connect.in

Build a complete Website Security Monitoring and Essential Site Analytics System for my existing website.

The objective is to monitor website security, detect suspicious activities, understand legitimate website traffic and measure important visitor engagement.

This must be a functional system connected to the existing website backend and database, not just a dashboard design.

1. SYSTEM ARCHITECTURE

Create two separate modules:

A. Website Security Monitoring. B. Essential Website Analytics.

Both modules should be accessible from one private administrator dashboard.

Keep their databases, permissions, retention policies and data processing separate wherever appropriate.

2. WEBSITE SECURITY MONITORING

Collect security-related information:

Source IP addresses.
Request timestamps.
Requested URLs and endpoints.
HTTP methods.
Response status codes.
User-agent information.
Failed login attempts.
Unauthorised access attempts.
Suspicious requests.
Rate-limit violations.
API abuse.
Bot activity.
Server errors.
Security actions and blocking history.

Detect indicators of:

SQL injection.
Cross-site scripting.
URL and directory probing.
Authentication attacks.
Automated bot abuse.
Excessive request frequency.
Suspicious API access.
Restricted resource access.

Provide Critical, High, Medium and Low severity levels with detection explanations.

Implement appropriate defensive controls:

Rate limiting.
Login throttling.
Input validation.
CSRF protection where applicable.
Secure authentication.
Security headers.
WAF integration.
Temporary IP blocking.

Allow authorised administrators to investigate suspicious IP addresses and review security event histories.

3. ESSENTIAL WEBSITE ANALYTICS

Track only information necessary to understand website performance.

Collect:

Total unique visitors.
Daily, weekly and monthly visitors.
Page views.
Popular pages.
Traffic sources.
Referring websites.
Approximate geographical distribution.
Device categories.
Browser categories.
New versus returning visitor counts.
Average session duration.
Contact button clicks.
Phone and email link clicks.
Enquiry button clicks.
Successful form submission events.

Track sessions using privacy-conscious identifiers.

Do not collect unnecessary personal information or invasive browsing behaviour.

4. ADMIN DASHBOARD

Create a secure dashboard at:

/admin/dashboard

Include these sections:

Overview
Total visitors.
Total page views.
Security events.
Blocked requests.
Failed login attempts.
Enquiry conversions.
Website Analytics
Traffic charts.
Most visited pages.
Traffic sources.
Device distribution.
Geographic distribution.
Engagement metrics.
Enquiry conversion statistics.
Security Monitoring
Recent security events.
Suspicious IP addresses.
Failed authentication attempts.
Rate-limit violations.
Critical security alerts.
Blocked requests.
IP Investigation
Search by IP address.
Review security events.
Inspect request frequency.
View blocking history.
Review relevant request information.
Reports
Daily, weekly and monthly reports.
Website traffic reports.
Security incident reports.
CSV exports.
5. ALERTS AND NOTIFICATIONS

Provide configurable alerts for:

Critical security incidents.
Repeated failed login attempts.
Suspicious admin access.
Unusual API traffic.
Excessive request frequency.
Significant traffic anomalies.

Provide administrator dashboard notifications and optional email notifications.

6. PRIVACY AND DATA MANAGEMENT

Collect only data required for website security and essential performance measurement.

Do not collect:

Passwords.
Authentication tokens.
Keystrokes.
Mouse movements.
Private form contents.
Payment details.
Precise GPS location.
Invasive browser fingerprints.
Unnecessary personal profiles.
Session recordings by default.

Apply appropriate privacy notices, consent controls where required, IP access restrictions, encryption, retention periods and automatic deletion.

Use pseudonymous identifiers for analytics. Keep identifiable security logs restricted to authorised personnel.

7. SECURITY AND ACCESS CONTROL
Protect all admin routes.
Enforce server-side authorisation.
Implement role-based access control.
Protect analytics and security APIs.
Apply rate limiting.
Maintain administrator audit logs.
Prevent public access to internal data.
Secure database access.
Validate all incoming events.
8. TECHNICAL IMPLEMENTATION

First inspect the existing website codebase.

Identify its frontend framework, backend, database, hosting provider and authentication architecture.

Implement the system using compatible technologies.

Use server-side logging for security events and appropriate analytics event tracking for website performance.

Integrate a WAF such as Cloudflare if supported by the hosting environment.

Do not create fake metrics or simulated visitor data.

Do not rebuild the existing website or break its functionality.

Ensure tracking does not significantly affect website loading performance.

9. TESTING

Verify:

Visitor counting.
Page view tracking.
Traffic source reporting.
Enquiry event tracking.
IP logging.
Suspicious request detection.
Failed login detection.
Rate limiting.
IP blocking and unblocking.
Security alerts.
Admin access controls.
Database storage.
Data retention.
CSV exports.
Mobile responsiveness.
FINAL OBJECTIVE

Create a unified EduArc Connect Security and Analytics Centre.

I should be able to understand how many people visit the website, which pages perform well, where traffic originates, how many enquiries are generated and whether anyone is attempting suspicious or unauthorised activities.

The system must use real backend data, remain secure, respect visitor privacy and operate reliably in production.