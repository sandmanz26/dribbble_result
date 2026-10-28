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
  colour per aisle, as a pale tile with that colour's dark as ink: on the aisle map, on each stop's
  shelf slot, on the number to bring and in the stop sheet. Status is a word in a small pill, so
  colour never has two meanings. Endcaps are grey and ink.
- A phone app, not a web form: large screen titles, white cards on a grey ground, 52px rows with the
  shelf slot as a tile, and every choice in a bottom sheet. Column matching uses a custom picker
  sheet that lists the file's columns with a sample of what is in each, marks the one in use, and
  moves a column that another field was using (one column feeds one field). Keyboard: arrows,
  Home, End, Escape; focus returns to the row that opened it; the handle drags the sheet closed.
- taste-skill app style "pastel consumer" (seed 954516883, `.taste-skill/app2/direction.json`),
  replacing the first "framed sheet", which read as a desktop admin squeezed into a phone. Manrope
  from the sheet was not used because project7 uses it; Rethink Sans stays.

## States
No files, one file, unmatched columns, unreadable file, join problems, walk in progress, filters
with zero rows, walk finished, skipped stops, undo, phone and desktop.
