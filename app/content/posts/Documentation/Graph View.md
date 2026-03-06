# Graph View

Visualize page-to-page relationships from resolved WikiLinks.

## Mental model

- Each published page is a node.
- Each resolved WikiLink between pages is an edge.

## Do this

1. Open `/graph` (or use the sidebar graph button).
2. Use this page's links as demo data:
- [[Documentation/WikiLinks]]
- [[Documentation/Dataview]]
- [[Documentation/Timeline Blocks]]
3. Ensure [[Documentation/WikiLinks]] links back to [[Documentation/Graph View]].

## Verify

1. Hover the `Graph View` node and confirm neighboring nodes highlight.
2. Confirm neighbors include `WikiLinks`, `Dataview`, and `Timeline Blocks`.
3. Click a highlighted node and confirm navigation works.
4. Open `/documentation/graph-view` and confirm `Linked References` includes `WikiLinks`.

## Limits

- Graph includes resolved links between published pages only.
- Data source is `/api/graph`.
- Unresolved stub links are not graph edges.
