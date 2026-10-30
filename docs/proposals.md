# Dribbble proposals

Ready to paste. Rules from AGENTS.md section 8 apply: no contact details, no payment brand names,
no obfuscated links. If Dribbble flags a link, post the work as a shot and point to it instead.
The owner's portfolio is linked in every proposal.

## project11, Flock & Flame (chicken and grill menu app)

Hi! Here is how I would approach your chicken and grill app, and a working prototype so you can see the thinking in practice.

**1. Menu first, fast to order.** Four clear tabs as you asked: Fried chicken, Grilled chicken, Mayo dishes and Grill specials. Big food photos, prices visible on every card, and quick add for the dishes people already know. The dish page handles heat level, dips and sides in one screen, so customizing never feels like a form.

**2. Delivery and pickup the way customers already know them.** I studied how large chains handle this (McDonald's, Chick-fil-A, Domino's, Uber Eats) and kept what works for a single-brand shop:
- Choose delivery or pickup first, because that decides the kitchen, the fee and the time. Addresses outside the delivery area are offered pickup instead of failing at checkout
- Pickup from the shelf or curbside, with "start cooking when I arrive" so the food comes out hot
- A real checkout: card charged only when the shop accepts, or cash with change, rider tip, minimum order, scheduled times
- Tracking in four simple steps (confirmed, in the kitchen, on the way, delivered) with the rider's name and a hand-off code
- What happens when things go wrong: a dish runs out (swap, remove or cancel before anything is charged), the rider is late, or something is missing after delivery

**3. Offline that is honest.** No app can send an order to a kitchen without a connection, so I don't pretend it can. With no signal, customers can still browse the saved menu, build their bag and check out. The order waits on the phone, clearly marked as not sent yet. When the signal comes back, it checks prices and stock again and asks the customer before sending if anything changed. Every retry uses the same order key, so a weak signal can never create a duplicate order.

**4. Easy updates for you.** A simple menu manager: change prices, mark a dish sold out or set today's special as a draft, then publish one new menu version to every phone. No developer needed for daily changes.

Prototype: https://proposal-virid-eight.vercel.app/project11/
Password: ck-7rmz-q4hp
(Best on a phone. On desktop it opens in a phone frame with a panel where you can switch the network to weak or no signal and trigger problems like a sold-out dish or a late rider.)

My portfolio: createdybdaniel.com

To be upfront: this is an early exploration made in limited time, so not every detail is polished yet, and the food photos are licensed placeholders until we use photos of your own dishes. If the direction feels right, I'll refine it with your real menu, prices and brand, then prepare clean screens and design files for development.

## project12, Golden Stone Logistics (China and Ghana freight website)

Hi! I built a working prototype of the website so you can see and click through the direction, not only read about it.

Link: https://proposal-virid-eight.vercel.app/project12/
Password: gs-k2vx-9dnb
My portfolio: createdybdaniel.com

What's in it:
- A clear first screen that says what you ship, between which cities, and the next consolidation cut-off, calculated live so it never shows an old date
- Services you can explore: sea freight, air freight, consolidation and cargo collection from your suppliers, with customs clearance in Ghana
- A globe that shows the route from Guangzhou, Yiwu and Shenzhen to Tema, Accra and Kumasi
- A quote calculator that shows how the price is built, not just a total (sample rates for now)
- A tracking demo (try GSL-24817) and offices in both countries with their local times
- A full English and Chinese switch, as planned for the future version
- WhatsApp and customer accounts are shown as "Coming soon", so the layout is ready for them

On the visual side I used your palette of deep green, gold and warm neutral with a modern, minimal type style, so it feels premium and trustworthy. The kente and Chinese geometric details stay as small, respectful accents. Before designing I looked at how freight forwarders on this route present prices, cut-off dates and tracking, because those are the first questions traders ask.

To be upfront: this is an early exploration made in limited time, so some parts are not fully polished. Rates, company details and photos are placeholders for your real information, and the Chinese copy should be checked by a native speaker. I made it to show I'm serious about the project and to give us a concrete starting point.

If you like the direction, I can refine it with your real details and photos and prepare it for development. Let me know what you'd like to change.

## selvedge, Retail Management ERP (ORVUM brief)

Hi! Your brief describes the hardest kind of product to get right: an AI operating system that should feel like the best consumer apps, for people who use it at three very different altitudes. Here is how I approach it, and a case you can click through.

