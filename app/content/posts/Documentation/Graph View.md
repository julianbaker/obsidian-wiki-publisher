# Graph View

Graph View visualizes links between pages.

## Access

- Open from the sidebar graph button.
- Or visit `/graph` directly.

## Live demo setup

This page links to:

- [[Documentation/WikiLinks]]
- [[Documentation/Dataview]]
- [[Documentation/Timeline Blocks]]

The WikiLinks page links back to [[Documentation/Graph View]].

## What to verify

1. Open `/graph`.
2. Hover the `Graph View` node to highlight direct neighbors.
3. Confirm it connects to `WikiLinks`, `Dataview`, and `Timeline Blocks`.
4. Click a highlighted node to navigate to that page.
5. Open `/documentation/graph-view` and confirm `Linked References` includes `WikiLinks`.

## Data source

Graph data is served by `/api/graph` and built from resolved WikiLinks between published pages.

## Interaction

- Hover a node to highlight neighbors.
- Click a node to navigate to its page.
- Use zoom/fit controls for large graphs.
