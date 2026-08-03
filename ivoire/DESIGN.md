---
name: Ivoire
colors:
  surface: '#fff9ef'
  surface-dim: '#dfd9d1'
  surface-bright: '#fff9ef'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f3ea'
  surface-container: '#f3ede4'
  surface-container-high: '#ede7df'
  surface-container-highest: '#e7e2d9'
  on-surface: '#1d1b16'
  on-surface-variant: '#51443d'
  inverse-surface: '#32302a'
  inverse-on-surface: '#f6f0e7'
  outline: '#83746c'
  outline-variant: '#d5c3b9'
  surface-tint: '#7f5538'
  primary: '#7c5236'
  on-primary: '#ffffff'
  primary-container: '#986a4c'
  on-primary-container: '#fffbff'
  inverse-primary: '#f3bb98'
  secondary: '#705a4f'
  on-secondary: '#ffffff'
  secondary-container: '#fbdccf'
  on-secondary-container: '#766055'
  tertiary: '#635b4d'
  on-tertiary: '#ffffff'
  tertiary-container: '#7c7465'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbc7'
  primary-fixed-dim: '#f3bb98'
  on-primary-fixed: '#311401'
  on-primary-fixed-variant: '#643e23'
  secondary-fixed: '#fbdccf'
  secondary-fixed-dim: '#ddc1b3'
  on-secondary-fixed: '#281810'
  on-secondary-fixed-variant: '#574239'
  tertiary-fixed: '#ece1cf'
  tertiary-fixed-dim: '#d0c5b4'
  on-tertiary-fixed: '#201b10'
  on-tertiary-fixed-variant: '#4d4639'
  background: '#fff9ef'
  on-background: '#1d1b16'
  surface-variant: '#e7e2d9'
typography:
  display-lg:
    fontFamily: Bodoni Moda
    fontSize: 64px
    fontWeight: '300'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Bodoni Moda
    fontSize: 48px
    fontWeight: '300'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: '300'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Bodoni Moda
    fontSize: 28px
    fontWeight: '300'
    lineHeight: '1.2'
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.15em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  margin-mobile: 20px
  margin-desktop: 64px
  gutter: 16px
  section-gap: 120px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system embodies a high-end, editorial boutique aesthetic tailored for a sophisticated fashion audience. It draws heavily from **Minimalism** and **Modern-Corporate** editorial standards, prioritizing breathable whitespace and rhythmic layouts over UI ornamentation. The tone is calm, warm, and grounded, evoking a sense of luxury through restraint and precise typography.

The visual identity is defined by:
- **Editorial Sophistication:** High-contrast photographic compositions and architectural alignment.
- **Warmth:** A departure from sterile digital whites in favor of an organic, earthy palette.
- **Subtlety:** Communication of hierarchy through scale and spacing rather than drop shadows or saturated colors.

## Colors
The palette is a curated selection of earthy tones designed to feel tactile and timeless. 

- **Primary Tone:** "Milk Coffee" (#A9795A) serves as the call-to-action anchor, providing warmth without the aggression of typical brand colors.
- **Surface Strategy:** The background uses a creamy, warm base (#F7F1E8) to reduce screen glare, while panels and cards utilize a slightly brighter off-white (#FFFDF9) to create soft, natural-looking separation.
- **Typography Tones:** Dark Brown (#3E2C23) provides high legibility for headings while maintaining a softer profile than pure black. Secondary text utilizes a muted taupe (#7A6A5D) to recede in the visual hierarchy.

## Typography
The typography system relies on the interplay between an elegant, high-contrast serif for display and a clean, contemporary sans-serif for utility.

- **Headings:** Set in **Bodoni Moda** with light weights (300). These should feel like a fashion magazine masthead. Larger headings use tight line-heights and slight negative letter-spacing for a modern "compressed" editorial look.
- **Body & Labels:** **Hanken Grotesk** provides a sharp, professional contrast. It is used for product descriptions and navigation.
- **Labels:** Small UI labels (categories, "New In", sizes) must always be set in uppercase with generous letter-spacing (0.15em) to maintain a premium feel.

## Layout & Spacing
The layout follows a **Fluid Grid** model with significant intentional padding. The goal is to let imagery "breathe," treating the digital screen as a physical printed page.

- **Desktop:** A 12-column grid with wide 64px outer margins. Content should be centered with ample vertical gaps (120px) between sections to prevent visual clutter.
- **Mobile:** A 2-column or 1-column grid with 20px margins.
- **Rhythm:** Spacing follows a strict 8px baseline. Vertical stack spacing is generous; never crowd text against images. Use `stack-lg` (32px) for spacing between headings and body text in editorial blocks.

## Elevation & Depth
This design system rejects traditional shadows. Depth is achieved through **Tonal Layering** and **Low-Contrast Outlines**.

- **Surfaces:** Use #FFFDF9 for foreground elements (like product cards or menus) against the #F7F1E8 background.
- **Borders:** A consistent 1px solid border (#E4D9C7) is used to define boundaries. 
- **Imagery:** Depth is provided by the photography itself. High-quality, portrait-oriented images with natural lighting act as the primary "elevated" elements.
- **Interactions:** Hover states should transition through subtle color shifts (e.g., background darkening slightly) rather than lifting the element via shadow.

## Shapes
Shapes are strictly geometric and sharp to align with an architectural/editorial feel. 

- **Corner Radius:** Standard components (buttons, input fields) use a "Soft" 0.25rem (4px) radius. This provides just enough softness to feel premium without becoming "bubbly" or app-like.
- **Imagery:** Product images should remain strictly sharp (0px radius) to maintain a clean, professional edge.
- **Pills:** Avoid pill-shaped buttons entirely.

## Components
Consistent styling of components ensures the brand remains cohesive and high-end.

- **Buttons:** 
  - *Primary:* Solid #A9795A fill with white or cream text. 1px radius. No shadow.
  - *Secondary:* 1px border (#3E2C23) with transparent background. Uppercase label.
- **Product Cards:** Portrait orientation (2:3 or 3:4 ratio). No borders on the image itself. Product name in Serif (Title-MD), price in Sans-Serif (Body-MD).
- **Header:** Minimalist white/cream bar. The "IVOIRE" logo is typographic, centered, with high letter-spacing.
- **Input Fields:** 1px border (#E4D9C7) on all four sides or bottom-border only for a more "boutique" look. Labels are always small and uppercase.
- **Chips/Badges:** Small, rectangular badges for "New" or "Sold Out," using the Secondary Text color (#7A6A5D) with very light background tints. No rounded corners.
- **Icons:** Use thin (1px) stroke icons only. Avoid filled icons unless indicating an active state (e.g., a filled heart for a saved item).