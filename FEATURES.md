# Feature List

This file tracks user-facing features and feature-level changes.

## 14) Decisions timeline card polish (dot alignment + icon action)
- **Current behavior:** On `/decisions/`, timeline dots now line up with the vertical rail like home, the extra helper sentence under the page title is removed, and each card shows an icon-only open-details button inline before the tags.
- **Last updated:** 2026-03-17
- **Change note:** Matched the timeline marker positioning to the proven home layout and simplified card actions/heading copy for a cleaner scan.

## 13) Clean page URLs + maps hub + dashboard gate messaging
- **Current behavior:** Site navigation now uses extensionless routes (`/voice/`, `/decisions/`, `/maps/`, `/dashboard/`), a new `/maps/` page exists as the central map hub, the old `voice.html` path redirects to `/voice/`, timeline dots on Decisions are aligned to the timeline, and dashboard login works even when Supabase config is unavailable by falling back to the local dashboard password.
- **Last updated:** 2026-03-17
- **Change note:** Added a stable URL structure and maps landing page for cleaner navigation, fixed a visible Decisions timeline alignment bug, and added a simple local password fallback so dashboard access does not break when Supabase env vars are missing.

## 12) Public navigation/footer + dashboard access page
- **Current behavior:** Public pages now link to Voice, Decisions, and Dashboard in navigation (Agenda removed), each public page includes a government non-affiliation footer note, and a new password-protected `/dashboard/` page checks a Supabase-stored password before showing placeholder Supabase content.
- **Last updated:** 2026-03-17
- **Change note:** Added clearer cross-page navigation, legal clarity in page footers, SEO subheadings for Recent Voice/Decisions, and an initial Supabase-backed dashboard gate for private admin content.

## 11) Shared branding image in header + hero
- **Current behavior:** The home page now uses a shared Cloudinary image as a round logo in the header navigation and as a featured visual in the hero section.
- **Last updated:** 2026-03-17
- **Change note:** Added the same brand image in both top-of-page locations so site identity is consistent and more visually prominent.

## 10) Crawl indexing defaults (robots + sitemap)
- **Current behavior:** Search crawlers are allowed across the site, and a sitemap is published at the root listing the home and Voice pages on the production domain.
- **Last updated:** 2026-03-17
- **Change note:** Added `robots.txt` and `sitemap.xml` so indexing rules and canonical crawl targets stay explicit for search engines.

## 0) SEO/social metadata tags for public pages
- **Current behavior:** Home and Voice pages now include canonical URLs, Open Graph/Twitter social tags, and geo metadata for Sedro-Woolley.
- **Last updated:** 2026-03-17
- **Change note:** Added page-specific metadata in each `<head>` so search and social previews resolve to production URLs with location context.

## 1) Weekly civic question + voting
- **Current behavior:** Users now load the weekly question and answer choices from Supabase, choose one answer, and submit.
- **Last updated:** 2026-03-17
- **Change note:** Wired question prompt and answer options to Supabase so weekly updates can be managed from data instead of hardcoded HTML.

## 2) Question navigation + response state
- **Current behavior:** Users can move between available questions and see a thank-you state after submitting.
- **Last updated:** 2026-03-17
- **Change note:** Initial feature baseline documented.

## 3) Results visualization (Chart.js)
- **Current behavior:** Recent Voice cards read question/response totals from Supabase and render pie-chart percentages from live response data.
- **Last updated:** 2026-03-17
- **Change note:** Replaced static result percentages with Supabase-driven aggregation to reflect current response distribution.

## 4) Topic preferences
- **Current behavior:** Users can select topics they care about; selections save automatically.
- **Last updated:** 2026-03-17
- **Change note:** Initial feature baseline documented.

## 5) Notification signup modal
- **Current behavior:** Users can open a modal, choose email or SMS, and save reminder contact details.
- **Last updated:** 2026-03-17
- **Change note:** Initial feature baseline documented.

## 6) Animated visual experience (anime.js)
- **Current behavior:** Decorative animated UI elements and motion-enhanced interactions are present.
- **Last updated:** 2026-03-17
- **Change note:** Initial feature baseline documented.

## 7) Historical results cards
- **Current behavior:** Prior sample questions/results are shown as compact cards with mini progress bars.
- **Last updated:** 2026-03-17
- **Change note:** Initial feature baseline documented.

## 8) Recent Voice card grid + pie visualization
- **Current behavior:** Recent Voice now renders as compact cards in a responsive grid (2-wide on small screens, 3-4 columns on larger screens), with mobile capped to 4 cards and each card showing a pie chart with in-slice percentages.
- **Last updated:** 2026-03-17
- **Change note:** Replaced horizontal result bars with square-style pie chart cards to improve scan speed and fit more results in less space.

## 9) Voice page subscribe card
- **Current behavior:** The Voice page now includes a bright subscribe card between the survey question and Recent Voice list, with a click-to-open mini form for email or SMS, saved to Supabase.
- **Last updated:** 2026-03-17
- **Change note:** Added inline subscription capture so users can opt into weekly reminders without leaving the Voice page.

## 10) Structured data (JSON-LD) for search engines
- **Current behavior:** Home and Voice pages now include JSON-LD with shared WebSite/Organization entities; Voice includes FAQPage markup for the weekly question block; Home includes Event markup for listed meeting/decision items.
- **Last updated:** 2026-03-17
- **Change note:** Added stable production `@id` references and page-matching schema fields to strengthen rich results while keeping structured data aligned with visible content.
