Create a dark-themed industrial pre-job safety planning web application with exactly 3 screens using this design system:

---
## DESIGN SYSTEM
### Colors
Background surfaces (dark blue-gray):
- App background: #0E141F
- Cards/panels: #182235
- Headers/sidebars: #121A28
- Hover states: #1F2B42
- Active/selected: #253552

Brand:
- Primary button/accent: #2B5597
- Primary hover: #5E7FC8
- Primary light: #6F8FD9

Text:
- Primary text: #E7ECF5
- Secondary text: #B6C2D9
- Tertiary/labels: #8A9AB6
- Muted/disabled: #5F6F8A

Status:
- Success/Active: #4ED199
- Warning: #FFDA8A
- Error/Critical: #F7A3A8
- Info: #6F8FD9

Status badge backgrounds:
- Critical: rgba(247, 163, 168, 0.15) with #F7A3A8 border
- Warning: rgba(255, 218, 138, 0.15) with #FFDA8A border
- Active: rgba(78, 209, 153, 0.15) with #4ED199 border

### Typography
Font family: Inter (weights: 400, 500, 600, 700, 800)
- 12px / 400 — captions, badges, small labels
- 13px / 400–500 — body text
- 14px / 500–600 — subheadings, form labels
- 16px / 600 — section headers
- 18px / 700 — page titles

### Spacing: 4px, 8px, 12px, 16px, 20px, 24px, 32px
### Border radius: badges/inputs 4px | buttons/cards 6–8px | panels 8–12px
### Shadows: card 0 1px 3px rgba(0,0,0,0.3) | modal 0 4px 12px rgba(0,0,0,0.4)

### Buttons
Primary: bg #2B5597, text #FFFFFF, hover #5E7FC8, padding 8px 16px, border-radius 6px, 12px/600
Secondary: bg #1F2B42, text #B6C2D9, border 1px solid #253552, hover #253552, same padding/radius

### Key Components
Header bar: height 52px, bg #121A28, bottom border 1px #5F6F8A, sticky
Cards/Panels: bg #182235, border 1px #1F2B42, border-radius 8px, padding 12px
Search input: height 34px, bg #182235, border 1px #1F2B42, border-radius 8px, focus border #2B5597
Status badges: 10px/800, letter-spacing 0.5px, UPPERCASE, padding 2px 8px, border-radius 4px
Scrollbars: 6px wide, track #0E141F, thumb #1F2B42

### Tone
Industrial, high-information-density, professional dark UI. Oil & gas operations aesthetic. No bubbly elements — sharp, data-focused.

---

## SCREEN 1 — LOGIN

Full viewport, background #0E141F with a very subtle diagonal grid texture overlay at 4% opacity.

Center-aligned login card:
- Card: bg #182235, border 1px #1F2B42, border-radius 12px, padding 40px 48px, width 420px, shadow 0 8px 24px rgba(0,0,0,0.5)
- Top of card: H&P logo mark — bold "H&P" text in #2B5597 at 28px/800, followed by a thin 1px horizontal divider in #1F2B42, then subtitle "RigSafe Pre-Job Planning" in #8A9AB6 at 13px/500, letter-spacing 1.5px, uppercase
- Spacer 32px
- Field label "DRILLING MANAGER ID" in #8A9AB6 at 11px/600, letter-spacing 1px, uppercase
- Text input: height 40px, bg #0E141F, border 1px #1F2B42, border-radius 6px, placeholder "Enter your manager ID" in #5F6F8A, text #E7ECF5, left icon: a person/user icon in #5F6F8A
- Spacer 16px
- Field label "PASSWORD" same style
- Password input: same styling, right side show/hide eye icon in #5F6F8A
- Spacer 8px
- Small text right-aligned: "Forgot credentials?" in #6F8FD9 at 12px/500
- Spacer 24px
- Full-width primary button "SIGN IN" — bg #2B5597, text #FFFFFF, height 44px, border-radius 6px, 13px/600, letter-spacing 1px. Left of label: a small lock icon
- Spacer 24px
- Thin divider #1F2B42
- Spacer 16px
- Bottom text: "H&P Field Operations System" centered, #5F6F8A, 12px/400

Bottom of screen: status bar strip — full width, height 32px, bg #121A28, border-top 1px #1F2B42. Left: green dot + "System Online" in #4ED199 at 11px/500. Right: current date/time "MON 16 MAR 2026 — 05:28 AM" in #5F6F8A at 11px/400.

---

## SCREEN 2 — WEATHER & SHIFT SETUP

Full viewport. Header bar 52px: bg #121A28, bottom border 1px #5F6F8A. Left: "H&P" in #2B5597 bold + " | Pre-Job Planning" in #8A9AB6. Right: logged-in user chip showing avatar circle (initials "DM") in #2B5597 bg + "Marcos — Drilling Manager" in #B6C2D9 at 12px/500.

