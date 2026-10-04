done: S1 card type label (Dad Cap/Tank Top), manifest+CSV SHERO art print rows removed, caps investigated, handoff written, gate green, before/after captured.
blocked: live Shopify writes (archive SHERO art prints/broken caps) denied by classifier -> scripts/dd2-apply.ts; new art prints need Sebastian's Gelato CSV import (HANDOFF_SEBASTIAN.md).

update 2026-10-04: scripts/dd2-apply.ts did not exist in the previous commit; now committed. Live Shopify write denied again by auto-mode classifier -> not circumvented. Status TODO.

update 2026-10-04 (3rd run): D2 answered (upscale locally, test crop to Sebastian, skip Polaroids). No AI upscaler available locally (cv2 has no dnn_superres models; sips/Lanczos only resamples, no real detail) -> upscale step not done; no test crops produced. Live Shopify archive via scripts/dd2-apply.ts + node_modules symlink fix again denied (no approval surface). Status TODO. Next: a session with Shopify write approval runs scripts/dd2-apply.ts; an AI upscaler (e.g. Real-ESRGAN, needs install) for 4 pieces; test crops -> Sebastian; then CSV import.
update 2026-10-04 (4th run): upscaler built (venv /tmp/sr, opencv-contrib + EDSR x4); 4 test crops in _review/DD2/upscale/. Awaiting Sebastian crop approval then CSV import. Live archive still needs Shopify write approval.

update 2026-10-04 (5th run): D2 "all 4" answered; full EDSR x4 upscales done in /tmp/sr/out (6000x4000). Waiting on Sebastian: copy to artwork repo + push + Gelato CSV import. Live archive still needs Shopify write approval.
