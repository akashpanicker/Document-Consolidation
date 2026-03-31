Add the following flow triggered by clicking "PRINT ALL". This involves 
a print animation modal and a new Safety Videos screen. 
Keep everything else exactly as-is.

---

## CHANGE 1 — PRINT ANIMATION MODAL

When the user clicks "PRINT ALL", show a modal overlay on top of the 
current screen.

Overlay: full viewport, bg rgba(0,0,0,0.65), backdrop blur 4px. 
Centered modal card:
- bg var(--color-surface-2)
- border var(--border-default)
- border-radius var(--border-radius-lg)
- padding 40px 48px
- width 440px
- box-shadow var(--shadow-dropdown)

The modal plays through 2 stages automatically:

---

### STAGE 1 — PRINTING IN PROGRESS

Content top to bottom:

1. Animated printer icon — centered, size 52px, color var(--color-brand).
   Animate a sheet of paper sliding downward out of the printer 
   repeatedly in a smooth loop.

2. Spacer 20px.

3. Title: "Printing Briefing Report" 
   color var(--color-text-primary), bold, centered.

4. Spacer 8px.

5. Subtitle: "Preparing safety instructions for all 5 roles..." 
   color var(--color-text-tertiary), centered, line-height 1.6.

6. Spacer 24px.

7. Animated progress bar:
   - Track: bg var(--color-surface-1), border-radius var(--border-radius-sm), height 6px
   - Fill: bg var(--color-brand), animates from 0% to 100% over 2.5 seconds
   - Fill has a shimmer sweep animation using var(--color-brand-hover)

8. Spacer 12px.

9. Cycling status messages, each fading in and out every 0.6 seconds,
   color var(--color-info), centered:
   - "Printing Driller instructions..."
   - "Printing Floorman 1 instructions..."
   - "Printing Floorman 2 instructions..."
   - "Printing Pit Hand instructions..."
   - "Printing Derrickman instructions..."

Modal is not dismissible during this stage — no close button.

When progress bar reaches 100%, automatically transition to Stage 2.

---

### STAGE 2 — PRINTING COMPLETE

The modal content cross-fades into the following. No close button still —
the user must interact with one of the two buttons.

Content top to bottom:

1. Success icon — centered, 52px checkmark inside a circle.
   Circle: bg rgba(78,209,153,0.15), border 2px solid var(--color-success).
   Checkmark: color var(--color-success).
   Plays a subtle scale-in animation on appear (0.8 → 1.0 over 0.3s).

2. Spacer 20px.

3. Title: "Briefing Report Printed!"
   color var(--color-text-primary), bold, centered.

4. Spacer 8px.

5. Message: "Great work! Your crew's safety briefing is ready. 
   Stay safe out there and have a great shift."
   color var(--color-text-secondary), centered, line-height 1.6, 
   max-width 320px.

6. Spacer 28px.

7. Divider line: var(--border-default), full width of card.

8. Spacer 20px.

9. Small label above button:
   "Want to reinforce today's safety instructions?"
   color var(--color-text-tertiary), centered.

10. Spacer 12px.

11. Full-width primary button "▶ Watch Safety Videos"
    - bg var(--color-brand)
    - text var(--color-text-primary), bold
    - border-radius var(--border-radius-md)
    - height 44px
    - hover bg var(--color-brand-hover)
    - Left: play icon

12. Spacer 12px.

13. Full-width secondary button "Close"
    - bg var(--color-surface-4)
    - border var(--border-default)
    - text var(--color-text-secondary)
    - border-radius var(--border-radius-md)
    - height 44px
    - hover bg var(--color-surface-5), text var(--color-text-primary)
    - Clicking this closes the modal and returns to the dashboard

---

## CHANGE 2 — SAFETY VIDEOS SCREEN

Clicking "▶ Watch Safety Videos" closes the modal and navigates to 
a new screen. This screen shares the exact same layout as the 
Safety Briefing Dashboard — same header, same left roles panel, 
same bottom bar — with the following differences:

### Header
Keep identical. Update the "BRIEFING IN PROGRESS" badge to 
"SAFETY VIDEOS" — same badge styling but use var(--color-info) 
instead of warning color.

### Left Roles Panel
Keep identical — same 5 roles, same active/inactive states, 
same completion status indicators. Clicking a role switches 
the main content to that role's video.

### Main Content Area
Replace the "AI-GENERATED SAFETY INSTRUCTIONS" panel with 
a "SAFETY VIDEOS" panel:

Panel header:
- Play icon + "SAFETY VIDEOS" label — same header styling 
  as the existing AI instructions panel header
- Right side: same refresh-style icon button but use a 
  playlist icon instead

Active role content area (DRILLER selected as default):

Top: role context row —
"Now watching: DRILLER safety briefing" in var(--color-text-tertiary),
same font size as body text.

Spacer 12px.

Video player block:
- Aspect ratio 16:9, full width of content area
- bg var(--color-surface-1)
- border var(--border-default)
- border-radius var(--border-radius-lg)
- Center of the video area: a play button circle —
  bg rgba(43,85,151,0.85), border 2px solid var(--color-brand),
  size 64px, border-radius 50%, play icon in white
- Bottom of video area: a mock video progress bar —
  track full width, height 4px, bg var(--color-surface-4)
  fill 0% (not started), bg var(--color-brand)
- Below progress bar inside the video: timestamp "0:00 / 4:32" 
  on the left in var(--color-text-muted), 
  fullscreen icon on the right in var(--color-text-muted)
- Overlay text bottom-left of video: role name chip —
  bg rgba(0,0,0,0.6), border-radius var(--border-radius-sm),
  padding 4px 10px, text var(--color-text-primary)

Spacer 16px.

Video title and description below the player:
- Title: "Driller — Daily Safety Briefing" 
  color var(--color-text-primary), bold
- Spacer 6px
- Description: "Covers rig floor hazard awareness, BOP procedures, 
  hook load limits, and emergency protocols specific to the Driller role."
  color var(--color-text-tertiary), line-height 1.6

Each role shows a different video title and description:

FLOORMAN 1:
Title: "Floorman 1 — Rig Floor Connection Safety"
Description: "Covers tong operation, rotary table awareness, 
pipe handling techniques, and V-door safety procedures."

FLOORMAN 2:
Title: "Floorman 2 — Iron Roughneck & Dropped Object Prevention"
Description: "Covers iron roughneck alignment, spinning chain 
inspection, dropped object reporting, and drill line procedures."

PIT HAND:
Title: "Pit Hand — Mud System Monitoring & Chemical Safety"
Description: "Covers pit level monitoring, shaker screen 
inspection, chemical handling protocols, and trip tank operation."

DERRICKMAN:
Title: "Derrickman — Derrick Safety & Tripping Operations"
Description: "Covers elevator and bail inspection, monkey board 
safety, racking board procedures, and escape line protocols."

### Bottom Bar
Keep identical styling. Update text to "1 of 5 videos watched". 
Replace "CLOSE & FINALIZE BRIEFING" with "MARK ALL WATCHED" 
in the same disabled state style. Keep "PRINT ALL" button 
as-is on the right.

---

Keep all other screens and elements exactly as-is.