Main content centered, max-width 640px, padding-top 64px:

Step indicator at top — horizontal 3-step stepper:
- Step 1 circle: filled #2B5597, checkmark icon, label "Login" in #4ED199 at 12px/500
- Connector line: #2B5597
- Step 2 circle: filled #2B5597, "2" label, label "Site Conditions" in #E7ECF5 at 12px/600 — ACTIVE
- Connector line: #1F2B42
- Step 3 circle: outlined #1F2B42, "3", label "Briefing Dashboard" in #5F6F8A at 12px/400

Spacer 40px.

Section title: "Morning Site Conditions" in #E7ECF5 at 18px/700. Below it: "Rig 145 — Midland, TX — MON 16 MAR 2026" in #8A9AB6 at 13px/400.

Spacer 24px.

Card — bg #182235, border 1px #1F2B42, border-radius 8px, padding 24px:

Section header row: cloud/sun icon in #6F8FD9 + "RIG WEATHER CONDITIONS" label in #8A9AB6 at 11px/600 uppercase letter-spacing 1px. Right side: small secondary button "Auto-detect from GPS" with a location-pin icon.

Spacer 16px.

2-column grid (gap 16px):

Left column:
- Label "WEATHER" 11px/600 #8A9AB6 uppercase
- Dropdown select: height 40px, bg #0E141F, border 1px #1F2B42, border-radius 6px, text #E7ECF5 13px. Options visible in dropdown ghost: Clear / Partly Cloudy / Overcast / Light Rain / Heavy Rain / Thunderstorm / High Winds / Fog / Snow. Currently showing "Select weather condition" placeholder. Chevron-down icon right.

Right column:
- Label "WIND SPEED" 11px/600 #8A9AB6 uppercase
- Input with suffix: bg #0E141F, border 1px #1F2B42, border-radius 6px, height 40px, placeholder "0", right suffix tag "MPH" in #5F6F8A bg #0E141F border-left 1px #1F2B42, padding 8px

Second row (2 column):
Left:
- Label "TEMPERATURE" uppercase same style
- Input with suffix "°F"

Right:
- Label "VISIBILITY" uppercase
- Dropdown: Unlimited / >5 miles / 2–5 miles / <2 miles / Near Zero

Third row (full width):
- Label "ADDITIONAL SITE HAZARDS (OPTIONAL)" uppercase
- Textarea: height 72px, bg #0E141F, border 1px #1F2B42, border-radius 6px, placeholder "E.g. wet surfaces from overnight rain, high UV index, construction near rig floor..." in #5F6F8A, resize: none

Spacer 24px.

Info callout box: bg rgba(111, 143, 217, 0.08), border 1px rgba(111, 143, 217, 0.25), border-radius 6px, padding 12px 16px. Left: info circle icon in #6F8FD9. Text: "AI will generate role-specific safety instructions based on the weather and site conditions you enter above." in #B6C2D9 at 12px/400.

Spacer 24px.

Right-aligned row: secondary button "Back" + primary button "Generate Safety Briefing →" with a sparkle/AI icon on the left of the label.

---

## SCREEN 3 — MORNING BRIEFING DASHBOARD

Full viewport. Same header as Screen 2, with an additional right-side element: warning badge "BRIEFING IN PROGRESS" — bg rgba(255,218,138,0.15), border 1px #FFDA8A, text #FFDA8A, 10px/800 uppercase, border-radius 4px, padding 4px 10px.

Layout: full-width, no sidebar. Content area padding 20px 24px. 

--- TOP CONTEXT BAR ---
Full-width strip, bg #121A28, border-bottom 1px #1F2B42, padding 10px 24px. Single row of pills/chips:
- "RIG 145" chip: bg #1F2B42, border 1px #253552, text #B6C2D9, 11px/600, border-radius 4px, padding 3px 10px
- "MIDLAND, TX" same chip style
- Weather chip: cloud-rain icon + "Light Rain — 42°F — 18 MPH Winds" in #FFDA8A, bg rgba(255,218,138,0.08), border 1px rgba(255,218,138,0.2), border-radius 4px
- Visibility chip: eye icon + "Visibility: 2–5 miles" same warning yellow style  
- Right-aligned: clock icon + "05:31 AM — MON 16 MAR 2026" in #8A9AB6 at 12px/400

--- MAIN CONTENT GRID ---

Row 1: 3-column grid, gap 16px, height fit-content.

COLUMN 1 (span 2) — AI-GENERATED SAFETY INSTRUCTIONS panel:
Card bg #182235, border 1px #1F2B42, border-radius 8px.

Card header: padding 12px 16px, border-bottom 1px #1F2B42. Left: sparkle icon in #6F8FD9 + "AI-GENERATED SAFETY INSTRUCTIONS" in #8A9AB6 11px/600 uppercase. Right: small secondary icon button (refresh/regenerate icon) with tooltip label "Regenerate".

