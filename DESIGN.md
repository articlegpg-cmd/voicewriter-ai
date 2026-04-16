# Design Brief: AI Voice Writer

## Purpose & Context
Fast-capture audio transcription and editing tool. Users record thoughts at speaking speed, AI transcribes instantly, then polish text with AI rewrite suggestions and one-click filler removal. Minimal, focused, audio-forward.

## Aesthetic Direction
Modern minimalist productivity tool with audio-forward tactility. Vibrant focus blue paired with warm recording-state orange. Typography pairs sophisticated serif (Fraunces) titles with friendly DM Sans body. No decoration — interaction and recording state are visual centerpieces.

## Color Palette (OKLCH)

| Token | Light | Dark | Intent |
|-------|-------|------|--------|
| Primary | `0.65 0.19 265` (vibrant blue) | `0.75 0.18 265` (bright blue) | Focus, calm, tech-forward |
| Accent | `0.62 0.17 45` (warm orange) | `0.65 0.18 45` (bright orange) | Recording, active states, record button |
| Destructive | `0.55 0.22 25` (red) | `0.65 0.19 22` (bright red) | Delete, destructive actions |
| Background | `0.98 0 0` (near white) | `0.12 0 0` (deep charcoal) | Reduced eye strain, focus |
| Foreground | `0.18 0 0` (dark grey) | `0.93 0 0` (light grey) | Text, semantic meaning |

## Typography
- **Display**: Fraunces serif — sophisticated, unexpected, signals creative tool
- **Body**: DM Sans — modern, friendly, highly legible at all sizes
- **Mono**: Geist Mono — technical, code-like, for transcript timestamps

## Structural Zones

| Zone | Background | Border | Intent |
|------|-----------|--------|--------|
| Header | `bg-card` | `border-b border-border` | Sticky, visual anchor, branding |
| Recording | `bg-background` | none | Central focus, waveform lives here |
| Transcript | `bg-card` | `border border-border` | Editable content, secondary focus |
| History | `bg-muted/40` | `border-l border-border` | Sidebar, low-emphasis list |
| Actions | `bg-muted/20` | none | Floating or sticky footer |

## Spacing & Rhythm
- **Compact**: 8px (micro-interactions, gaps)
- **Base**: 16px (primary spacing)
- **Generous**: 24px–32px (section separation)
- **Density**: Card-based layout, moderate whitespace, no crowding

## Component Patterns
- **Recording controls**: Large, centered. Record button uses accent orange with recording-pulse animation. Play/pause/stop as secondary buttons.
- **Waveform visualization**: Animated bars responding to audio input, waveform-bar animation, `height: 8px–24px`
- **Transcript textarea**: Bordered card, editable with clear focus state, cursor feedback
- **AI suggestions**: Inline badges or popovers (rewrite, clear fillers), secondary button styling
- **History list**: Compact, timestamp + title rows, subtle hover state

## Motion & Micro-interactions
- **Recording pulse**: `recording-pulse` 2s loop on record button and recording indicator
- **Waveform animation**: `waveform-bar` 0.6s ease-in-out infinite on each bar
- **Transitions**: All smooth transitions use `transition-smooth` (0.3s cubic-bezier)
- **Recording state**: Clear visual feedback — button color changes, indicator pulses, waveform activates

## Signature Detail
Animated waveform bars in vibrant blue — visual centerpiece of recording interface. Each bar independently animated, responding to audio input in real time. Creates sense of captured energy and flow.

## Constraints & Guardrails
- **No decoration**: No gradients, no ornamental effects, no shadows beyond functional elevation
- **Audio affordances first**: Waveform, recording state, timer are always visible and prominent
- **High contrast**: Text meets WCAG AA standards in both light and dark modes
- **Mobile-first**: Recording interface scales down gracefully, touch-friendly hit targets
- **Dark mode primary**: Designed for dark mode first (reduced eye strain during recording), light mode as alternative

## Responsive Breakpoints
- **Mobile** (`sm`): Stack layout, full-width recording, sidebar becomes tab-based
- **Tablet** (`md`): Recording centered, history sidebar visible, floating actions
- **Desktop** (`lg`): 3-column layout possible, history sidebar fixed, full recording interface
