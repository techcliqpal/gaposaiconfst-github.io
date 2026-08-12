# ICONFST'26 Website Updates Log

This file is the running record for all mirror website customizations and will be used for subsequent updates.

## Update 001 - Rebrand to ICONFST'26
Date: 2026-08-07

### Changes made
- Updated page title to **ICONFST'26 – International Conference on Science and Technology**.
- Updated top navigation brand label from ICSEECR 2026 to **ICONFST'26**.
- Updated hero heading to **ICONFST'26 - INTERNATIONAL CONFERENCE ON SCIENCE AND TECHNOLOGY**.
- Updated hero subtitle conference code to **ICONFST'26**.
- Updated hero theme text to:
  - **THEME: “Sustainable Research from Gown to Town: Bridging the Academia and Industry Divide”.**
- Updated countdown-complete welcome message to **ICONFST'26**.
- Updated welcome/committee/keynote/footer branding text from ICSEECR 2026 to **ICONFST'26** in key visible sections.

### Notes
- Existing mirrored assets and document filenames were preserved.
- Use this file to track all future requested website changes.

## Update 002 - Extended Rebranding Coverage
Date: 2026-08-07

### Changes made
- Updated additional website text sections still showing ICSEECR branding (program, awards, committee, poster, and certificate areas).
- Updated conference share links (Twitter and WhatsApp) to ICONFST'26 wording and theme context.
- Updated generated schedule/PDF text branding references to ICONFST'26 where user-facing.
- Updated accepted-abstracts admin note branding label to **ICONFST Tools**.

### Notes
- Internal callback variable names and mirrored source filenames were left unchanged where they support existing behavior.

## Update 003 - Tracks Module Revision
Date: 2026-08-07

### Changes made
- Replaced Technical Tracks list with the requested set:
  - T-01 - 🧬 Biology
  - T-02 - 🌍 Environmental
  - T-03 - 🍽️ Food Science and Technology
  - T-04 - ⚗️ Chemistry
  - T-05 - 🔭 Physics
  - T-06 - ➗ Mathematics
  - T-07 - 💻 Computer Science
  - T-08 - 📊 Statistics
  - T-09 - 🧩 General Knowledge / Interdisciplinary Studies
- Updated visible technical track count indicators from 8 to 9.

## Update 004 - Logo Path and Contact Information Update
Date: 2026-08-07

### Changes made
- Updated site logo references to `images/iconfst-logo.jpg` (top navigation and host institution widget).
- Updated contact emails to:
  - `iconfst@gaposa.edu.ng`
  - `gaposastconf@gmail.com`
- Updated contact phone numbers to:
  - `+23480-6261-8986`
  - `+23480-2821-3011`
  - `+23480-6043-4569`
  - `+23480-3849-9893`
- Replaced old Cloudflare-obfuscated email links with direct `mailto:` links in contact-related sections.

### Notes
- A temporary file was created at `images/iconfst-logo.jpg` from an existing local logo so the page does not break. Replace this file with your attached logo image to complete the visual logo update.

## Update 005 - Color Scheme and Conference Schedule Refresh
Date: 2026-08-08

### Changes made
- Updated the site color palette to a dark brown + light orange blend by revising core CSS theme variables.
- Updated welcome page conference timeline to:
  - `23rd August, 2026 - 26th August, 2026`
  - `SAAPADE, OGUN STATE, NIGERIA`
- Updated welcome metadata:
  - Publication: `Scopus index journals`
  - International: `Virtual ($10), Physical ($100)`
  - Abstract deadline: `21st August, 2026`
  - Acceptance notification: `22nd August, 2026`
  - Full paper submission: `11th September, 2026`
- Updated countdown target date and related key date blocks (hero, sidebar, footer, guidelines, and publication notes).
- Updated exported program PDF labels/file name to align with the new August conference date window.

## Update 006 - Abstract Length and Full Background Color Alignment
Date: 2026-08-08

