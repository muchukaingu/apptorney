# 2026-03-08 Auth Screen Visual Redesign

## Goal

Elevate the auth screens (login, register, OTP verification) to match the monochrome, minimalist brand aesthetic with better typography, spatial composition, floating label inputs, individual OTP digit boxes, and polished animations.

## Tasks

- [x] CSS — Modal container & animations (slide-up, fade-in)
- [x] CSS — Close button refinement (SVG icon)
- [x] HTML/CSS — Brand mark + typography (monogram, subtitles)
- [x] HTML/CSS — Floating label inputs
- [x] HTML/TS — OTP individual digit boxes with auto-advance
- [x] CSS — Submit button & loading spinner
- [x] CSS — Error messages & switch links polish
- [x] CSS — Mobile responsive adjustments
- [x] Validate the result (build passes)
- [x] Add a completion note in `## Notes`

## Notes

- 2026-03-08: All steps implemented. Build passes clean.
  - `web-app/src/styles.css` — Replaced all login-modal/auth CSS with redesigned styles (animations, floating labels, OTP boxes, spinner, error banner, responsive)
  - `web-app/src/app/components/landing-page/landing-page.component.html` — Restructured auth modal with brand mark, SVG close button, floating-label inputs, OTP digit boxes, btn-spinner
  - `web-app/src/app/components/landing-page/landing-page.component.ts` — Added `otpDigits` array and 3 OTP handler methods + private `emitOtpValue`
