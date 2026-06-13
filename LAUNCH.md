# DayInDayIn — Launch Checklist
*The definition of launch-ready. Sebastian's bar, not Claude's. DNS (dayindayin.dk) is the launch button — it gets pressed when every gate below is green, and not before.*
*Honest status 2026-06-12: roughly 40% done. A working-looking homepage is not a working store.*

**Standing instruction for all night runs:** the goal is always "advance the earliest non-green gate." Do not polish Gate 4 while Gate 1 is red.

---

## Gate 1 — A tested product set 🔴

Not "products exist in Gelato" — a *curated, verified* set.

- [ ] Every product visually verified: creative asset matches template (orientation, crop, bleed, placement). Known offenders: asset/template mismatches across several types
- [ ] Wrong-looking products fixed or **culled** — a smaller correct catalog beats a large broken one
- [ ] All Gelato→Shopify syncs complete; zero products in limbo
- [ ] Mockup images present and correct for every live product
- [ ] Per product type (poster/framed/mug/tote/tank/postcard): one item checked by Sebastian end-to-end, per the canary rule
- [ ] **Physical samples ordered and held in hand** — at least one per product type. You cannot sell prints you've never seen. (This is also the first real E2E purchase — Gate 4 overlaps)

## Gate 2 — On-site rendering 🔴

- [ ] Product images render correctly on PLP and PDP (no stretching, wrong ratios, missing images)
- [ ] Variant pickers correct and comprehensible for every product type (mug 2D picker approved; apparel sizes; poster size labels)
- [ ] Prices correct per variant and currency (DKK/EUR/GBP)
- [ ] Blob-served images migrated off Vercel Blob (quota already breached twice — brand visuals must not be able to go dark)

## Gate 3 — UX stress-test 🔴

- [ ] Full journey walked on mobile AND desktop: land → browse → filter → product → cart → checkout entry. Every step screenshotted, every issue logged
- [ ] The known "MULTIPLE UX and design issues" list written down (Sebastian braindump + agent crawl), triaged, fixed or consciously deferred
- [ ] Empty states, error states, slow-network behavior checked
- [ ] Copy pass by Sebastian — tone is Stine's brand, not template English

## Gate 4 — End-to-end purchase 🔴

- [ ] At least one REAL order placed by Sebastian (small item), paid, confirmed, fulfilled by Gelato, delivered, quality-checked
- [ ] Order confirmation email arrives and reads right
- [ ] Shopify Payments KYC complete (kills the 2% surcharge)
- [ ] Refund/cancel flow understood (documented, even if manual)

## Gate 5 — Legal & operational minimum 🟡

- [ ] Privacy policy, copyright, terms/fulfillment pages live (EU consumer requirement)
- [ ] Contact email points somewhere real (Stine's or flamant.dk address)
- [ ] Newsletter signup actually subscribes (Klaviyo/Mailchimp free tier) — or the block is removed
- [ ] Shipping/FAQ page accurate for actual Gelato shipping zones and times

## Gate 6 — Launch 🔴 (locked until 1–5 green)

- [ ] Sebastian's gut check: "I would send this to a friend without apologizing"
- [ ] dayindayin.dk DNS pointed at Vercel
- [ ] OG images/meta verified against the real domain
- [ ] First soft announcement (Stine's channels)

---

*Maintenance: night runs update checkboxes with proof links. Sebastian is the only one who may mark Gate 6 items. This file supersedes any agent's own notion of "launch-ready."*
