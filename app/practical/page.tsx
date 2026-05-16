import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Practical — Day In Day In",
  description: "Shipping, returns, commissions, and copyright for DayInDayIn. All prints fulfilled by Gelato.",
};

export default function Practical() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>Practical</h1>
      </section>
      <div className={styles.content}>

        <section>
          <h2>Fulfillment — Gelato Print on Demand</h2>
          <p>
            All prints, canvases, mugs, and totes in this shop are printed on demand by{" "}
            <a href="https://www.gelato.com" target="_blank" rel="noopener noreferrer">Gelato</a>,
            a print fulfillment network with production partners across Europe.
          </p>
          <p>
            This means nothing sits in a warehouse. Each order triggers production at the
            Gelato facility closest to you. The upside: no overproduction, no waste, and
            fast local delivery. The downside: no same-day shipping.
          </p>
          <p>
            We&apos;re upfront about this because it matters for how you shop. If you&apos;re
            buying a gift, order a few days ahead. If you need it tomorrow, this isn&apos;t
            the right shop.
          </p>
        </section>

        <section>
          <h2>Shipping &amp; Delivery</h2>
          <p>
            <strong>Production time:</strong> 1–3 business days after your order is placed.
          </p>
          <p>
            <strong>Shipping time:</strong> 2–5 business days after production, depending on
            your location within the EU / UK / Norway.
          </p>
          <p>
            <strong>Total time from order to door:</strong> approximately 3–7 business days.
          </p>
          <p>
            We currently ship to EU member states, the United Kingdom, and Norway.
          </p>
          <p>
            <strong>Within the EU:</strong> no customs fees or import duties.
          </p>
          <p>
            <strong>UK and Norway:</strong> your order may be subject to customs duties or
            import VAT depending on order value and local rules. These fees are the
            responsibility of the buyer. We cannot estimate them in advance — please check
            your country&apos;s import thresholds before ordering.
          </p>
        </section>

        <section>
          <h2>Returns &amp; Damaged Orders</h2>
          <p>
            Because all products are printed on demand specifically for your order, we do
            not accept returns or exchanges on change-of-mind purchases. This is standard
            for print-on-demand products.
          </p>
          <p>
            If your order arrives damaged, defective, or with a production error, we will
            replace it at no cost to you. Email us within 14 days of delivery with:
          </p>
          <ul>
            <li>Your order number</li>
            <li>A photo of the damage or defect</li>
            <li>A brief description of the issue</li>
          </ul>
          <p>
            Email:{" "}
            <a href="mailto:sebastianhflamant@gmail.com">sebastianhflamant@gmail.com</a>
          </p>
          <p>
            We will respond within 48 hours (usually sooner) and arrange a replacement.
          </p>
        </section>

        <section>
          <h2>Commissions</h2>
          <p>
            Stine does take commissions, but selectively and on her own terms. She works with
            embroidery, tufting, and painting. If you have something specific in mind — a
            portrait, a piece for a particular space, a collaboration — reach out and explain
            what you are thinking.
          </p>
          <p>
            Be specific. Stine responds well to directness. Tell her the size, the context,
            and your budget. If it&apos;s not something she wants to make right now, she will say so.
          </p>
          <p>
            Commission lead times are typically 4–10 weeks depending on complexity and
            Stine&apos;s current workload.
          </p>
          <p>
            Contact via the{" "}
            <Link href="/#contact">contact form on the homepage</Link> or email{" "}
            <a href="mailto:sebastianhflamant@gmail.com">sebastianhflamant@gmail.com</a>.
          </p>
        </section>

        <section>
          <h2>Copyright</h2>
          <p>
            All artwork is copyright &copy; Stine Weirsøe Flamant. Purchasing a print gives
            you a physical product for personal use — it does not transfer any reproduction
            rights.
          </p>
          <p>
            Full details: <Link href="/legal/copyright">Copyright policy</Link>
          </p>
          <p>
            For licensing inquiries:{" "}
            <a href="mailto:sebastianhflamant@gmail.com">sebastianhflamant@gmail.com</a>
          </p>
        </section>

        <section>
          <h2>Privacy</h2>
          <p>
            We collect only what we need to fulfill your order. We do not run advertising
            trackers. We do not sell your data.
          </p>
          <p>
            Full details: <Link href="/legal/privacy">Privacy policy</Link>
          </p>
        </section>

      </div>
    </div>
  );
}
