# Practice Console — Shubham Panjiyara

## Running it

To run the web console locally:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. Open your browser to [http://localhost:3000](http://localhost:3000).
   - Sun Times observation console: `/`
   - Practitioner directory: `/practitioners`
   - Individual practitioner detail view: `/practitioners/prac-101` (or click any profile from directory)
   - Route handler API: `/api/practitioners?language=Kannada&specialism=Career`

To create a production build:
```bash
npm run build
npm run start
```

## Running the tests

The project uses **Vitest** with **React Testing Library** and **jsdom**.

Run all tests once:
```bash
npm test
```

Run in watch mode:
```bash
npm run test:watch
```

**Offline Capability:** The suite has zero external network calls. All external API requests (`api.sunrise-sunset.org`) and route handlers are mocked or tested in-memory. You can turn off your internet connection completely, and all tests will still pass.

**Suite Overview (18 total tests across 4 test suites):**
- `test/practitioners.test.jsx`:
  - **Test 1**: Practitioner list renders the rows it is given (cards, headings, pseudonyms).
  - **Test 2**: Choosing a language filter narrows the list via derived render-time calculation.
  - **Test 3**: A filter combination that matches nothing displays the calm empty state (verifying `empty ≠ error`) with filter reset action.
- `test/sunTimes.test.jsx`:
  - **Test 4**: Displays `role="status"` loading indicator while async calculation is in-flight.
  - **Test 5**: Displays formatted solar cards (sunrise, sunset, day length, solar noon) upon successful data resolution.
  - **Test 6**: Displays `role="alert"` calm notice and functional retry button when the API fails or returns `status: "INVALID_REQUEST"` (the Module 04 trap where HTTP 200 contains an application-level error).
  - **Test 6b**: Handles network failures gracefully.
- `test/apiPractitioners.test.js`:
  - **Test 7**: Route handler `/api/practitioners` returns proper JSON schema with count, filters, status 200, and filters by `?language=` and `?specialism=`.
- `test/pureFunctions.test.js`:
  - **Test 8**: Pure functions (`formatSunTime`, `calculateDayLength`, `filterPractitioners`) tested across normal, edge (null/undefined/blank/reversed times), and boundary inputs.

## What works

1. **Three Core Routes & Navigation:**
   - `/`: Interactive solar timing console for 4 Indian observation nodes (Bengaluru, Kolkata, Delhi, Chennai).
   - `/practitioners`: Directory with live search/filter by language and specialism, live count, and clear filters action.
   - `/practitioners/[id]`: Detail view displaying pseudonym, price band, verified experience, languages, specialisms, and ethics covenant.
   - Global `<header>` and breadcrumbs navigating between all routes with Next.js `<Link>`.

2. **All 4 Data States Everywhere:**
   - **Idle/Loading:** Height-preserving status placeholders without layout shift.
   - **Success:** Full presentation of data.
   - **Empty Success:** Distinct empty state explaining zero matches with a reset button.
   - **Error:** Calm, non-alarmist explanation with a working retry action button.

3. **Custom Hook `useSunTimes`:**
   - Wraps the sunrise-sunset API.
   - Uses `AbortController` to cancel stale in-flight requests when the user changes observation nodes quickly.
   - Correctly traps `INVALID_REQUEST` responses returned with HTTP 200.

4. **Pure CSS & Design Tokens (Issue FRE-109):**
   - Strictly CSS custom properties (`var(--token)`) for all colors, spacings, borders, and typography.
   - Zero raw hex codes in component rules.
   - Dark mode support via `prefers-color-scheme: dark` and `:root[data-theme="dark"]`.
   - Responsive down to 360px without horizontal scroll.

5. **Accessibility & Tone:**
   - All inputs have associated `<label htmlFor="...">`.
   - Visible `:focus-visible` outlines.
   - Screen-reader announcements via `role="status"`, `role="alert"`, and `aria-live="polite"`.
   - Adherence to Ritam tone principles: no fear-based copy, exclamation marks, countdowns, or urgency badges.

## Decisions I made

1. **Derived Filtering Over State Syncing (Module 02 & 06):**
   - In `/practitioners`, filtered practitioners are calculated synchronously during render using `filterPractitioners(practitioners, { language, specialism })`.
   - I deliberately avoided syncing filtered data into a secondary `useState` inside a `useEffect`. Storing derived state in effects causes double renders, desynchronization bugs, and makes the flow harder to reason about.

2. **Server vs. Client Component Boundaries (Module 03):**
   - Root Layout (`app/layout.jsx`): **Server Component** because it renders the static shell, navigation links, and document metadata without sending JavaScript to the browser.
   - Practitioner Detail (`app/practitioners/[id]/page.jsx`): **Server Component** because it reads practitioner data at request time, executes `generateMetadata` for dynamic titles, and sends zero client JavaScript for profile display.
   - Home Page (`app/page.jsx`) and Directory (`app/practitioners/page.jsx`): **Client Components** (`'use client'`) because they require user interaction (city picker dropdown, filter selects, event listeners) and client-side lifecycle data fetching.

3. **Handling The "HTTP 200 with INVALID_REQUEST" API Trap (Module 04):**
   - `api.sunrise-sunset.org` does not return HTTP 400 when given invalid coordinates; it delivers HTTP 200 with `{ "status": "INVALID_REQUEST" }`.
   - In `hooks/useSunTimes.js`, I added a check for `json.status !== 'OK'` after checking `response.ok`. This prevents the application from attempting to access missing `results.sunrise` properties and triggers the calm error UI with a retry option.

4. **URLSearchParams For Parameter Construction:**
   - Handled query string creation via `new URLSearchParams(...)` in both client fetching and server route parsing rather than string concatenation (`+`), preventing encoding bugs with spaces or Indic characters.

5. **Testing User-Observable Outcomes Instead of Internals (Module 08):**
   - All tests use React Testing Library role and text queries (`getByRole`, `findByRole`, `getByLabelText`). If internal variable names are refactored, the test suite remains resilient and green.

## What I would do next

1. **URL-Synchronized Filter State:**
   - Store the selected `language` and `specialism` filters in the URL query parameters (`/practitioners?language=Kannada`) via `useSearchParams` and `useRouter`, enabling users to bookmark and share filtered views.

2. **Client-Side Local Storage Persistence:**
   - Persist the selected observation city ID in `localStorage` with `try/catch` fallbacks so the user's preferred city is remembered on subsequent visits.

3. **Skeleton Shimmer Loading Cards:**
   - Enhance the loading states with CSS-only skeleton cards matching the exact dimensions of loaded cards to completely eliminate visual layout shifts.

## What I found hard

1. **Mocking Async State Transitions in Vitest / React 19:**
   - Testing the loading state required holding a Promise unresolved (`new Promise(() => {})`) so the test could inspect the DOM before the resolution microtask executed. Balancing this with `waitFor` and `findByRole` required careful async coordination.

2. **Handling The Discrepancy Between Transport Status and Body Status:**
   - It is easy to instinctively rely on `response.ok` or `try/catch` around `fetch()`. Realizing that `fetch` only rejects on network failures and that some APIs return HTTP 200 with an error payload emphasized the lesson that transport success does not equal domain success.

3. **Maintaining Zero Raw Hex Codes Across All Styles:**
   - It requires conscious discipline to avoid writing quick hex codes like `#fff` or `#16243D`. Mapping every border, background, and hover tint to the token palette (`var(--surface-2)`, `var(--line-soft)`, `var(--accent)`) ensured full dark mode fidelity and compliance with FRE-109.

