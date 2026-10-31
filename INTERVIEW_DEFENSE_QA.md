# Ritam Web Console — Senior Engineer Review Defense Q&A
**Candidate:** Shubham Panjiyara  
**Project:** Ritam Web Console (Panchanga & Practitioner Platform)  
**Branch:** `practice/shubham-panjiyara`  
**Document Purpose:** Living reference guide for the technical code review with the Senior Lead. Whenever new review questions arise, they will be documented here.

---

## Table of Contents
1. [Core React & Hooks Decisions (Modules 01 & 02)](#1-core-react--hooks-decisions)
2. [Next.js App Router Architecture (Module 03)](#2-nextjs-app-router-architecture)
3. [API Resilience & The 4 Data States (Module 04)](#3-api-resilience--the-4-data-states)
4. [Design Tokens & Pure CSS (Module 05 & FRE-109)](#4-design-tokens--pure-css)
5. [Testing Strategy & Behavior-Driven Testing (Module 08)](#5-testing-strategy--behavior-driven-testing)
6. [Governance, Tone & Boundaries (Module 07)](#6-governance-tone--boundaries)
7. [Additional Review Questions](#7-additional-review-questions)

---

## 1. Core React & Hooks Decisions

### Q1: Why did you NOT use `useEffect` to store the filtered practitioner list in state?
* **English Answer:**  
  "Filtered practitioners are a purely derived calculation from two existing sources of truth: the full practitioner list and the currently selected filter options. If I had stored the filtered list in a secondary `useState` and synced it via `useEffect`, React would perform an unnecessary secondary re-render every time filters change, opening the door to stale closures and out-of-sync race conditions. Instead, calculating `const filteredPractitioners = filterPractitioners(practitioners, filters)` directly during render is synchronous, deterministic, and aligns with the core React principle: $UI = f(state)$."
* **Hinglish Answer:**  
  "Sir, filtered list ek derived value hai jo original data aur selected filter criteria se compute hoti hai. Agar hum isko `useEffect` me `setFilteredList(...)` karte, toh component do baar re-render hota aur state sync ki wajah se bugs aate. Isliye maine render ke time direct `filterPractitioners()` pure function se derive kiya, jo React ka best practice hai."

### Q2: Why did you wrap the sunrise fetch in `AbortController` inside `useSunTimes`?
* **English Answer:**  
  "When a user switches observation nodes quickly (e.g., from Kolkata to Bengaluru to Delhi), network latency varies. Without request cancellation, the response for Kolkata might arrive after the response for Delhi, overwriting the UI with stale data. `AbortController` allows the cleanup function of `useEffect` to cancel the in-flight HTTP request as soon as coordinates change, guaranteeing that only the most recently requested city resolves."
* **Hinglish Answer:**  
  "Sir, jab user fast-fast do ya teen cities switch karta hai, toh pichli request aur nayi request race condition me aa sakti hain. `AbortController` cleanup function me pichli pending request ko cancel kar deta hai taaki screen par hamesha aakhri select ki gayi city ka hi data dikhe."

### Q3: Why did you avoid `useMemo` and `useCallback` in most components?
* **English Answer:**  
  "Module 02 establishes that premature memoization adds overhead, code noise, and memory cost without measurable gain on a dataset of this size (12 to 15 records). Filtering 15 items in JavaScript takes less than $0.1\text{ms}$. Adding `useMemo` would require dependency array tracking that costs more than the computation itself. As the handbook specifies: unless a real performance bottleneck is profiled and measured, default to clean standard functions."
* **Hinglish Answer:**  
  "Sir, Module 02 me saaf likha hai ki premature optimization se code noisy banta hai. 12-15 practitioners ko filter karne me 0.1 millisecond se bhi kam time lagta hai, isliye `useMemo` ka fayda hone ke bajaye dependency check ka ulta overhead hota. Maine rule follow kiya: jab tak measure na karein, tab tak unnecessary memoize nahi karna."

---

## 2. Next.js App Router Architecture

### Q4: Why is `app/layout.jsx` a Server Component while `app/page.jsx` is a Client Component?
* **English Answer:**  
  "The golden rule of the Next.js App Router is to keep `'use client'` as far down the component tree as possible. `app/layout.jsx` and `app/practitioners/[id]/page.jsx` only render static structure, navigation `<Link>` elements, and metadata. By keeping them Server Components, zero client JavaScript is sent to the browser for those shells. Conversely, `app/page.jsx` and `app/practitioners/page.jsx` require client-side interactive state (`useState`, event handlers, city selector, filter dropdowns), necessitating `'use client'`."
* **Hinglish Answer:**  
  "Sir, Next.js ka rule hai `'use client'` ko tree me jitna neeche ho sake utna neeche rakhna. Root layout aur Detail page ko user interactivity ya browser events ki zaroorat nahi thi, isliye unhe Server Component banaya taaki client par extra JavaScript bundle na jaye. Jabki Home page aur Directory me city picker aur filter dropdowns the, jinko state aur event handlers chahiye the, isliye unhe Client Component banaya."

### Q5: Why did you create `loading.jsx`, `error.jsx`, and `not-found.jsx`?
* **English Answer:**  
  "These are Next.js App Router convention files. `loading.jsx` leverages React Suspense to stream an instant fallback skeleton before server rendering completes. `error.jsx` serves as an Error Boundary to catch unexpected rendering faults without crashing the entire app, providing a calm retry button via `reset()`. `not-found.jsx` provides a branded, calm 404 screen when a practitioner ID does not exist."
* **Hinglish Answer:**  
  "Sir, ye Next.js App Router ke standard boundary files hain. `loading.jsx` se route transition ke time instant loading shell dikhta hai bina layout jump ke. `error.jsx` client error boundary ka kaam karta hai jo crash hone par calm message aur retry button deta hai. Aur `not-found.jsx` galat ID aane par calm 404 page deta hai."

---

## 3. API Resilience & The 4 Data States

### Q6: Why did you check both `response.ok` AND `json.status !== 'OK'` on the sunrise API?
* **English Answer:**  
  "Because transport success does not equal domain success. The `sunrise-sunset.org` API returns an HTTP 200 OK status code even when coordinates are invalid (e.g., latitude 999), but includes `{ 'status': 'INVALID_REQUEST' }` in the JSON payload. If my code only checked `response.ok`, it would assume success, attempt to parse `results.sunrise`, and throw an unhandled `TypeError`. Checking `json.status !== 'OK'` guarantees that API-level errors are properly intercepted and routed to the error UI."
* **Hinglish Answer:**  
  "Sir, `sunrise-sunset.org` API transport level par HTTP 200 bhejti hai chahe coordinates galat bhi ho, lekin response body ke andar `{ status: 'INVALID_REQUEST' }` hota hai. Agar sirf `response.ok` check karte toh error catch nahi hota aur app crash kar jata. Isliye maine status code aur body status dono ko check kiya."

### Q7: How do you differentiate between the 'Empty' state and the 'Error' state?
* **English Answer:**  
  "A query returning zero results (`results: []`) is a valid, successful outcome, not an error. Showing a red alert box for zero results confuses users and fails WCAG heuristics. In my directory page, if filters match zero practitioners, the component renders a calm informational banner (`No Practitioners Found`) with a 'Show All Practitioners' action. It deliberately does not render a `role='alert'` box, which is reserved exclusively for actual network or calculation failures."
* **Hinglish Answer:**  
  "Sir, zero results aana ek successful response hai, error nahi. Agar user ne aisa filter chuna jisme koi match na ho (`[]`), toh hum calm message dikhate hain aur filter reset karne ka option dete hain. Error state sirf tab aati hai jab actual me network tut jaye ya server fail ho jaye, jisme hum `role='alert'` aur Retry button dete hain."

---

## 4. Design Tokens & Pure CSS

### Q8: Why did you use CSS Custom Properties instead of Tailwind CSS or CSS-in-JS?
* **English Answer:**  
  "The onboarding handbook and Issue FRE-109 mandate pure, handwritten CSS using design tokens. Tailwind and CSS-in-JS introduce heavy build dependencies, runtime overhead, and violate the codebase contract. By declaring our tokens on `:root` in `globals.css` (`--bg`, `--surface`, `--ink`, `--accent`, `--brass`), the entire application achieves instant, zero-runtime theming. Component rules use only `var(--token)`, ensuring zero raw hex values."
* **Hinglish Answer:**  
  "Sir, onboarding manual aur issue FRE-109 ka contract tha ki hume design system ke tokens follow karne hain. Har color aur spacing `:root` ke CSS custom properties (`var(--token)`) se aani chahiye. Agar hum hardcoded hex code likhte toh dark mode me layout break ho jata, jabki CSS variables se OS dark mode aur toggle dono seamless chalte hain bina kisi external library ke."

### Q9: How does the application avoid horizontal scrollbars at 360px width?
* **English Answer:**  
  "First, a global box-sizing reset is enforced (`*, *::before, *::after { box-sizing: border-box; }`). Second, all flex child items use `min-width: 0` so text can wrap instead of forcing container overflow. Third, multi-column layouts use CSS Grid with `repeat(auto-fit, minmax(240px, 1fr))` rather than fixed pixel widths. Fourth, any wide tables or tabular data are wrapped in `.table-scroller { overflow-x: auto; width: 100%; }`."
* **Hinglish Answer:**  
  "Sir, sabse pehle universal `box-sizing: border-box` lagaya. Uske baad flex items par `min-width: 0` diya taaki text flex box ko stretch na kare. Grid me fixed pixel ke bajaye `minmax(240px, 1fr)` use kiya, aur table ko overflow-x wrapper me daala. Isse 360px par koi horizontal scrollbar nahi banta."

---

## 5. Testing Strategy & Behavior-Driven Testing

### Q10: Why do your tests use `getByRole` rather than testing internal state?
* **English Answer:**  
  "Testing implementation details (like inspecting state variables or internal component names) produces brittle tests: if a developer refactors a variable name without changing user behavior, the test fails. Following React Testing Library principles, my tests interact with the rendered DOM exactly as an assistive technology or human user would: clicking buttons (`getByRole('button')`), selecting dropdown options (`getByLabelText`), and reading announcements (`role='status'` and `role='alert'`). If the internal implementation changes, tests stay green as long as user behavior is intact."
* **Hinglish Answer:**  
  "Sir, Module 08 ka rule hai: user jo screen par dekhta hai wahi test hona chahiye, na ki internal state ya variable names. Agar hum variable ka naam badal dein lekin user ko output wahi mile, toh test pass rehna chahiye. Isliye maine `getByRole` aur `getByLabelText` use kiya hai jo accessibility aur real user actions ko test karte hain."

### Q11: How do you prove your tests run 100% offline?
* **English Answer:**  
  "All external network calls are mocked using Vitest's `vi.fn()` mocking harness. In `test/sunTimes.test.jsx`, `global.fetch` is stubbed to return controlled promises (for loading, success, and error). In `test/apiPractitioners.test.js`, the Next.js `Request` and `Response` objects execute in-memory against local JSON. You can disconnect Wi-Fi entirely and run `npm test`—all 24 tests pass in under 3 seconds."
* **Hinglish Answer:**  
  "Sir, maine saare network calls ko `vi.fn()` se mock kiya hai. Koi bhi test real internet ya API ko call nahi karta. Wi-Fi switch off karke bhi `npm test` command chalayenge toh sabhi 24 tests 2-3 second me pass ho jate hain."

---

## 6. Governance, Tone & Boundaries

### Q12: Why did you not add a real MongoDB database or login authentication?
* **English Answer:**  
  "The onboarding handbook explicitly stated in Module 07 and Module 09 that databases, authentication, payments, and KYC are out of scope for intern console tasks. Adding them introduces regulatory, safety, and security attack vectors. The intern scope is strictly to present state decided by the platform, not to manage identity vaults or persistent state."
* **Hinglish Answer:**  
  "Sir, Module 07 aur 09 me strictly mention kiya gaya tha ki authentication aur database out of scope hain. Interns ko platform ka state represent karna hota hai, regulatory ya identity logic khud nahi banana hota. Isliye maine local JSON aur route handler ke sath minimal dependencies me kaam kiya."

### Q13: What Ritam copy rules did you enforce?
* **English Answer:**  
  "Ritam's core product philosophy is non-fatalistic astrology: it does not sell fear. Therefore, all UI copy deliberately avoids urgency badges ('Only 2 spots left!'), countdown clocks, exclamation marks, or alarmist red banners for routine empty results. Error copy is calm, respectful, and actionable ('Astronomical Calculation Notice: Coordinates outside computational range. Please select a valid city.')."
* **Hinglish Answer:**  
  "Sir, Ritam ka rule hai ki hum fear nahi bechte. Isliye poore UI me koi exclamation mark (!), koi countdown timer, ya urgency badge nahi lagaya. Error copy bhi bilkul calm aur helpful rakhi hai."

---

## 7. Additional Review Questions
*(Whenever you have a new question, tell me and I will append it here immediately!)*
