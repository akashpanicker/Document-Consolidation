Update the existing 3-screen Pre-Job Planning designs with the following specific changes. Keep everything that is not mentioned below exactly as-is — same colors, typography, header, cards, and overall aesthetic.

---

## CHANGE 1 — SCREEN 2: SITE CONDITIONS FORM

Replace the current 4 form fields (Weather, Wind Speed, Temperature, Visibility) with these 5 fields:

Field 1 — "WEATHER" (keep existing dropdown, same styling)
Options: Clear / Partly Cloudy / Overcast / Light Rain / Heavy Rain / Thunderstorm / High Winds / Fog / Snow

Field 2 — "SITE CONDITION"
Dropdown, same styling as Weather field.
Options: Normal / Wet Surfaces / Muddy / Icy / High Dust / Scaffolding in Use / Equipment Maintenance Ongoing / Restricted Access Zone Active

Field 3 — "NEW CREW MEMBER ON SHIFT?"
Toggle switch row — full width. Left: label "NEW CREW MEMBER ON SHIFT?" in #8A9AB6 11px/600 uppercase. Right: toggle switch component. Default: OFF. When ON, toggle fill changes to #2B5597 and a sub-field slides in below: text input "Enter crew member name and role" — bg #0E141F, border 1px #1F2B42, border-radius 6px, height 40px, placeholder "E.g. D. Harris — Floorman (Day 1)" in #5F6F8A.

Field 4 — "INPUT PLAN"
Label: "INPUT PLAN" in #8A9AB6 11px/600 uppercase.
Textarea: height 96px, bg #0E141F, border 1px #1F2B42, border-radius 6px, resize none, placeholder "Describe today's planned work — e.g. Running 9-5/8 casing, making up connections on rig floor, circulating mud system..." in #5F6F8A at 12px/400.

Field 5 — "ADDITIONAL SITE HAZARDS (OPTIONAL)" (keep exactly as it currently exists — same label, same textarea styling, same placeholder text)

Layout: Fields 1 and 2 sit in a 2-column grid (gap 16px). Field 3 (toggle) sits full-width below. Fields 4 and 5 each sit full-width below that, stacked vertically with 16px gap between them.

Keep the AI info callout box and the Back / Generate Safety Briefing buttons unchanged.

---

## CHANGE 2 — AI PROCESSING POP-UP (triggered after clicking "Generate Safety Briefing")

When the user clicks "Generate Safety Briefing →" on Screen 2, show a modal overlay on top of the current screen before transitioning to Screen 3.

Overlay: full viewport, bg rgba(0, 0, 0, 0.65), backdrop blur 4px. Centered modal card.

Modal card:
- bg #182235
- border 1px #1F2B42
- border-radius 12px
- padding 40px 48px
- width 440px
- shadow 0 8px 24px rgba(0,0,0,0.5)
- centered horizontally and vertically in the viewport

Modal content (top to bottom):

1. Animated spinner — centered. Circle, 48px diameter, border 3px solid #1F2B42, border-top 3px solid #2B5597, spinning clockwise with a smooth 1s linear infinite rotation animation.

2. Spacer 24px.

3. Title: "Generating Safety Briefing" in #E7ECF5 at 18px/700, centered.

4. Spacer 8px.

5. Subtitle: "AI is analyzing site conditions and generating role-specific safety instructions for your crew." in #8A9AB6 at 13px/400, centered, max-width 340px, line-height 1.6.

6. Spacer 28px.

7. Animated status messages — a single line of text that cycles through these messages sequentially, each fading in and out every ~1.5 seconds:
  "Fetching TOTCO safety data...",
  "Loading H&P HSE knowledge base...",
  "Generating a Job Plan for Driller...",
  "Generating a Job Plan for Floorman 1...",
  "Generating a Job Plan for Floorman 2...",
  "Generating a Job Plan for Pit Hand...",
  "Generating a Job Plan for Derrickman...",
  "Finalizing briefing report...",

Each message in #6F8FD9 at 12px/500, centered, with a subtle fade-in/fade-out transition between messages (opacity 0 → 1 → 0 over 1.5s each).

8. Spacer 28px.

9. Progress bar — full width of card content area. Track: bg #0E141F, border-radius 4px, height 6px. Fill: bg #2B5597, border-radius 4px, animates from 0% to 100% width over the total duration of all status messages. The fill has a subtle shimmer/pulse animation — a lighter highlight (#5E7FC8) sweeping left to right repeatedly.

10. Spacer 16px.

11. Progress label below bar — right-aligned. Shows percentage incrementing in sync with the bar: "0%" → "100%". Color #5F6F8A, 11px/400.

