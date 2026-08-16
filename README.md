# Wellness Compass

ISIS — Full Build Prompt (v6 — LOCKED SPEC + light/dark homepage)

Paste this into Claude Code, Cursor, v0, or any AI coding tool to build the complete app. This is the locked product spec — build this version; do not add further AI-sensing features (see the hard constraint near the end).

```

Build "ISIS" — an AI that turns health information into personalized action.

It understands what your health information says, adapts it to how you

prefer to understand information, turns it into actions for your day, and

helps you follow through with wellness support.

Build a fully working prototype (React + Tailwind + a small server-side API

route for Claude calls), not just static screens. The AI-powered flows must

actually call the Claude API and the interactive features must actually

work. Do not sacrifice the core Health -> Wellness flow to implement

secondary features — read the MVP PRIORITY section before building anything.

=====================================================================

PRODUCT STATEMENT (use this exact framing in code comments, hero copy,

and any pitch/about text)

=====================================================================

"ISIS turns health information into personalized action."

It understands what your health information says, adapts it to how you

prefer to understand information, turns it into actions for your day, and

helps you follow through with wellness support.

Tagline: "Understand. Protect. Restore."

Subtitle, used directly beneath the tagline on the homepage and reused

as UI copy anywhere "Try a different way" appears:

"Same information. Different way of understanding it."

Explain the tagline's three layers wherever the homepage elaborates on it:

  Understand -> AI understands health information

  Protect    -> privacy + source verification + user control

  Restore    -> personalized wellness intervention

The competitive framing to keep in any pitch copy: most health AI tries to

tell you what's wrong; ISIS helps you understand what you already know and

actually do something with it. NOT "AI diagnoses your body." See the hard

constraint near the end of this prompt about what not to build.

=====================================================================

CORE PRODUCT HIERARCHY — this is the spine of the app, not one of four

equal tabs

=====================================================================

Health information → AI understanding → personalized action →

wellness intervention → feedback → learning

Every mode (Understand, Health, Wellness, Express) must feed this single

journey. If a feature doesn't connect to this spine, it's P2 polish, not

core.

                 ISIS

                  |

          +-------+-------+

          |   UNDERSTAND  |

          +-------+-------+

                  v

            HEALTH INFO

                  v

          +---------------+

          |   AI CORE     |

          | Understand    |

          | Personalize   |

          | Prioritize    |

          | Explain       |

          +-------+-------+

                  v

        "MAKE THIS PART OF MY DAY"

                  v

            TODAY'S BRIEF

                  v

             WELLNESS

                  v

             INTERVENE

                  v

          "DID IT HELP?"

                  v

               LEARN  --(adjusts intervention preference scores,

                          loops back into AI CORE and PRIORITIZE)

=====================================================================

THE JUDGING DEMO SCRIPT — build toward this exact timed sequence

=====================================================================

This is the sequence to make achievable, dead-end-free, in one session:

  0:00 — The problem

    "Health information is often written for doctors, not for the person

    who has to live with it." Upload a sample doctor's instruction sheet.

  0:20 — Understand

    ISIS extracts: "3 actions found," each with a source quote (or a

    visibly marked "unverified" state per the source-verification rule).

  0:45 — Personalize

    "How would you like me to explain this?" Simple / Detailed / Voice.

    Show the SAME extracted information rendered differently.

  1:15 — Act

    Tap "Make this part of my day" on a recurring item (e.g. a prescribed

    stretch).

  1:30 — Today's Brief

    Right now: Prescribed stretch

    In 20 min: Medication reminder

    Tomorrow: Appointment

  2:00 — Wellness

    ISIS notices the action is overdue: "Want a 2-minute reset before you

    continue?" Start the guided intervention.

  2:30 — Measure

    "How do you feel now?" Better / Same / Still not great. Click Better.

  2:45 — Learn

    "ISIS learned: short movement resets work well for you" — rendered

    from a real, updated preference score, not a scripted string.

  3:00 — Privacy

    Open Privacy Center: What was processed? What was stored? What did

    ISIS learn? Then tap "Forget personalization" and show it actually

    clears the learned state.

Build your seed/sample data (a realistic sample doctor's instruction

sheet) so this ~3-minute flow works cleanly end to end without manual

workarounds.

=====================================================================

ADAPTATION / LEARNING — make "Learn" real, not marketing language

=====================================================================

Implement exactly this mechanism (this is the canonical spec — follow it

precisely rather than inventing a different shape):

  Store intervention feedback as structured data:

    { interventionType, context, outcome, timestamp }

  where context is a short string describing the situation (e.g. "overdue

  movement break, mid-afternoon") and outcome is one of "better", "same",

  "still not great".

  Maintain a lightweight preference score for each intervention type

  (e.g. starting at a neutral baseline like 1.0 for movement break,

  breathing sequence, stretch reminder, short walk, etc).

    - "better"          increases that intervention's preference score

    - "same"             leaves it unchanged

    - "still not great"  decreases that intervention's preference score

  Future wellness intervention SELECTION must use these scores when

  choosing between available interventions for the current moment (rank

  or weight-select using the stored scores, not a fixed/random order).

  Never infer or diagnose a medical condition from these scores — they

  are a preference signal only, always described in the UI as

  "works well for you" / "preference," never as a health assessment.

  Persist as simple in-memory state (a map of interventionType -> score,

  plus the feedback event log) for the session.

=====================================================================

PERSONALIZATION MEMORY — a visible card in the Privacy Center

=====================================================================

Add, inside Privacy Center, exactly this section:

  PERSONALIZATION MEMORY

  What ISIS has learned from your interactions:

  • You prefer short interventions.        (derived from profile +

                                              observed feedback patterns)

  • Voice guidance is enabled.              (derived from profile)

  • Movement resets have helped you before. (derived from the highest-

                                              scoring intervention type,

                                              shown only once there is

                                              at least one feedback event)

  [ Forget personalization ]

"Forget personalization" must actually reset all intervention preference

scores to baseline, clear the feedback event log, and remove the derived

bullet statements — wire it to real state, not a no-op. This card is

deliberately where AI, personalization, and privacy visibly meet.

=====================================================================

AI vs. APPLICATION LOGIC — a hard architectural rule

=====================================================================

Apply this split everywhere in the codebase, and comment the code where

the split happens (e.g. "// AI stops here; scheduling below is

deterministic app logic"):

  Claude is responsible for:

  - Understanding documents

  - Extracting candidate actions

  - Explaining information

  - Adapting language to the user's profile

  - Generating wellness intervention wording

  Application code is responsible for:

  - Dates and timestamps

  - Medication schedules

  - Reminder timing

  - Due/overdue status

  - Today's Brief ordering

  - Completion state

  - Streak calculations

  - Privacy controls

  - Data deletion

  Claude must never invent a deadline, medication schedule, reminder

  time, priority, or health fact that is not present in the source

  document or application state.

=====================================================================

SOURCE VERIFICATION — the rule that makes "Show me why" credible

=====================================================================

If Claude cannot identify an exact supporting passage in the uploaded

document, it must return source: null.

  The UI must never display an item as "source verified" when source is

  null — show a neutral, honest "unverified" state instead.

  Never allow the model to fabricate or paraphrase a source quote and

  present it as a literal quotation. A quote shown to the user must be an

  exact substring/near-exact excerpt of the source content, not a

  reworded approximation dressed up as a citation.

=====================================================================

GLOBAL "SHOW ME WHY" — not just for document extraction

=====================================================================

Every non-trivial ISIS recommendation supports a "Why this?" reveal built

from real app state — a wellness nudge cites the actual logged energy

value and actual elapsed time since the last break (both deterministic,

per the AI vs. application-logic rule); a medication instruction cites

its literal source quote or shows "unverified"; a Today's Brief ordering

cites the deterministic priority calculation that produced it. One

reusable component, not a one-off per feature.

=====================================================================

"TRY A DIFFERENT WAY" — one killer adaptive interaction

=====================================================================

After displaying any AI-generated explanation or plan, show:

  Not quite right?

  [ Make it simpler ]   [ Show visually ]   [ Read aloud ]

These controls must transform the SAME underlying information without

changing its factual meaning or its sources — no re-extraction, no new

facts. Display, subtly, beneath the controls:

  "Same information. Different way of understanding it."

This is the fastest, most demoable proof that the personalization is

real: doctor's instruction -> ISIS understands it -> "here's what you

need to do" -> Make it simpler -> simpler version -> Show visually ->

visual version, live, in front of a judge.

=====================================================================

AI REASONING PIPELINE — implement literally, and visualize it in the UI

=====================================================================

Structure Health/Understand Claude calls to mirror this pipeline

explicitly in code, and render a lightweight live visualization (e.g. a

vertical stepper highlighting the current stage while a request is in

flight):

  INPUT

    v

  MULTIMODAL UNDERSTANDING   (parse text/image into raw meaning)

    v

  STRUCTURED FACTS           (candidate deadlines, doses, requirements)

    v

  SOURCE VERIFICATION        (literal quote attached, or source: null)

    v

  USER ADAPTATION PROFILE    (apply explanationStyle/visualDensity/etc.)

    v

  CURRENT CONTEXT            (deterministic: time, check-ins, existing

                               plan — computed by app logic, not the model)

    v

  PERSONALIZED ACTION        (the rendered plan / recommendation / card)

    v

  USER FEEDBACK               ("did it help?" / "try a different way")

    v

  ADAPTATION / LEARNING       (preference score updates, Personalization

                               Memory — see the canonical spec above)

=====================================================================

PERSONAL ADAPTATION PROFILE — must materially change the same interaction

=====================================================================

One real extraction/plan-rendering pipeline driven entirely by the

profile so the SAME underlying Claude output renders differently per

user:

  User A — Simple + Visual + Voice

    -> short cards with icons, large touch targets, automatic

       text-to-speech read-out of the plan.

  User B — Detailed + Text

    -> expanded prose explanation with inline source citations visible

       by default, no auto-TTS.

Build a "switch profile" affordance reachable in the demo (Privacy Center

or settings) so this can be shown live without re-onboarding. "Try a

different way" is the fast, in-the-moment version of the same idea.

=====================================================================

CLAUDE API ARCHITECTURE — server-side only

=====================================================================

Never expose the Claude API key in client-side code. All Claude requests

go through a server-side API route/proxy (e.g. `/api/claude`) that holds

the key server-side; the client calls your own backend route, never

api.anthropic.com directly. If the build environment truly has no server

runtime available, flag this clearly as a known limitation in a code

comment rather than silently calling the API from the client.

=====================================================================

PRIVACY CENTER — a real, visible screen

=====================================================================

Reachable from the sidebar and the homepage trust strip, showing real

data pulled from app state:

  - What data ISIS received (documents uploaded, photos, check-ins logged)

  - What was processed locally vs. sent to the AI (honest about this build)

  - What is currently stored (Health Vault items, habits, feedback log,

    intervention preference scores)

  - PERSONALIZATION MEMORY section (exact spec above)

  - [Clear session data] — actually clears relevant state

  - [Delete health data] — actually clears Health Vault state specifically

  - [Forget personalization] — actually resets learned state (exact spec

    above)

  - Personalization ON/OFF toggle — off means neutral standard render,

    no profile-based adaptation

Every control must actually do something.

=====================================================================

COMPLIANCE AND SAFETY LANGUAGE — exact wording, do not paraphrase looser

=====================================================================

Never claim "HIPAA compliant," "GDPR compliant," or similar. Use:

  "Privacy-first architecture"

  "Designed around data minimization and user control"

Medical/mental-health safety constraint — put this literally in the

system prompt for every Health/Wellness-related Claude call, and reflect

it in UI copy near any generated plan:

  "ISIS must never diagnose, predict, score, or label a medical or

  mental-health condition. It may organize information supplied by the

  user or their documents and provide general wellness actions that are

  not medical treatment."

For anything reading as a concerning medical situation, the AI's response

must encourage contacting a qualified professional rather than assessing,

scoring, or treating the situation — a hard system-prompt rule, not left

to model judgment.

=====================================================================

HARD CONSTRAINT — what NOT to build, this is locked, do not scope-creep

=====================================================================

Do not add any form of AI-based physiological or affective sensing: no

facial emotion detection, no cortisol/stress-hormone estimation, no

depression or mental-health detection, no HRV or rPPG, no vocal stress

diagnosis, no micro-expression analysis. Every wellness/energy/overload

signal comes from the user's own explicit self-report or deterministic

app state (time since last break, etc.) — never inferred physiology or

emotion from camera/microphone data. This is what keeps the safety

claims true and the medical-safety language honest, and it is the

project's actual competitive advantage: understanding and acting on

information the user already has, not diagnosing them.

=====================================================================

MVP PRIORITY — build in tiers, do not spread effort evenly

=====================================================================

P0 — MUST WORK (the judging demo depends on all of these):

  - Onboarding / Personal Adaptation Profile

  - Health document upload (text paste + photo)

  - Claude extraction via the server-side proxy

  - Source verification with citations or explicit source: null handling

  - Personalized plan rendering (profile-driven)

  - Health -> Wellness action generation ("Make this part of my day")

  - Today's Brief (grouped, prioritized, capped, deterministically ordered)

  - Guided intervention (multi-step reset sequence)

  - Before/after feedback ("did it help?") driving real preference-score

    updates

  - Personalization Memory card (in Privacy Center)

  - Privacy Center, including Forget personalization

  - Global "Show me why"

P1 — SHOULD WORK (after P0 is solid):

  - Understand mode (general, non-health documents)

  - Express mode (chip-based sentence composer + action checklist)

  - "Try a different way" (simpler / visual / read aloud)

  - Manual medications / appointments entry

  - Reminders (Notification API)

  - Text-to-speech

  - Light/dark mode toggle, fully art-directed on the homepage

P2 — POLISH (only after P0 and P1 are solid):

  - Badges

  - Streaks + milestone confetti

  - CSV/text export

  - Command palette (Ctrl+K)

  - Voice routing / speech-to-text

If time runs out, a flawless P0 flow beats a half-working version of

everything.

=====================================================================

DESIGN THEME — "Artistic Flair"

=====================================================================

- Palette (named, hand-mixed — do NOT default to warm cream + terracotta):

  canvas #FAF6EF, canvas-alt #F1E9D8, ink #241F3D, ink-soft #5B547A,

  poppy #E23E57 (primary/accessibility), marigold #F2A93B (streaks/energy),

  teal #1D7874 (calm/reset/wellness), violet #7B5EA7 (express/communicate),

  sage #5C8A6B (health/positive), dusty rose #C9707D (Health Vault content).

- Type: Fraunces (display serif) for headlines, Work Sans for body,

  JetBrains Mono for data/timestamps/dosages.

- Signature element: "torn paper" cards via clip-path polygons with

  jagged edges, slight alternating rotation. Hand-drawn SVG brush-stroke

  divider under section headings.

- Motion: gentle floaty/fade-up entrance, breathing-circle for Reset/

  Intervene, confetti for streak milestones (P2 only). Restrained

  elsewhere.

- If Tailwind's JIT/arbitrary-value classes aren't available, use inline

  style objects for custom hex colors; Tailwind only for layout utilities.

=====================================================================

LIGHT / DARK MODE — a real toggle, both modes fully art-directed

=====================================================================

Build a genuine light/dark theme switch (not just an inverted-filter

hack) — a sun/moon toggle in the homepage nav and again in the dashboard

sidebar/Privacy Center, backed by a single `theme` piece of React state

("light" | "dark") that every styled element reads from. Default to

light. Respect `prefers-color-scheme` for the initial value if easy to

do, but the manual toggle always wins once touched.

Define a genuine second palette for dark mode — do not just darken the

light palette uniformly; both should feel hand-mixed and intentional:

  LIGHT (as defined above):

    canvas #FAF6EF, canvas-alt #F1E9D8, ink #241F3D, ink-soft #5B547A,

    paper #FFFDF8, poppy #E23E57, marigold #F2A93B, teal #1D7874,

    violet #7B5EA7, sage #5C8A6B, dusty rose #C9707D.

  DARK (a deep "wet ink on black paper" companion, not a dimmed clone):

    canvas #17151F, canvas-alt #211D2E, ink #F3EFE6 (near-white warm

    text), ink-soft #B8AFCB, paper #1E1A29 (card surface, slightly

    lighter than canvas so torn-paper cards still read as distinct

    layers), poppy #FF6B7F (brightened for contrast on dark), marigold

    #FFC661, teal #45C4BC, violet #A98FE0, sage #8FC49E, dusty rose

    #E7A0AC. Card shadows in dark mode should be soft glows in the

    accent color at low opacity rather than dark drop-shadows, since a

    dark shadow is invisible on a dark canvas.

  Both palettes must pass comfortable text/background contrast — body

  text at minimum AA contrast against its canvas in both modes. Route

  every hardcoded hex color through a small `theme(light, dark)` helper

  or a colors object keyed by the current theme, rather than sprinkling

  raw hex strings through the JSX, so the whole app (not just the

  homepage) stays correct in both modes with one source of truth.

The signature "torn paper" card texture, brush-stroke dividers, and blob

illustrations must all be re-tuned for dark mode, not just recolored:

blobs and dividers should use the brightened dark-mode accent colors

above; torn-paper cards get the lighter `paper` surface against the

darker canvas plus a subtle accent-colored glow instead of a shadow.

=====================================================================

APP STRUCTURE / NAVIGATION

=====================================================================

view state: "home" -> "login" -> "onboarding" -> "dashboard"

1. HOMEPAGE — the single most important visual surface in the app;

   invest real polish here, in both light and dark mode.

   - Hero built around the product statement, tagline, and the "Same

     information. Different way of understanding it." subtitle, with the

     Understand/Protect/Restore breakdown.

   - A richer hero illustration than a flat blob pair: layer 2-3 blobs

     at different sizes/opacities with the `float` animation offset per

     layer (different animation-delay each) for gentle parallax-like

     depth, plus one small foreground SVG motif (e.g. a stylized

     document-with-checkmark or a simple hand-drawn heart/leaf icon)

     sitting on or near a torn-paper card to tie the illustration to the

     product's actual subject matter rather than being pure decoration.

   - Add a light grain/texture feel to the hero background using a

     faint repeating SVG noise or dot pattern at very low opacity behind

     the blobs, reinforcing the hand-crafted "Artistic Flair" material

     feel rather than a flat gradient.

   - Give section headings a consistent rhythm: eyebrow label (small

     caps, accent color) -> Fraunces display heading -> brush-stroke

     divider -> supporting copy, repeated across hero, story card,

     modes section, and philosophy section, so the page reads as one

     considered composition rather than stacked unrelated blocks.

   - The four-mode cards and the relatable-story card should each get a

     distinct accent color from the palette (Understand=poppy,

     Health=dusty rose, Wellness=teal, Express=violet) applied to their

     icon chip and top border/glow, so the page itself teaches the

     product's color language before the user ever reaches the

     dashboard.

   - Sun/moon theme toggle in the nav, animated with a short rotate/fade

     transition rather than an instant flip.

   - A trust strip links to the Privacy Center. Four-mode overview

     framed as pipeline stages.

2. LOGIN — mock email/password, "Continue," "skip sign-in" link.

3. ONBOARDING — multi-step quiz building the Personal Adaptation Profile,

   wired to real rendering differences.

4. DASHBOARD — sidebar with Home / Understand / Health / Wellness /

   Express / Privacy Center, a "take a reset" button, (P2) Ctrl+K hint.

=====================================================================

DASHBOARD HOME — "TODAY'S BRIEF"

=====================================================================

One grouped, prioritized brief at the top (cap at 3 items), merging

overdue/soon wellness nudges, medication reminders, appointments, and due

"make this part of my day" items — deterministic ordering, each item's

"why this?" explains it. Below: Daily Goals (P1/P2 streak features),

weekly habit chart, Badges panel, compact Health Vault summary.

=====================================================================

UNDERSTAND MODE (P1)

=====================================================================

General document/environment understanding for non-health content, same

extraction pipeline, source-verification rule, and "Make this part of my

day" entry point as Health mode.

=====================================================================

HEALTH MODE — the Health Vault (P0)

=====================================================================

Upload a health document -> server-side Claude call returns a medication

plan grouped by time of day with source-verified instructions (or

source: null, clearly marked) and any recurring non-medication actions

surfaced via "Make this part of my day." Actions per item: [Set

Reminder], [Explain This], [Translate], [Read Aloud], plus "Try a

different way." Manual medications/appointments lists (P1) feed Today's

Brief. Understated safety disclaimer using the exact wording above.

=====================================================================

WELLNESS MODE (P0 for the intervention loop, P1 for manual check-ins)

=====================================================================

Self-reported check-in (energy, overload, movement/hydration/sleep — a

few taps). Deterministic tracking of time-since-last-break etc. The

Intervene loop: SENSE -> UNDERSTAND -> INTERVENE -> MEASURE -> LEARN,

selecting among available intervention types using the stored preference

scores, running the guided multi-step sequence via the shared Reset

modal, then capturing "Better / Same / Still not great" feedback that

updates those scores in real time per the canonical Adaptation/Learning

spec above.

=====================================================================

EXPRESS MODE (P1)

=====================================================================

Chip-based sentence composer (Who / About / I need, including "Doctor"

and "Medication") via the server-side proxy, with Speak. Hosts the shared

action-item checklist plus a P2 weekly chart.

=====================================================================

RESET / INTERVENE MODAL (shared component, P0)

=====================================================================

Breathing-circle animation; simple 60-second offer and guided multi-step

Wellness sequence share this one component. Never loses app state.

Surfaces as a Today's Brief banner when profile.currentState is

"overloaded."

=====================================================================

COMMAND PALETTE (Ctrl+K) — P2

=====================================================================

Only after P0/P1 are solid. Global shortcut, quick actions per mode,

optional voice input with keyword routing.

=====================================================================

DATA / STATE RULES

=====================================================================

- No localStorage/sessionStorage in this environment — React state for

  the session (wire real persistence outside this constraint).

- Habits, medication reminders, "make this part of my day" items, and

  Express-mode action items share one trackable-item shape and store.

- Intervention preference scores and the feedback event log

  ({interventionType, context, outcome, timestamp}) are their own piece

  of state, read by selection logic and written by feedback handling.

- Wrap every Claude call (through the server-side proxy) in try/catch

  with a visible, non-scary error state.

- Enforce the no-diagnosis constraint and the source-verification rule

  in the system prompt itself for every Health/Wellness/Understand

  Claude call, not just in UI copy.

=====================================================================

BUILD ORDER

=====================================================================

1. Personal Adaptation Profile + onboarding, wired to real rendering

   differences

2. Server-side Claude proxy route

3. Health Vault document upload -> extraction -> source-verified plan

   (real source: null handling)

4. "Make this part of my day" shared item store + button

5. Today's Brief deterministic grouping/ordering logic

6. Guided Wellness intervention + before/after feedback -> real

   preference-score updates (this is what makes "Learn" true)

7. Personalization Memory card + Privacy Center (including Forget

   personalization)

8. Global "Show me why" + "Try a different way"

9. Understand mode, Express mode, manual medications/appointments,

   reminders, TTS (P1)

10. Badges, streaks, confetti, export, command palette, voice (P2)

Build toward the exact judging demo script above — problem, upload,

extraction with sources, personalize, Make this part of my day, Today's

Brief, intervention, feedback, learn, Privacy Center, forget. Give me the

file/component structure first, then build steps 1-8 completely before

touching anything in P1 or P2.

```

