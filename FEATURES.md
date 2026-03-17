# Feature List

This file tracks user-facing features and feature-level changes.

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
