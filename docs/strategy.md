# Faceup: strategy notes

## Brief
Minimalist, bold and colourful mobile UI for inventory management that brings planogram and stock
data together: upload both via CSV or Excel, join on SKU, show a unified list in route order with
planned facings, floor and warehouse stock and visual status, warn about planogram SKUs missing
from the inventory, and handle a SKU that lives in more than one place.

## Who and when
A store associate at the start of a shift, phone in one hand, walking the aisles with a cart from
the backroom. The question on every screen: what do I carry out, and where, in the order I walk?

## Competitor frame
Planogram compliance tools (GoSpotCheck by FORM, ShelfMatch, Focal, Salesforce Retail Execution)
centre on photographing shelves and AI recognition. They answer "is the shelf right?" but need
cameras, integrations and set-up. Spreadsheet joins (VLOOKUP) are what stores actually do today,
and they break on column names, stray spaces and duplicate locations. Gap: a light tool that takes
the two files a store already has and turns them into a walk, honest about what did not match.

## Decisions
- Files are joined on the phone; nothing is uploaded. Columns are matched by name, and any the app
  cannot place are asked for, with a preview of the first rows.
- The join is checked before the walk, and problems stay visible: missing items remain on the walk
  as "Not in the count" instead of disappearing.
- Route order: endcaps at the front, then a snake through the aisles (odd aisles front to back,
  even aisles back to front), top shelf first.
- A SKU in two places (shelf and endcap): the count has one floor figure, so it is split by room,
  home shelf first. "Every place" shows each location; "One row per item" combines them. Done and
  skipped states are shared between the two views.
- Status in words first: Fill from back, Fill part, Low with none in back, Empty, Not in the count,
  Full. The number to bring out is the biggest thing on each row.
- Colour: the brief asks for bold and colourful. The colour is the store's own wayfinding, one sign
  colour per aisle, on the aisle map, the row edge and the number to bring; status stays in ink so
  colour never has two meanings. Endcaps are ink.
- taste-skill app style "framed sheet" (seed in `.taste-skill/app/direction.json`): tinted frame,
  white sheet, no shadow at rest. IBM Plex from the sheet was replaced because project3 uses it.

## States
No files, one file, unmatched columns, unreadable file, join problems, walk in progress, filters
with zero rows, walk finished, skipped stops, undo, phone and desktop.
