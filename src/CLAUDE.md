# Document Consolidation App — Claude Code Context

## Project Overview
A React + TypeScript web application built for Helmerich & Payne (H&P) 
to consolidate safety documents from H&P and KCAD after acquisition. 
Built by Bizmetric. Part of the H&P product family — shares the same 
design system and component library as RigSafe and the Pre-Job Planning app.

## Tech Stack
- React + TypeScript
- Zustand for state management
- react-i18next for internationalization (English and Español)
- Shared H&P component library
- Two-layer CSS token architecture (raw tokens → semantic tokens)
- Design system tokens in tokens.css (single source of truth)

## Screens
1. Login — Azure AD / SSO authentication
2. Dashboard — Pipeline status, review queue, recent activity
3. Scope — Document selection with Layout 1 and Layout 2 variants
4. Review — AI-generated document review with chunk-level approval
5. Completed Document View — Read-only view of fully approved documents

## Architecture

### State
- useScopeState.ts — all Scope screen state and handlers
- ScopeLayoutProps.ts — shared TypeScript interface for both layouts

### Layout Variants (Scope screen)
- ScopePage.tsx — orchestrator, layout switcher logic
- ScopeLayout1.tsx — default layout (Filter By Activity as multiselect dropdown)
- ScopeLayout2.tsx — alternative layout (Filter By Activity as image cards)
- Layout selection persisted in localStorage under key: hp_doc_scope_layout

### Routing
Login → Dashboard → Scope → Review → /document/:id/view

### Key Components
- AnnotationCallout — paragraph annotation with source details, 
  what was excluded, approve/reject, move to appendix, comments
- StatCard — dashboard stat cards
- TaskRow — dashboard review queue rows
- ActivityItem — dashboard recent activity feed

## Design Rules — CRITICAL
- No inline CSS anywhere — all styling via existing CSS tokens and classes
- No hardcoded hex values, font sizes, or spacing values
- Light mode is the default
- Components must never reference raw tokens directly — always semantic tokens
- All new components must follow existing component architecture
- Font sizes must not go below 12px anywhere in the app

## Figma Files
- Document Consolidation: E4sVm1hmruVl84PIkEuPyc
- Pre-Job Planning (reference): HcpxvoChtSKuxnYzpeTxqU

## Key Features Built
- Dashboard with stat cards, review queue, in-progress, completed tabs
- Scope screen with Region, Rig Type, Filter By Activity dropdowns (all optional)
- Source Documents two-column layout — H&P left, KCAD right
- 1000 documents per column with virtual scrolling
- Document rows with Type badge, Category tags (max 2 + overflow chip), MS badge
- Filter By Activity — 15 categories in 5x3 grid (Layout 2) or multiselect dropdown (Layout 1)
- AI consolidation modal with progress animation (3 second duration)
- Review screen with 3-column layout (left nav, document body, right panel)
- Paragraph-level interactions — hover, select, connector line to annotation callout
- Source reference chips below each paragraph (no percentage shown)
- AI Confidence bar (H&P % vs KCAD %) — static in top right panel
- Auto-approved by AI paragraph state with badge
- Inline text editing with Save/Discard actions and Edited badge
- Approve / Reject / Accepted with Edits paragraph states
- What Was Excluded collapsible section with Re-include action
- Move to Appendix action on annotation callout
- Appendices section in left nav and document body
- Comments at chunk level with @mention tagging
- Progressive merge timeline above paragraphs
- Version history strip below paragraphs
- Completed Document View — read-only with Approval Chain
- i18n full app translation (English/Español)
- Settings popover for AI auto-approval threshold
- Layout switcher in header (beside dark mode toggle)
- AI generation loading modal on Proceed

## Document Types
Standard, Procedure, Checklist, Policy
(shown as color-coded badges using existing token colors)

## H&P Document Naming Format
HSE 005 Hot Work Procedure.pdf
HSE 005 Hot Work Procedure — Europe.pdf

## KCAD Document Naming Format  
K-AZ 012 Environmental Management Work Instruction.pdf
K-CW 002 Health and Safety Procedure — MENA.pdf

## Reviewer Pipeline
- Configurable number of reviewers per document
- Sequential approval — each reviewer only notified after previous approves
- Reviewer states: pending, active, completed
- Shown in stepper at top of Review screen

## Coding Standards
- TypeScript strict mode — no any types
- Components broken into logical sub-components in their own files
- No prop drilling beyond one level
- Prompts to this agent should be direct senior-dev-level instructions
- No explanatory preamble needed in responses
- Never break existing component logic when making UI changes
- Always check for existing components before creating new ones