Underneath header: horizontal tab row, bg #0E141F, border-bottom 1px #1F2B42. Tabs for each of the 6 roles:
- "DRILLER" — active tab: bottom border 2px #2B5597, text #E7ECF5 12px/600
- "ASST. DRILLER" — inactive: text #5F6F8A 12px/400, hover #8A9AB6
- "DERRICKMAN" same
- "FLOORMAN" same
- "MOTOR HAND" same
- "COMPANY MAN" same

Active tab content area (DRILLER selected), padding 16px:

AI warning banner at top of tab: bg rgba(247,163,168,0.08), border-left 3px solid #F7A3A8, border-radius 0 4px 4px 0, padding 8px 12px, margin-bottom 12px. Icon: rain/hazard icon in #F7A3A8. Text: "Weather Alert: Light rain increases slip risk on rig floor surfaces. Elevated fall hazard today." in #F7A3A8 at 12px/500.

Then 3 safety instruction sub-sections, each with:
Sub-header row: category icon + label in #8A9AB6 11px/600 uppercase + right side: all-items-checked green badge "3/3" in #4ED199 or pending badge.

Section A — "PERSONAL PROTECTIVE EQUIPMENT":
Checklist items, each row: checkbox (square, border 1px #253552, border-radius 3px, checked = bg #2B5597 with white checkmark) + item text in #E7ECF5 13px/400. Items:
☑ Steel-toed boots with slip-resistant soles — mandatory today (wet conditions)
☑ Hard hat with chin strap fastened
☐ High-visibility rain gear — required due to precipitation
☐ Non-slip gloves rated for wet environments

Section B — "PRE-SHIFT CHECKS" (same checkbox list style):
☑ Inspect rig floor drainage — confirm no standing water
☐ Verify all floor grating is secured and anti-slip mats placed
☐ Check BOP controls for moisture ingress
☐ Confirm wind speed does not exceed safe lift limits (current: 18 MPH — caution zone)

Section C — "EMERGENCY PROCEDURES":
☑ Review muster point location — confirm accessible in low-visibility conditions
☐ Confirm radio channel and backup comms due to weather
☐ Identify nearest sheltered evacuation route

COLUMN 2 — CREW & ATTENDANCE panel:
Card bg #182235, border 1px #1F2B42, border-radius 8px.

Card header: padding 12px 16px, border-bottom 1px #1F2B42. People icon + "CREW ATTENDANCE" in #8A9AB6 11px/600 uppercase. Right: "6/6 PRESENT" badge in #4ED199 style.

Crew list — 6 rows, each: padding 10px 12px, border-bottom 1px #0E141F. 
Each row: left green dot (presence indicator) + role label in #E7ECF5 13px/600 + name in #8A9AB6 13px/400 + right side: small "SIGNED" badge in #4ED199 style OR "PENDING" badge in #FFDA8A style.

Rows:
🟢 Driller — R. Thompson — SIGNED #4ED199
🟢 Asst. Driller — K. Okafor — SIGNED
🟢 Derrickman — M. Santos — PENDING #FFDA8A
🟢 Floorman — D. Walsh — PENDING
🟢 Motor Hand — T. Nguyen — PENDING
🟢 Company Man — B. Reeves — SIGNED

Below list: full-width secondary button "Record All Signatures" with pen/sign icon.

--- ROW 2: FULL WIDTH ---

OVERALL BRIEFING PROGRESS bar:
Card bg #182235, border 1px #1F2B42, border-radius 8px, padding 16px 20px. Single row:

Left: "BRIEFING COMPLETION" label in #8A9AB6 12px/600 uppercase. 

Center: wide progress bar — track bg #0E141F, border-radius 4px, height 8px, fill #2B5597, width showing ~55% complete. Above bar: 6 small role labels (Driller, Asst. Driller, Derrickman, Floorman, Motor Hand, Company Man) spaced evenly. Under each label: a small circle — green filled if complete, blue filled if current, dark outline if pending.

Right cluster: 
- "4 of 6 roles briefed" in #B6C2D9 13px/500
- Vertical divider 1px #1F2B42
- Primary button "CLOSE & FINALIZE BRIEFING" — disabled state (bg #1F2B42, text #5F6F8A, border 1px #253552) because not all roles complete — with tooltip on hover "Complete all roles before finalizing"
- Secondary button "DOWNLOAD BRIEFING REPORT ↓" — bg #1F2B42, border 1px #253552, text #B6C2D9, icon: download arrow — this one IS active. On hover bg #253552 text #E7ECF5.

Make all 3 screens desktop resolution (1440 × 900px). Use consistent 24px outer margins. All screens should feel like they belong to the same product — same header DNA, same card style, same typography rhythm. The overall aesthetic is a control-room-grade industrial web app for oil & gas field operations.