### Changes made
- Updated abstract requirement length from `300 – 500 words` to `250 – 300 words`.
- Applied the dark-brown/light-orange theme across remaining blue-styled background areas, including:
  - Top navigation certificate button accent
  - Primary certificate call-to-action button styling
  - Certificate CTA banner background, overlay grid, and glow highlights
- Adjusted border/shadow accents in those sections to match the new palette.

## Update 007 - Full Five-Module Website Rearrangement
Date: 2026-08-08

### Changes made
- Reorganized the website into five major modules with separate files:
  - `index.html` (Home)
  - `welcome.html` (Welcome)
  - `publication.html` (Publication)
  - `registration.html` (Registration)
  - `contact.html` (Contact Us)
- Added shared files for modular behavior and styling:
  - `styles.css`
  - `script.js`
- Implemented clickable dropdown menus in the top navigation for each module, each containing relevant page/file links.
- Updated Home module to include:
  - Conference date and location
  - Conference theme
  - Countdown timer
  - Direct links to Registration, Publication, and Contact Us modules
- Added relevant content blocks to each module page and linked publication/download files under the Publication module.

## Update 008 - Home Supporters Section and Mobile Responsiveness Upgrade
Date: 2026-08-08

### Changes made
- Added a new **Proud Supporters of ICONFST'26** section on the Home module (`index.html`).
- Included supporter entries for:
  - Gateway (ICT) Polytechnic, Saapade
  - JustRite Supermarket
  - L&K Hotels
  - Riki Mart
  - OTP Kitchen
  - SeyiFunmi Treats
- Added temporary logo placeholders (SVG files) for missing supporter logos in `images/supporters/`.
- Improved mobile responsiveness by updating `styles.css` for:
  - Hero spacing and button stacking on small screens
  - Two-column countdown layout on smaller devices
  - Responsive supporter logo grid layout

### Notes
- Placeholder logos can be replaced later with official brand logos using the same file names/paths.

## Update 009 - Supporters List and Logo Mapping Revision
Date: 2026-08-08

### Changes made
- Updated Home supporters heading text to:
  - `Proudly Supported by: Gateway (ICT) Polytechnic, Saapade, Industrial Platform Remo free trade zone, Justrite, and OTP kitchen.`
- Revised supporters list to include only the requested organizations.
- Wired supporter logo paths to:
  - `images/iconfst-logo.jpg` (Gateway)
  - `images/supporters/iprftz-logo.jpg`
  - `images/supporters/justrite-logo.png`
  - `images/supporters/otp-kitchen-logo.jpg`
- Removed non-requested supporters from the Home supporters grid.

## Update 010 - Uploaded Supporter Logos Activated and Site Run Validation
Date: 2026-08-08

### Changes made
- Mapped uploaded logo files into expected supporter asset paths:
  - `IPR.jpg` -> `images/supporters/iprftz-logo.jpg`
  - `Justrite.png` -> `images/supporters/justrite-logo.png`
  - `OTP Kitchen.jpg` -> `images/supporters/otp-kitchen-logo.jpg`
- Kept Home supporters section configured to these file paths.
- Ran localhost and validated all module pages and the three supporter logos return HTTP 200.

## Update 011 - Contact Us Organisers List Adjustment
Date: 2026-08-08

### Changes made
- Updated the Contact Us organisers list entry to:
	- `Mr. ONI Olujimi O, Chairman Conference Organising Committee, School of Science and Technology, The Gateway (ICT) Polytechnic, Saapade.`

## Update 012 - Welcome Module Rector Address Merge
Date: 2026-08-08

### Changes made
- Merged the content from `My files/Rector's Address.docx` into the Welcome module Rector section (`welcome.html`).
- Expanded the Rector's Welcome Address to include:
  - formal welcome to conference stakeholders,
  - emphasis on translating research into practical solutions,
  - institutional commitment of The Gateway (ICT) Polytechnic,
  - call for collaboration and partnerships,
  - formal opening statement for ICONFST'26.

