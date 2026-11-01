# Riuh Studio: creator dashboard and CRM

Dribbble brief "Creator Dashboard" ($500, a few weeks): refine a dashboard and CRM for content creators,
clean and intuitive, so managing their business feels simple. Core workflows, responsive screens, a
cohesive visual system; a small pilot first.

Positioned as a portfolio piece: **Riuh Studio**, the workspace a Jakarta talent agency (Riuh Talent,
a sample name) gives the creators on its roster. Indonesian people, brands and money (IDR); English UI.
The sample creator is Kirana Larasati, a food creator (@makankira). Everything is sample data.

## 1. Research

### What creator business tools do
| Tool | Pattern | Gap for this brief |
|---|---|---|
| Passionfroot | Sponsorship pipeline from inquiry to paid (inquiry, negotiation, booked, content creation, published, paid), automatic invoices and payment links ([Creator Stack Club](https://www.creatorstackclub.com/software/passionfroot), [GTM Directory](https://thegtmdirectory.com/tools/passionfroot)) | Built for Western newsletters and YouTube; no withholding tax, no deposit and final split |
| Beacons for managers | One CRM for every creator, deal and brand on a roster, media kits, campaign reports ([Beacons](https://beacons.ai/i/for-managers), [Sacra](https://sacra.com/chat/h/04e5b865-0de9-48be-bbed-d5316ead5021/)) | A manager's tool; the creator sees little of their own money |
| Media kit guides | Audience demographics (age, gender, top locations), engagement rate, average views, past partners, optional rates; refresh every 3 to 6 months ([Buffer](https://buffer.com/resources/influencer-media-kit/), [vidIQ](https://www.vidiq.com/blog/post/influencer-media-kit-brand-deals), [Beacons](https://beacons.ai/i/blog/how-to-create-the-perfect-media-kit)) | Kits go stale because they are separate documents |

### Contract terms that change the money
- Usage rights, exclusivity and whitelisting (paid amplification) are the clauses with the biggest
  financial impact and are priced on top of the fee; exclusivity is usually time-limited
  ([Lumanu](https://www.lumanu.com/blog/how-influencers-charge-whitelisting-usage-rights),
  [Toptal](https://www.toptal.com/creator/post/influencer-contracts),
  [HelloPartner](https://hellopartner.com/three-ingredients-creator-contracts/)).
- Payment is best tied to content approval, with late-payment terms written in
  ([Superfiliate](https://www.superfiliate.com/field-guide/chapter/guide-navigating-social-media-influencer-contracts)).

### Indonesia
- **Workflow.** Brief, script approval, draft preview, posting, then an insight report (screenshots of
  reach and views) sent to the brand ([Mojok, KOL terms](https://mojok.co/terminal/istilah-yang-harus-diketahui-kol-specialist/amp/),
  [Olakses, KOL brief](https://olakses.com/?p=31214)). Payment commonly in terms: a deposit (DP) up
  front and the rest after the work ([HashMicro, termin](https://www.hashmicro.com/id/blog/termin-sistem-pembayaran-bisnis/)).
- **Rates.** Vendor rate cards run from about Rp200,000 a post for nano creators to Rp80-150 million
  for macro; reported endorsement rates reach Rp92 million a post on Instagram
  ([Olakses](https://olakses.com/?p=30881), [Katadata](https://databoks.katadata.co.id/en/media/statistics/24ffdbe8fbf9779/instagram-influencer-endorsement-rates-in-indonesia-most-expensive-reaches-rp92-million)).
  The sample creator (412k on TikTok) is priced in the middle of that range.
- **Tax.** Endorsement income is taxed: PPh 21 when an individual is paid directly, PPh 23 when the
  payment goes through an agency or company (2% of gross is the commonly cited rate for services),
  PPh 26 from abroad ([pajak.go.id](https://pajak.go.id/id/artikel/endorser-makin-marak-apakah-penghasilannya-kena-pajak),
  [Pajakku](https://pajakku.com/artikel/apakah-kegiatan-endorsement-influencer-terkena-pajak),
  [Klikpajak](https://klikpajak.id/blog/cara-menghitung-pajak-influencer/)). The prototype assumes
  PPh 23 at 2% because Riuh invoices the brands; sources disagree on rates, so the screen says to
  confirm with a tax adviser.
- **Other income.** TikTok Shop affiliate commissions (often cited at 5 to 15% in Indonesia), live
  shopping, creator rewards and YouTube ads sit beside brand deals
  ([Kontan](https://insight.kontan.co.id/news/tiktok-records-sales-of-idr-107-billion-through-live-shopping),
  [ttcalculator](https://ttcalculator.net/learn/tiktok-pay-indonesia-earnings/)). Figures from vendor
  blogs are directional.

## 2. Roast of the first ideas
| First idea | Roast | Decision |
|---|---|---|
| A standard admin panel: dark sidebar, four KPI cards with icons in circles, a gradient area chart | The owner asked for something else, and it says nothing about a creator's day | Dropped |
| Gen-Z neon with glass and gradients for "young" | Reads as generated, and hides the money | Dropped; youth comes from one bright hue, the food photography and friendly words |
| A kanban of grey cards | Every CRM has it | Kept as the deals board, but each card carries its content thumbnail and its money trail, and cards drag between stages |
| A single "Revenue" number | Creators are paid in two parts, minus tax and the agency's cut; one number lies | Every deal shows its rupiah trail: deposit, final, PPh 23, Riuh's 20%, what lands |
| Calendar of posts only | Exclusivity is what breaks deals | The calendar carries exclusivity windows as lanes, and the offer checker warns when a new offer clashes |

## 3. Data inventory
- **Deals:** brand, campaign, stage (negotiating, contracted, in production, posted, paid), deliverables
  (platform, format, script, draft, revisions, posting window, insight due), agreed fee, usage rights
  (months of paid ads), whitelisting, exclusivity (category and end date), payments (deposit and final,
  due and paid dates), PPh 23 withheld, Riuh's commission, take-home, manager, notes.
- **Offers:** brand, channel (email, WhatsApp, platform), deliverables asked, budget offered, dates,
  usage and exclusivity asked; checked against the rate card and current exclusivity.
- **Rate card:** per format, add-ons for usage per 3 months, exclusivity per month, whitelisting.
- **Money:** cash received by month and stream (brand deals, TikTok Shop affiliate, YouTube ads,
  TikTok creator rewards, live gifts), invoices and their status, withholding slips for the annual return.
- **Brands:** category, PIC and role, channel, deals, lifetime value, last contact, next step.
- **Audience (media kit):** followers, average views and engagement per platform, gender, age bands,
  top cities, past partners.
- **People:** the creator, her manager at Riuh, the roster (switcher).

## 4. Screens and their questions
| Route | Question | Signature |
|---|---|---|
| `#/` Today | What do I owe brands today, and when does my money land? | Money landing in the next 30 days on one strip, with the late payment called out |
| `#/offers` | Which new offers are worth taking? | Offer checker: asked work priced on the rate card, add-ons, exclusivity clash, a counter written for you |
| `#/deals` | Where is every deal? | Board you can drag across, each card with its content and money trail |
| `#/deals/:id` | What is left on this deal, and what will I take home? | The rupiah trail and the deliverable steps |
| `#/calendar` | What is posting when, and what can I not promote? | Exclusivity windows as lanes over the month |
| `#/money` | What did I really earn, after tax and Riuh's cut? | Month by stream, invoices, withholding slips |
| `#/brands` | Who should we follow up with? | Relationship list with next steps |
| `#/kit` | What do brands see, and what do I charge? | Rate card editor with the live media kit beside it |

## 5. Style and roast after building
taste-skill app style **accent-ladder** (seed 1821860539), shell ruled T-frame. The dealt raspberry was replaced by
a dragon fruit magenta (#c2185b) to read brighter and local; the ground is tinted toward its palest tint. Face:
the creator's food content as thumbnails in every list. Signature elements: the rupiah trail on every deal and the
"when the money lands" strip; exclusivity lanes on the calendar.

| Found in screenshots | Fix |
|---|---|
| Payment chips overflowed the card; the Today label sat on a week label | Chips clamped inside; week labels near today hidden; Today label at the foot of its line |
| Rows of panels ended at different heights | Up next beside a stacked November and stages column; offers paired with brands to follow up |
| The money strip was unreadable on a phone | Phones get a list of the next six payments instead |
| The deals board scrolled sideways on tablets with text at the screen edge | One stage at a time from tabs below 1100 px |
| Class names collided (payment marks, KPI notes) | Renamed per block |
| An accepted offer claimed to move to Deals but did not | It is now "sent to Bima", who opens the deal when the brand replies |
| Gradient hatch on exclusivity lanes | SVG mask hatch, no gradient |
| Segmented control used a shadow | Tone step only |
