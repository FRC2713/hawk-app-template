# Hawk application branding

This is the canonical visual and writing guide for applications created from this template. It adapts the established Hawk Shop interface theme so agents do not invent a new Hawk identity for every application.

Source reference: [`FRC2713/hawk-shop` at `59fc217`](https://github.com/FRC2713/hawk-shop/tree/59fc21726cda6a520adff123bb26b7c319952655), especially `app/app.css` and its self-hosted Inter and shadcn/ui conventions.

## Identity

- Use a short, descriptive product name. “Hawk” may prefix a team-wide tool, such as “Hawk Shop.”
- Use sentence case in interface copy and title case only for product and proper names.
- The template's boxed `H` is a temporary app monogram, not the Red Hawk Robotics logo. Replace it with an approved asset when one is supplied.
- Never draw, trace, recolor, or otherwise invent a team hawk logo. Do not copy Hawk Bot's app icon into an unrelated product without explicit approval.
- Machine identifiers stay lowercase and hyphenated even when the human-facing name changes.

## Core palette

These colors are fixed brand inputs. Use the semantic CSS tokens in `src/styles/global.css` rather than pasting hex values into components.

| Role        | Value     | Usage                                                          |
| ----------- | --------- | -------------------------------------------------------------- |
| Hawk red    | `#BD0029` | Primary actions, active navigation, focus, restrained emphasis |
| White       | `#FFFFFF` | Panels and text on Hawk red                                    |
| Black       | `#000000` | Primary text                                                   |
| Cool Grey 7 | `#97999B` | Decorative secondary surfaces and borders                      |
| Warm grey   | `#A3A19E` | Muted decorative surfaces                                      |

The original Hawk Shop values are brand colors, not automatic text colors. Cool Grey 7 and warm grey do not have enough contrast for small text on white. The template therefore supplies darker semantic text neutrals derived for accessible interfaces.

Operational states may use conventional green, amber, blue, and red where meaning matters more than brand recognition. Never use color as the only signal; pair it with text or an icon.

## Typography

- Inter Variable is the interface typeface and is bundled locally through `@fontsource-variable/inter`.
- Do not load fonts from Google Fonts or another CDN. Apps must remain usable on the shop LAN without public internet access.
- Use the system sans-serif stack only as a fallback.
- Prefer ordinary sentence case. Reserve uppercase with increased tracking for short eyebrow labels, never paragraphs or controls.
- Use tabular numerals for measurements, counts, and times that need to align.

## Interface character

- Build calm, practical internal tools: white panels, quiet neutral backgrounds, clear borders, compact controls, and restrained shadows.
- Use Hawk red for the primary action or current location, not for every heading and decoration.
- Default corner radius is `0.5rem`; dialogs and large cards may be slightly rounder when consistent with nearby elements.
- Use source-owned components in `src/components/ui/`. Do not add an arbitrary component registry or a second design system.
- Follow the existing button, field, alert, empty-state, card, and dialog patterns before creating variants.
- Icons should be simple line icons with an accessible label when they act as controls. Do not mix multiple icon styles.

## Themes

Light mode is the required baseline. If an app adds dark mode, preserve Hawk Shop's intent:

- Near-black page background and slightly lighter cards
- White primary text
- A slightly lighter Hawk red for adequate prominence
- Darkened cool-grey borders and inputs
- No pure-white full-page flash during theme initialization

Do not add a theme switcher unless both modes are complete and tested.

## Voice

- Be direct, calm, and specific.
- Name the object and action: “Project deleted,” not “Success!”
- Explain how to recover from an error without blaming the user.
- Prefer familiar words over team or software jargon.
- Confirmation is required for destructive actions; routine actions should not ask for confirmation.

## Accessibility requirements

- Meet WCAG AA contrast for text and controls.
- Keep a visible keyboard focus ring based on Hawk red.
- Every form control has a persistent label; placeholder text is not a label.
- Provide useful empty, loading, validation, error, and success states.
- Test changed user flows at desktop and mobile widths.
- Respect reduced-motion preferences when adding animation.

## Agent checklist

Before completing a user-facing change:

1. Use semantic tokens instead of raw brand hex values or arbitrary Tailwind palette colors.
2. Confirm one clear page heading and one clear primary action.
3. Check keyboard focus, labels, contrast, and narrow-screen layout.
4. Use the approved name or the replaceable monogram; do not invent a logo.
5. Update this guide only when intentionally changing the shared visual system, not to justify a one-off screen.