## Update 013 - Leadership Photo Addition and Organisers List Expansion
Date: 2026-08-11

### Changes made
- Added the uploaded portrait and profile entry to `conference-leadership.html`:
  - `O. A Amoniyan (Former Ag. Dean, School of Science and Technology, The Gateway (ICT) Polytechnic, Saapade)`
- Added the uploaded image asset:
  - `images/leadership-amoniyan.jpg`
- Updated Contact Us organisers list (`contact.html`) by adding entries 5–10:
  - Dr. SOTONWA Olawale Emmanuel (Chairman, Logistics Subcommittee)
  - SALAKO Basirat Omotayo (Chairman, Welfare Subcommittee)
  - OLUFEMI Babatunde Oluwakayode (Chairman, Media & Publicity Subcommittee)
  - OLAJIDE Oluwafunmilayo Elizabeth (Member)
  - AWOSOLA Adeoluwa Samuel (Member)
  - OMOTOSHO Oluwatobi A. (Secretary)
- Corrected all visible Technology spelling typos in the Contact Us organisers section.

## Update 014 - Admin Login JSON Error Fix
Date: 2026-08-11

### Changes made
- Fixed secure admin login failure caused by API responses returning HTML instead of JSON in local static hosting.
- Added resilient response parsing and local-mode fallback authentication in `script.js` using project admin credentials.
- Updated `admin-login.html` to direct users to `secure-admin-login-ic26.html`.
- Improved dashboard/admin action messaging when backend API endpoints are unavailable locally.

## Update 015 - Secure Admin Login Hardening (No API Dependency)
Date: 2026-08-11

### Changes made
- Reworked `secure-admin-login-ic26.html` to use a self-contained local login handler (no `/api/admin/login` request).
- Removed dependency on `script.js` for admin sign-in page to prevent legacy/cached JSON parsing behavior.
- Login now validates directly against project credentials and stores the local admin token before redirecting to `authors-dashboard.html`.

## Update 016 - Submission JSON Error Fix (Local Static Mode)
Date: 2026-08-11

### Changes made
- Fixed `Submission failed: Unexpected token '<' ... is not valid JSON` for abstract/full-paper uploads when running as a static localhost site.
- Updated `script.js` submission handler to safely parse API responses and automatically fallback to local mode when API endpoints return HTML/non-JSON.
- Added local submission persistence using browser `localStorage` with generated IDs in format `ICONFST26-YYYY-####`.
- Updated dashboard loading to show locally stored submissions when `/api/submissions` is unavailable.
- Updated certificate status check to fallback to local submission records when API status endpoint is unavailable.

## Update 017 - Publication Timeline Rearrangement
Date: 2026-08-11

### Changes made
- Updated `publication.html` timeline section to:
  - `Abstract Deadline: 13th August, 2026`
  - `Full Paper Submission: 21st August, 2026`
- Removed the Acceptance Notification line from the Publication timeline per request.

## Update 011 - Supporters Heading Text Simplified
Date: 2026-08-08

### Changes made
- Updated Home supporters heading text from the full organization list to:
  - `Proudly Supported by:`
- Left all supporter logos and supporter cards in place.

## Update 012 - Home Wallpaper Background Applied
Date: 2026-08-08

### Changes made
- Set the Home page to use `images/home-wallpaper.jpg` as background wallpaper.
- Added a warm color overlay and Home hero overlay in `styles.css` so image colors blend with the site palette.
- Added `class="home-page"` on `index.html` body so this wallpaper styling applies only to Home.
- Kept cards and supporter cards slightly translucent for readability over the wallpaper.

## Update 013 - Welcome Page Content and Download Dropdown Expansion
Date: 2026-08-08

### Changes made
- Reworked `welcome.html` with a brief ICONFST'26 conference introduction section.
- Added a fuller Rector's Welcome Address and positioned it beside the uploaded Rector image:
  - `images/rector-welcome.jpg` (copied from uploaded file source)