The modal is NOT dismissible — no close button, no click-outside-to-close. It automatically transitions to Screen 3 when the animation completes.

---

## CHANGE 3 — SCREEN 3: DASHBOARD LAYOUT & ROLES

### 3A — Update the job roles everywhere they appear

Replace the 6 previous role tabs with these 5 roles:

1. DRILLER
2. FLOORMAN 1
3. FLOORMAN 2
4. PIT HAND
5. DERRICKMAN

These 5 roles must appear:
- In the left role navigation panel (see 3B below)
- In the bottom completion progress bar (abbreviated: D / F1 / F2 / PH / DK)

### 3B — Replace the right-side Crew Attendance panel with a LEFT-SIDE ROLE NAVIGATION PANEL

Remove the right-side "CREW ATTENDANCE" panel entirely.

Add a fixed left-side vertical panel:
- Width: 200px
- Height: full content area height
- bg #121A28
- Right border: 1px #1F2B42
- Padding: 12px 0

Panel header: padding 12px 16px, border-bottom 1px #1F2B42.
Label: "ROLES" in #8A9AB6 11px/600 uppercase.

Below header: vertical list of the 5 role items. Each item is a full-width row:
- Height: 48px
- Padding: 0 16px
- Border-left: 3px solid transparent (default)
- bg: transparent (default)

Active state (currently selected role):
- Border-left: 3px solid #2B5597
- bg: #1F2B42
- Role label: #E7ECF5 13px/600

Inactive state:
- Border-left: 3px solid transparent
- bg: transparent
- Role label: #8A9AB6 13px/400
- Hover: bg #182235, label #B6C2D9

Each role row contains:
- Top line: role title (e.g. "DRILLER") in the state colors above, 12px/600 uppercase
- Bottom line: completion status — if complete: "✓ Complete" in #4ED199 10px/400 | if in progress: "In Progress" in #FFDA8A 10px/400 | if not started: "Not Started" in #5F6F8A 10px/400

Role list order (top to bottom):
1. DRILLER — active (In Progress)
2. FLOORMAN 1 — Not Started
3. FLOORMAN 2 — Not Started
4. PIT HAND — Not Started
5. DERRICKMAN — Not Started

### 3C — Adjust the main content area

The main layout is now: Left role panel (200px fixed) + Main AI instructions area (fills remaining width).

The AI-Generated Safety Instructions panel fills the full remaining width to the right of the role panel. Remove the tab row from inside the AI panel — role switching is now handled entirely by the left panel.

The active panel content shows the DRILLER instructions:
- Weather alert banner (same red/warning style)
- PERSONAL PROTECTIVE EQUIPMENT section with checklist
- PRE-SHIFT CHECKS section with checklist
- EMERGENCY PROCEDURES section with checklist

Keep same checkbox styling, section headers, and completion badges (e.g. 2/4).

### 3D — Update the bottom progress bar

Keep same bar layout and styling. Update role labels to: D / F1 / F2 / PH / DK (spaced evenly above the bar). Show D (Driller) as in-progress (blue dot), all others as not started (dark outline dot). Update text to "1 of 5 roles briefed".

Keep "CLOSE & FINALIZE BRIEFING" button in its disabled state.
Keep "DOWNLOAD BRIEFING REPORT ↓" button active and unchanged.

### 3E — Update the top context bar

Keep RIG 145, MIDLAND TX, and weather chips unchanged.
Remove any reference to 6/6 crew count.

---

## CHANGE 4 — SCREEN 3: AI CONTENT FOR DRILLER (ACTIVE ROLE)

DRILLER — Active panel content:

Weather Alert banner (same red style):
"Weather Alert: Light rain increases slip risk on rig floor. Monitor wind speed — current 18 MPH is in the caution zone for lifting operations."

PERSONAL PROTECTIVE EQUIPMENT (2/4 checked):
☑ Steel-toed boots with slip-resistant soles — mandatory (wet conditions)
☑ Hard hat with chin strap fastened
☐ High-visibility rain gear — required due to precipitation
☐ Non-slip gloves rated for wet environments

PRE-SHIFT CHECKS (1/4 checked):
☑ Confirm rig floor drainage — no standing water
☐ Verify all floor grating secured and anti-slip mats placed
☐ Check BOP controls for moisture ingress
☐ Confirm wind speed within safe limits for all planned lifts (current: 18 MPH — caution)

EMERGENCY PROCEDURES (1/3 checked):
☑ Review muster point — confirm accessible in current visibility
☐ Confirm radio channel and backup comms
☐ Identify nearest sheltered evacuation route

---

Keep all other elements of the 3 screens exactly as they are.