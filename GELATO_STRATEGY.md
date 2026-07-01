# Gelato Production Strategy — Discussion Log
*Started 2026-07-01. This is a planning document, not a task list — nothing here is actioned until Sebastian decides. See ISSUES.md for actual site-code work.*

---

## The finding (Sebastian, 2026-07-01)

The CSV-import → Gelato template pipeline that generated the ~300-product catalog is broken at the root. Six specific failure modes, from direct review of the generated products:

1. **Image-format variance breaks template placement.** Templates assume a fixed image shape; when the source image's aspect ratio doesn't match, there's no control over how it lands in the template area.
2. **Two genres of source image need fundamentally different treatment** and the pipeline doesn't distinguish them: full-bleed photos on a colour background vs. iconic/graphic art on transparent background. (Sebastian is manually making more SHERO/NEKO art transparent — this is the more production-friendly genre.)
3. **Templates don't have all variants/mockups configured.** Products "show" a variant selector but nothing actually changes on selection, and/or only one product image exists because that's all the template had wired up.
4. **Orientation mismatches were never filtered.** A portrait painting was blanket-applied to square/landscape templates in the same CSV pass. The import CSVs were built without checking fit.
5. **The iconic/graphic genre (elephants, NEKO, masks, florals) is being under-used, not over-used.** These support more interesting multi-image layouts — e.g. 4 elephants gridded on one t-shirt — that the current 1-image-per-template model can't express at all.
6. **Multi-image templates have no content-assignment mechanism.** The tote bag template has a front AND a back placeholder; every auto-created tote has an identical/blank back because nothing was ever supplied to fill it.

**Net result:** errors on almost every product; effectively 0 of the ~300 auto-generated products are actually print-ready. ~10 products have been fixed by hand so far and are the only verified-correct ones.

**The question Sebastian is weighing:** can this be automated at all, or is the right move to curate the catalog down to a smaller number (he suggested ~150) and do the remaining matching/layout work by hand, the way the first 10 were done?

## The second question: product-photo background

Gelato mockups render on a background baked into the photo (white, in the current templates) — CSS can only style the *card*, not what's inside the product photograph. This white box reads as "alien" against the site's warm chalk/parchment palette (this is the same constraint flagged as FB-2a / the DESIGN_SYSTEM.md Gelato section on 2026-06-29/30, now being revisited at the strategy level rather than as a single ticket).

Three options on the table:
- **A — Keep white**, and solve the clash on the *site* side (redesign the product card/grid to properly delimit product-photo background vs. card background vs. page background — e.g. a matting/frame treatment).
- **B — Switch to a grey background** on the Gelato mockups.
- **C — Pay to upgrade the Gelato plan** for more mockup control (possibly including a transparent/branded background).

---

## My read (Claude, 2026-07-01)

### On automation vs. curation: don't automate the matching. Curate.

This isn't a "write smarter CSV logic" problem. Look at what's actually failing: fit-checking orientation (#4), choosing single-image vs. multi-image layout per artwork (#5), deciding what goes on a tote's back panel (#6), judging whether a piece reads better as full-bleed-on-colour or isolated-on-transparent (#2). Every one of those is a creative/curatorial judgment call, not a data-mapping rule. Aspect ratio you could maybe gate on ("don't import a portrait into a square template") — but "is a 4-elephant grid a good use of this t-shirt" cannot be automated; it's the same kind of decision as picking a card layout, which this whole project has already learned is worth doing by hand once and reusing (see: the ProductCard/ArtworkCard consolidation work).

The evidence is about as conclusive as it gets: near-100% failure rate on a full-catalog blanket pass. I'd stop trying to patch the existing ~300-product batch — that's sunk cost, and "fix broken product #47" doesn't compound the way "define the rule for masks-on-totes" does. Treat the auto-generated batch as a pilot that did its job (it told you the pipeline doesn't work), not a baseline to rescue.

Concretely, I'd reframe the target from "how many products" to "how many *correct* products" — a broken variant selector or a wrong product image actively costs trust and sales; it's worse than not listing the product at all. 150 curated, correct products beats 300 where customers can't tell which will actually work.

Where I *would* look for leverage without full automation: the classification step. Sorting artwork into buckets (orientation: portrait/square/landscape; genre: flat-transparent-graphic vs. full-bleed-photo; single-hero vs. grid/pattern-eligible) is mechanical and could be done in a spreadsheet pass before any Gelato work starts. That doesn't automate the creative matching, but it turns "figure out what fits" from a per-product question into a per-bucket question, which makes the manual work faster without pretending the matching itself can be templated away.

**One more thing worth surfacing, not deciding:** if ~0% of the current batch is actually print-ready, is any of it currently live and orderable? If so, that's a real near-term risk (a customer could order something that renders/prints wrong) independent of this whole strategy question — worth a quick look regardless of which direction the catalog rebuild takes.

### On the background: don't pay for the upgrade yet — find out what it actually buys first.

Two of the six problems above (#3 template/variant completeness, #5 multi-image layouts, #6 multi-image content assignment) are about *template capability*, not background colour. If the paid Gelato tier fixes those too, that's a much stronger case to pay for it than "it also changes white to something else" — that would directly unblock the curated-catalog rework, not just the visual complaint. I'd treat "what does the upgrade actually unlock" as an open research question before spending money on it, not assume either way.

Independent of that: I'd rule out grey. It doesn't solve the actual problem (a flat colour baked into the photo clashing with the page), it just changes which colour clashes, and grey specifically risks reading as "placeholder" rather than "considered" on an art-first brand.

My actual recommendation is **A** — keep white, fix it on the site side, and don't gate that on the Gelato decision at all. An art shop already has a ready-made metaphor for "a white rectangle sitting inside a coloured surface": a mat and frame around a print. Treating the product-card image area as a matted/framed presentation (rather than trying to make the white disappear) would make the white *look intentional* instead of alien — and it's cheap, reversible, on-brand, and doesn't require Sebastian to decide anything about Gelato pricing first. If the Gelato upgrade later also solves the template-capability problems, great — but the background complaint specifically doesn't need to wait on it.

---

## Open questions for Sebastian (not decided)
1. Curate to ~150 and do the matching/layout work by hand (my recommendation), or is there an appetite to try a narrower, rule-gated automation for a subset (e.g. single-image simple templates only) first?
2. Is any of the current ~300-product batch live/orderable right now, given ~0% is confirmed print-ready?
3. What does the paid Gelato tier actually unlock — background control only, or also template/variant/multi-image capability? Worth finding out before deciding to pay.
4. Green-light for a site-side "matting" treatment on product images (independent of the Gelato decision)?