- Added a clickable dropdown section with downloadable link targets for:
  - Keynote Speaker Address and Presentation
  - Lead Paper Presenter Address and Presentation
  - Industrial Contributors Address and Presentation
- Added bottom navigation links on Welcome page to:
  - `registration.html`
  - `publication.html`
  - `contact.html`
- Added `downloads/UPLOAD_ADDRESS_AND_PRESENTATION_FILES_HERE.txt` with required filenames for later file upload replacement.

## Update 014 - Welcome Page Conference Flier Integration and Layout Polish
Date: 2026-08-08

### Changes made
- Added conference flier to Welcome page introduction section using:
  - `images/conference-flier.png` (copied from uploaded file source)
- Added a flier download button on Welcome page.
- Enhanced page arrangement with a responsive two-column intro/flier layout.
- Refined visual presentation with card styling for the flier and a subtle warm background treatment on Rector section.
- Updated Welcome navigation dropdown anchor list to include the intro/flier section.

## Update 015 - Registration Page Conference Info and Document Download Dropdown
Date: 2026-08-08

### Changes made
- Added a new conference overview section on `registration.html` with key ICONFST'26 details:
  - Date
  - Venue
  - Theme
  - Participation mode
- Added a clickable dropdown on Registration page for downloadable conference documents:
  - Conference Programme
  - Author Guidelines
  - Paper Submission Template
  - Book of Abstract
- Created placeholder upload guide:
  - `downloads/UPLOAD_REGISTRATION_DOCUMENTS_HERE.txt`
- Improved registration page arrangement with themed overview panel and responsive info-card grid.

## Update 016 - Publication Page Quick Links and Book of Abstract Guidance
Date: 2026-08-08

### Changes made
- Added a Quick Links section on `publication.html` with links to:
  - Registration Page
  - Contact Us Page
  - Payment Info (`registration.html#payment-info`)
- Added Book of Abstract download link to Publication Files:
  - `downloads/book-of-abstract.pdf`
- Added Publication page note that the Book of Abstract working file is kept in the downloads folder, updated per abstract submission, and released as downloadable after the conference.
- Updated Publication page Welcome dropdown anchors to match current Welcome page section ids.

## Update 017 - Registration Submission Workflow, Dashboard, and Email/Review Automation Scaffold
Date: 2026-08-08

### Changes made
- Added backend scaffold with Node.js/Express:
  - `server.js`
  - `package.json`
  - `data/submissions.json`
  - `uploads/` storage folders
- Implemented upload API for abstract/full paper submissions with unique abstract ID generation:
  - Format: `ICONFST26-YYYY-####`
- Implemented placeholder AI review workflow (strengths, weaknesses, suggested improvements) and response data persistence.
- Added SMTP-based auto-response and review email workflow using environment variables (`.env`) via `dotenv`.
- Updated `registration.html` with:
  - Clickable dropdown for Register and Payment Information links
  - In-page Register form for abstract/full paper upload
  - Payment section anchor (`#payment-info`)
  - Quick links (Home, Contact Us, Payment Information)
  - Dashboard link and AI review workflow note
- Added clean registered authors dashboard page:
  - `authors-dashboard.html` with navbar and certificate download link
- Extended `script.js` for:
  - Form submission to backend API
  - Abstract ID confirmation message
  - Dashboard data fetch/refresh rendering
- Extended `styles.css` with registration form and dashboard UI styling.
- Added setup guide:
  - `BACKEND_SETUP.md`

## Update 018 - Mobile Responsiveness and ICONFST'26 Theme Consolidation
Date: 2026-08-08