Apply the "Editorial Aesthetic" design theme to the app.

ADD THESE FEATURES

ALSO MAKE A HOMEPAGE THATS PERFECT WITH IMAGES AND APP INFO AND RELATEBLE,THEN ADD A LOGIN AND SOMETHNG LIKE QUESTIONS SO THE APP ADABTS TO U AND THEN A DASBOARD

Apply the "Artistic Flair" design theme to the app.

Create a new 'Daily Goals' component that integrates with the existing Checklist state, allowing users to set and track small daily habits within the DashboardHome view.

Add a streak counter and visual progress bar to the Daily Goals component to motivate users to complete their habits consistently.

Enhance the Daily Goals component to support categorizing habits (e.g., Health, Learning, Mindfulness) with color-coded tags for better visual organization.

Add a subtle confetti or success animation when a user hits a milestone streak in the Daily Goals component.

Add a feature to export the user's weekly habit completion data as a summary text block or CSV format to help them reflect on their progress.

Create a 'Badges' system that rewards users for consistent streak milestones and diverse habit completion, displaying these earned achievements in a section within the DashboardHome.

Add a chart to the DashboardHome using recharts to visualize the last 7 days of habit completion progress by category.

Add a feature to the Daily Goals component that allows users to set specific times for their habits and receive browser-native notification prompts to complete them.

