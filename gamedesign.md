# Game Design Brief

## Core Premise
- Project name: `PaperclipPrompt`
- Short name: `PP`
- The game is mostly 3D with minimal UI.
- The central fantasy is turning the universe into paperclips.

## UI Direction
- Keep interface chrome sparse.
- Show a `paperclips per second` indicator as text in the top-right corner.
- Discourage card-based UI. Only use card-like containers when explicitly requested.
- All UI should be space-efficient and prefer symbols over long text labels.

## Progression Framing
- The game ultimately plays out at universe scale in space.
- Do not reveal the full universe-scale scope immediately.
- The experience should begin on Earth.
- The opening view shows a city with a paperclip factory.
- The starting factory output is `100 paperclips per minute`.

## Camera & Navigation
- Camera movement is Earth-centric and anchored to factory #1.
- Do not allow free drag-orbit camera control.
- The player can zoom out from the factory view toward the edge of the observable universe.
- Zoom range will later be gated by progression unlocks.

## Development Tooling
- Add a development-only asset browser so assets can be added, inspected, and improved during production.
- Hide the asset browser in user-facing runtime mode.
- The asset browser should open as a separate fullscreen view or popup, not a small inline panel.
- The asset browser should have a sidebar listing all assets.
- Selecting an asset should show it in a main inspection view with mouse rotation.

## Asset Priorities
- The paperclip asset is central to the identity of the game and should receive above-average quality and attention.