### Changes made
- Applied a stronger ICONFST'26-wide visual theme in `styles.css` using cohesive green/brown accent gradients across topbar, hero, buttons, and page headers.
- Improved mobile responsiveness across modules by tightening small-screen container spacing, panel padding, module-link button stacking, and mobile navigation scroll behavior.
- Restored and standardized conference resource files to `downloads/` and linked them consistently sitewide:
  - `downloads/conference-programme.pdf`
  - `downloads/paper-submission-template.docx`
  - `downloads/author-guidelines.docx`
  - `downloads/book-of-abstract.docx`
- Updated cross-page navigation to remove stale Welcome anchors and align all modules with current section ids.
- Updated Publication/Registration and dashboard-facing resources so original conference files appear again through consistent downloadable links.

## Update 019 - Bug Sweep and Local Run Validation
Date: 2026-08-08

### Changes made
- Ran dependency install successfully using `npm.cmd install` (PowerShell policy-safe command).
- Started the website backend with `npm.cmd start` and confirmed server boot at `http://localhost:3000`.
- Validated core pages, API health endpoint, and key downloadable resources all return HTTP 200.
- Performed submission API runtime check (multipart upload path) and cleaned temporary test artifacts afterward (`data/submissions.json` reset and test upload removed).

## Update 020 - Registration Portal Theme Conversion and Layout Rearrangement
Date: 2026-08-08

### Changes made
- Updated Registration portal branding to ICONFST'26 identity with new lead section text:
  - `ICONFST'26 International Conference on Science and Technology`
  - Organised by School of Science and Technology, Gateway (ICT) Polytechnic, Saapade.
- Switched Registration page color treatment from green/white accents to dark-brown and light-sand palette.
- Added Registration-only style overrides for topbar, buttons, and panel tones to match ICONFST'26 branding.
- Rearranged Registration content into a cleaner two-column desktop layout (`registration-layout`) that collapses to one column on mobile.

## Update 021 - Welcome Page Background Wallpaper Updated
Date: 2026-08-08

### Changes made
- Applied uploaded image as Welcome page background wallpaper:
  - `images/welcome-wallpaper.jpg` (from uploaded `GAPOSA Admin.jpeg`)
- Added `class="welcome-page"` to `welcome.html` body for page-specific wallpaper styling.
- Added soft overlay and panel translucency in `styles.css` to keep content readable over the background image.

## Update 022 - Conference Flier Image Replaced
Date: 2026-08-08

### Changes made
- Replaced Welcome page conference flier image with the newly attached flier.
- Updated image asset file in place:
  - `images/conference-flier.png`

## Update 023 - Registration Module Full Flier-Themed Redesign
Date: 2026-08-08

### Changes made
- Redesigned `registration.html` end-to-end to reflect ICONFST'26 flier identity and page flow.
- Updated Registration dropdown links to local in-page workflow:
  - Submission Portal (`#register-form`)
  - Payment Information (`#payment-info`)
  - Certificate/Author Dashboard (`authors-dashboard.html`)
- Added a flier-styled registration hero section with conference branding, theme, dates, and mode.
- Reorganized page structure into a clearer registration-first layout:
  - Left: submission form
  - Right: fees, important dates, submission files, quick links
- Applied stronger flier-inspired registration styling in `styles.css`:
  - Blue/green overlay with brown/sand tone blending
  - Registration-specific topbar/button/panel refinements
  - Responsive behavior retained for mobile screens.
- Installed/verified dependencies with `npm.cmd install` and ran site with `npm.cmd start`.

## Update 024 - Local Submission and Certificate Portals Added
Date: 2026-08-08

### Changes made
- Created new local themed portal pages:
  - `submission-portal.html`
  - `certificate-portal.html`
- Replaced external registration/certificate portal links in active module pages with local links to the new portal pages.
- Updated registration-module dropdown to point to local Submission Portal and local Certificate Portal.
- Updated authors dashboard certificate action to use `certificate-portal.html`.
- Added ICONFST'26 flyer-inspired background/panel styles for `submission-page` and `certificate-page` in `styles.css`.

## Update 025 - Contact Us Social Icons, Wallpaper, and Admin Credential Sync
Date: 2026-08-08