**1. Start from the three tests in your brief.** A new employee learns it with minimal training, a store manager sees what matters immediately, and an owner understands the whole company from one interface. I design one home per person, built on the same data at different altitudes, so the owner, the manager and the advisor never see different truths.

**2. Make the AI earn trust, not just answer.** The patterns I rely on, drawn from Microsoft's human-AI guidelines, Google PAIR and how retail AI tools handle evidence and approval:
- Every AI statement shows where its numbers come from
- Confidence in plain words, only where it changes a decision
- Every proposal has the same shape: what, why, expected effect with a range, what could go wrong, then approve, edit or decline with a reason
- Autonomy set per type of decision (suggest, ask first, or act within a limit and tell), owned by people, logged, with undo
- The assistant starts from where you are, teaches with "show me" on the real screen, and never contacts a client on its own

**3. Respect luxury retail.** Clienteling, holds, transfers between boutiques, allocation of scarce pieces, protecting full-price sell-through. The AI ranks and explains; people decide what touches a client or the brand.

**4. A design system that scales to data-heavy screens.** Quiet chrome, one accent reserved for what the AI contributed, tabular figures, honest empty and error states, and components built for dense tables and decision queues.

Case: https://proposal-virid-eight.vercel.app/selvedge/
Password: sv-4rkx-msbd
Start with the case notes, then switch between the owner, the store manager and a new advisor. Parts of the case are redacted, and all data is synthetic.

My portfolio: createdybdaniel.com

I would love to see your existing design vision and help take it to a cohesive, world-class product.

## project13, Oppsett (Golf Exercise Gen)

Hi! I like this brief a lot: the setup is the part of coaching nobody sees, and you are right that it can be done from one photo. Here is how I would approach it, and a working prototype.

**The hard part is scale, not drawing.** A photo does not know how far 1.8 m is. So the app measures from things whose size is fixed: the cup is 108 mm, a ball 42.7 mm, a mat 1.5 m. If none of them is in the photo, it asks you to tap two points and say how far apart they are, instead of guessing quietly.

**The equipment is placed in metres, then drawn in perspective.** Each exercise keeps its own rules from your bank (for example: gate 30 cm in front of the ball, 2 cm wider than your putter). The AI applies those rules to the ground it found. Sticks lie flat on the grass, cones far away are smaller, and when you drag a marker it stays on the ground.

**It explains itself.** Every setup shows why each piece is where it is, marks what is only an estimate (like the slope) so you check it before the players arrive, and says when an exercise does not fit the area instead of bending the rule.

**Built for one coach now, more later.** Your data is stored under a club and a coach from day one, so more coaches or a subscription can be added without moving anything. Your exercises come from Øvelsesbanken, imported once in version 1 and kept in sync in version 2.

**Step by step, in plain words.** The prototype includes the build plan: eleven steps, each marked "You" or "Me", with exactly what to click, and a stop wherever you need to create an account or a key.

Prototype: https://proposal-virid-eight.vercel.app/project13/
Password: og-7q0a-vvo8
(Best on a phone. Try the putting green, then "What it saw", "Move" and "Other option". The AI step is simulated in the prototype; you can also upload your own photo and calibrate it with two taps.)

My portfolio: createdybdaniel.com

The sample photos are licensed stand-ins until we use photos of Oslo Golf Club. If this direction fits, the next step is your exercise list and one photo of each area.

## project14, Darb (Premium Arabic UI/UX for Saudi Logistics)

Hi! Here is how I would approach your website, with a working bilingual prototype so you can judge the Arabic and the right-to-left experience directly, not from screenshots.

**1. Arabic first, English as a true mirror.** The site is designed in Arabic and mirrored, not translated afterwards. One type family drawn for both scripts, so weights and heights match; taller Arabic line height; no letter-spacing on Arabic; arrows that flip with the reading direction while objects like trucks and clocks do not; Arabic numerals in Arabic text and Latin numerals in tracking and container numbers; Hijri dates beside Gregorian ones.

**2. Premium through restraint.** Your name set large as the opening image, real photography of ports, roads and the Kingdom's cities, one accent colour, square corners. In my prototype the brand is a placeholder; with your guidelines, logo and photos it becomes yours.

**3. Answer the questions importers actually ask.** Through which port, how many days, which documents. A route planner compares Jeddah, Dammam and Rabigh for any destination city; each service page lists what is included, the stages and their durations, and the documents needed (including SABER certificates and FASAH declarations).