Extend the Daily Goals component to include a 'habit notes' field where users can store quick logs, and add a toggle to show/hide past habit notes within the dashboard.

Implement a global keyboard shortcut (e.g., 'Ctrl+K') that toggles a floating command prompt allowing the user to initiate 'Understand', 'Communicate', or 'Action' flows via voice command using the Microphone API.

Add a visualization component to the ActionsFlow that uses recharts to display a weekly breakdown of completed versus pending accessibility action items.

Integrate a text-to-speech feature within the UnderstandFlow that automatically reads aloud the AI-generated summaries to improve accessibility for visually impaired users.

Create a 'Daily Reflection' feature that prompts users with AI-generated journal questions based on their completed habits to deepen the personal health narrative.

Create a new 'Daily Reflection' component that appears after the user marks all daily habits as complete, triggering a modal with a thought-provoking AI question related to their progress.

Create a 'Daily Insight Feed' component that displays curated health articles and AI-generated wellness tips tailored to the user's completed habits, and position this feed on the DashboardHome view.

Integrate a 'smart notification' toggle that uses the Gemini API to analyze the user's past habits and activity time patterns to suggest the most optimal times of day for new habits, automatically pre-populating those fields in the habit creation flow.

Create a 'Habit Challenges' feature that suggests time-bound streaks (e.g., 'Hydrate 7 days in a row') to boost engagement, integrating with the existing Daily Goals streak logic.

Create a 'Share Care' feature that allows users to generate a secure, read-only link of their habit streaks and wellness progress to share with a health coach or accountability partner.

Add a daily health goal tracking component to the 'Today’s Brief' section that visualizes the streak progress using a bar chart.

Add a 7-day calendar visualization component to the streak tracking section to show consistency over the past week.

Add a subtle Confetti animation or scale-up effect when a user clicks the checkmark on a task in the Today's Brief, making completion feel more rewarding.

Implement an 'Undo' feature when a task is completed in error, allowing users to revert the state change and reset the streak count within 5 seconds.

Integrate a rotating motivational quote related to health goals to appear below the streak chart to encourage consistency.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://isis01.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2097d098-09db-4d77-abe7-63b8be241006).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