### Changes made
- Applied uploaded image as Contact Us page background wallpaper:
  - `images/contact-wallpaper.jpg`
- Added `class="contact-page"` to `contact.html` body and created page-specific overlay/readability styles in `styles.css`.
- Added social media handles on Contact Us page with platform icons (X, Instagram, Facebook).
- Updated admin credential defaults to requested values:
  - Username: `Admin`
  - Password: `IConfst'26!`
  - Updated in `.env.example` and fallback defaults in `server.js`.

## Update 026 - Abstract and Full Paper Deadline Revision
Date: 2026-08-08

### Changes made
- Updated Abstract submission deadline to `13th August, 2026` across active pages.
- Updated Full paper submission deadline to `21st August, 2026` across active pages.
- Revised deadline text in:
  - `index.html` (Home key deadlines card)
  - `registration.html` (Important Dates list)
  - `publication.html` (Publication timeline list)

## Update 027 - Welcome Module About Section Expanded with Sub-themes
Date: 2026-08-08

### Changes made
- Expanded **About ICONFST'26** content in `welcome.html` with details from the conference flier:
  - Host institution and conference tag
  - Theme statement
  - Conference date window and participation mode (Virtual & Physical)
  - Venue mention (Prince Dapo Abiodun Convocation Hall)
- Added full conference **Sub-themes** list under About ICONFST'26.
- Added new styling for sub-theme presentation in `styles.css`:
  - `.subthemes-block`
  - `.subthemes-list`
  - Responsive one-column fallback on mobile.

## Update 028 - Certificate Issuance Workflow with Admin Verification Implemented
Date: 2026-08-08

### Changes made
- Completed and stabilized server workflow in `server.js` for certificate issuance:
  - Finalized submission save flow after submission email notifications.
  - Enforced admin payment verification before certificate issuance.
  - Added `paymentVerifiedAt` tracking and `certificateEmailReason` persistence on records.
  - Prevented duplicate certificate dispatch by returning a conflict response when already emailed.
  - Restricted bulk certificate dispatch to only verified + eligible + not-yet-emailed submissions.
  - Improved certificate status response messaging for pending dispatch/error reason states.
- Updated dashboard action button class in `script.js` from legacy `module-link-secondary` to active `quick-link-secondary` for correct styling.

## Update 029 - Separate Hidden Admin Login Page Added
Date: 2026-08-08

### Changes made
- Removed direct public Admin Login link from `authors-dashboard.html`.
- Created a separate admin login file:
  - `secure-admin-login-ic26.html`
- Kept admin authentication flow tied to existing backend credentials:
  - Username: `Admin`
  - Password: `IConfst'26!`
- Changed `admin-login.html` to a restricted notice page (no login form) so the old public path no longer exposes admin sign-in UI.

## Update 030 - Welcome Module Speaker Profiles with Photos and CV Links
Date: 2026-08-08

### Changes made
- Added profile display blocks in `welcome.html` under Speaker and Contribution Links for:
  - Keynote Speaker - Engr. Dr. Oniyide
  - Lead Paper Presenter - Prof. Sojinu
- Included passport photographs and CV download links in each profile block.
- Added supporting styles in `styles.css` for speaker profile card presentation.
- Added assets:
  - `images/keynote-oniyide.jpg`
  - `images/lead-sojinu.jpg`
  - `downloads/keynote-speaker-oniyide-cv.pdf`
  - `downloads/lead-paper-presenter-sojinu-cv.docx`

## Update 031 - Admin User CRUD and Registration Background Refresh
Date: 2026-08-08

### Changes made
- Extended admin capabilities in dashboard/backend beyond payment confirmation and certificate email:
  - Register new user record
  - Edit existing user record
  - Remove user record
- Added admin-protected backend endpoints in `server.js`:
  - `POST /api/admin/submissions`
  - `PUT /api/admin/submissions/:abstractId`
  - `DELETE /api/admin/submissions/:abstractId`