**4. Every customer-facing page.** Home, services and six service pages, shipment tracking (on the road, held for a document, delivered, not found), a four-step quote request with validation, branch network, about, careers, guides, contact. Desktop and mobile layouts throughout.

**5. Ready for developers.** A handoff page in the prototype lists colours, type sizes, RTL rules, components and a direct link to every state. After award I deliver the Figma file built from the same tokens, with the interactive prototype and the handoff notes.

Prototype: https://proposal-virid-eight.vercel.app/project14/
Password: db-2mmw-55ap
(Switch between العربية and English at the top right. Try tracking numbers DRB-240117 and DRB-240233.)

My portfolio: createdybdaniel.com

To be upfront: this is an early exploration made in limited time. The company name, copy, addresses and photos are placeholders until I have your brand guidelines, content drafts and media.

## project15, Skill-to-Research Bridge

Hi! I designed and built a clickable version of the site so you can try the flows yourself.

**1. Readiness you can check.** Each project lists the skills it needs and how much each matters. A student's score is worked out from their evidence, and every point is shown next to the evidence that earned it. Verified records count in full, linked work less, a claim least. No black box for the student or the lab.

**2. Missing skills with a way to close them.** For each gap the student sees the shortest honest route (a reviewed task, a workshop, a record to upload) and how many points it adds on which projects.

**3. A Contribution Passport.** When a project ends, the researcher signs what the student did using the contributor roles journals already use. The student shares it by link with an expiry, chooses which sections show, sees who opened it, and can export it as PDF or JSON.

**4. A researcher dashboard built for fair decisions.** Applicants ranked by evidence with names hidden until shortlisting, the skill the pool is short on named, and contributions waiting for a signature.

**5. Accessible and keyboard friendly.** A typeface designed for low-vision readers, visible focus everywhere, shortcuts to move between screens, and dialogs that keep and return focus. Your palette as asked: warm off-white, deep navy, a bright lime used only for verified evidence and the main action.

Prototype: https://proposal-virid-eight.vercel.app/project15/
Password: br-5zo1-i3nv
(Landing page first; "Open the demo" goes to the student dashboard, and the sidebar switches to the researcher view.)

My portfolio: createdybdaniel.com

To be upfront: the university, labs, people and numbers are sample content made for the prototype. If the direction fits, I will adapt it to your content and prepare the final screens.

## project16, Myelin (AI Brain UI/UX for Web/Desktop/Mobile)

Hi! Before designing I researched how people experience AI cost and speed today, roasted the usual "AI brain" look, wrote a short PRD and a design plan, then built a clickable prototype across web, desktop and mobile so you can judge the direction by using it.

**1. The brain idea, made visible.** Each request takes one of three paths: Reflex (a learned habit, near zero cost), Recall (memory plus a small model) or Reason (a large model, only when needed). Every answer shows which path it took, how sure it was, what it cost and what it saved. No glowing brain, no neural network wallpaper.

**2. Savings you can check.** The "up to 80% cheaper" claim is shown against one stated baseline: the same work done entirely by the large model. The spend screen compares the two day by day, and a thinking budget (Frugal, Balanced, Thorough) sets how quickly it escalates.

**3. It learns, with a person in charge.** Repeated work is proposed as a habit with the evidence and the saving per run. Nothing becomes a habit until someone approves it, and every memory can be pinned, corrected or forgotten. A short night report shows what it merged, faded and wants to learn.

**4. One product, three surfaces with one job each.** Web for running and auditing the work, desktop as a quick ask over whatever app you are in, mobile for a morning glance, voice asks and approvals.

**5. Built the way you asked.** React with shadcn/ui components and Tailwind, a dark "data terminal" style with one amber accent, the day drawn as a three-lane trace that becomes the product's signature.

Prototype: https://proposal-virid-eight.vercel.app/project16/
Password: my-t6qe-8vzd
(The overview page comes first; "Open the workspace" goes to the web app. The left rail also opens the desktop and mobile versions.)

My portfolio: createdybdaniel.com

To be upfront: the name Myelin, the sample company and every number are placeholders made for the prototype, and the research, PRD and design plan are ready to share. If the direction fits, I will adapt it to your product, your model costs and your brand, and deliver the full hi-fi screens and interaction prototypes.