- Updated `authors-dashboard.html` with admin user form fields and controls for create/edit flow.
- Updated `script.js` to wire admin form submit/reset plus row-level edit/remove actions.
- Replaced Registration module background image with newly attached gate image by updating:
  - `images/registration-logo-bg.jpg`

## Update 032 - Conference Leadership Page Added to Welcome Module
Date: 2026-08-10

### Changes made
- Created a new page in the Welcome module:
  - `conference-leadership.html`
- Added conference leadership photo display cards with names shown below each image for:
  - Dr. Sanni Kehinde Oseni (Rector)
  - Dr. Eleyowo I. O. (Dean, School of Science and Technology)
  - Mr. Olujimi O. Oni (Chairman, Organising Committee)
- Added leadership image assets:
  - `images/leadership-rector.jpg`
  - `images/leadership-dean.jpg`
  - `images/leadership-chairman.jpg`
- Added Welcome dropdown link to `conference-leadership.html` across major pages and quick link from `welcome.html`.
- Added new styling in `styles.css` for leadership grid/cards/captions.

## Update 034 - Contact Us Organisers List Added
Date: 2026-08-10

### Changes made
- Added a new **List of Organisers** section to `contact.html`.
- Included the four provided organiser entries and roles exactly as supplied:
  - Dr. Sanni Kehinde Oseni
  - Mr. I. O Eleyowo
  - Mr. Amoniyan, O. A
  - Mr. Olujimi O Oni

## Update 033 - Portal Backgrounds Switched to SST-GAPOSA Logo and Flier Replaced
Date: 2026-08-10

### Changes made
- Replaced the Welcome module Conference Intro flier with the newly attached ICONFST'26 new flier image by updating:
  - `images/conference-flier.png`
- Updated Submission and Certificate portal backgrounds in `styles.css`:
  - Removed full-page flier background styling
  - Applied SST-GAPOSA logo image as centered background watermark using:
	- `images/sst-gaposa-logo.jpg`

## Update 035 - Submission-Type Flexibility and Dedicated Admin Dashboard
Date: 2026-08-12

### Changes made
- Updated submission workflow so users can now submit:
  - Abstract only
  - Full paper only
  - Both abstract and full paper together
- Updated backend validation and record model in `server.js` to require at least one uploaded file and persist `submissionType` for each submission record.
- Updated `submission-portal.html` form labels and guidance to reflect independent submission options.
- Created a dedicated admin-only dashboard page:
  - `admin-dashboard.html`
- Separated admin area from registered users page by simplifying `authors-dashboard.html` and removing admin management controls from that page.
- Updated admin login redirect flow in:
  - `secure-admin-login-ic26.html`
  - `script.js`
  so admins are routed to `admin-dashboard.html`.
- Updated admin dashboard data loading in `script.js` to use authenticated admin endpoint (`/api/admin/submissions`) and display:
  - unique submission ID
  - submission type
  - author name
  - paper title
  - downloadable abstract/full-paper files
- Preserved admin user management capabilities (register, edit, delete users) on the dedicated admin dashboard.

## Update 036 - Contact Us Organisers Name/Spelling Alignment
Date: 2026-08-12

### Changes made
- Updated Contact Us organisers list entry in `contact.html`:
  - `Mr. ONI Olujimi O, Chairman Conference Organising Committee, School of Science and Technology, The Gateway (ICT) Polytechnic, Saapade.`
- Confirmed organisers 5–10 remain included in the Contact Us module:
  - Dr. SOTONWA Olawale Emmanuel
  - SALAKO Basirat Omotayo
  - OLUFEMI Babatunde Oluwakayode
  - OLAJIDE Oluwafunmilayo Elizabeth
  - AWOSOLA Adeoluwa Samuel
  - OMOTOSHO Oluwatobi A.
- Corrected spelling usage to `Technology` where this organiser line was logged in update notes.
