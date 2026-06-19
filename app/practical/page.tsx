import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Shipping & FAQ",
  description: "Shipping, returns, commissions, and copyright for DayInDayIn. All prints fulfilled by Gelato.",
};

const FAQ_ITEMS = [
  {
    q: "How long does delivery take?",
    a: "Production takes 1–3 business days. Shipping adds 2–5 business days across EU/UK/Norway. Total: approximately 3–7 business days from order to door.",
  },
  {
    q: "Where do you ship?",
    a: "We ship to all EU member states, the United Kingdom, and Norway. Within the EU there are no customs fees. UK and Norway orders may be subject to import duties — these are the buyer's responsibility.",
  },
  {
    q: "Can I return or exchange a print?",
    a: "Because prints are made to order, we don't accept returns on change-of-mind purchases. If your order arrives damaged or defective, email us within 14 days with your order number and a photo — we'll replace it at no cost.",
  },
  {
    q: "Who prints and ships the orders?",
    a: "All prints, mugs, totes, and apparel are printed on demand by Gelato — a European print network. Production happens at the Gelato facility closest to you. Nothing sits in a warehouse.",
  },
  {
    q: "Will I get a tracking number?",
    a: "Yes. You'll receive a Shopify order confirmation immediately, and a separate shipping confirmation with a tracking link when production is complete. If you haven't received a shipping email within 4 business days, contact us with your order number.",
  },
  {
    q: "What are the print sizes and prices?",
    a: "Art prints start from 56 kr (A4). Framed prints from 249 kr. Posters (semi-glossy) from 89 kr. Mugs from 89 kr. Tote bags from 119 kr. Postcards (pack of 10) from 79 kr. Tank tops from 189 kr. All prices include Danish VAT.",
  },
  {
    q: "Can I commission an original work?",
    a: "Yes — Stine takes commissions selectively. Embroidery, tufting, painting. Lead time is typically 4–10 weeks. See the Commissions page for details.",
  },
  {
    q: "Can I use the artwork commercially?",
    a: "Purchasing a print gives you a physical product for personal use. It does not transfer reproduction rights. For editorial, interior, or product design licensing, email stine@dayindayin.dk with what you have in mind.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function Practical() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className={styles.page}>
        <section className={styles.hero}>
          <h1>Shipping &amp; FAQ</h1>
        </section>

        <nav className={styles.pageNav} aria-label="Page sections">
          {[
            { href: "#prices", label: "Prices" },
            { href: "#shipping", label: "Shipping" },
            { href: "#returns", label: "Returns" },
            { href: "#commissions", label: "Commissions" },
            { href: "#faq", label: "FAQ" },
            { href: "#legal", label: "Legal" },
          ].map(({ href, label }) => (
            <a key={href} href={href} className={styles.pageNavLink}>{label}</a>
          ))}
        </nav>

        <div className={styles.content}>

          <section id="prices">
            <h2>Prices</h2>
            <p>
              All prices are in Danish Krone (DKK) and include VAT. Gelato print-on-demand
              pricing reflects production cost plus a margin that supports Stine&apos;s practice.
            </p>
            <table className={styles.priceTable}>
              <tbody>
                {[
                  ["Art prints (A4/A3/A2)", "from 56 kr"],
                  ["Framed prints", "from 249 kr"],
                  ["Posters (semi-glossy, A3/A2/A1)", "from 89 kr"],
                  ["Mugs", "from 89 kr"],
                  ["Tote bags", "from 119 kr"],
                  ["Postcards (pack of 10)", "from 79 kr"],
                  ["Tank tops", "from 189 kr"],
                ].map(([label, price]) => (
                  <tr key={label} className={styles.priceRow}>
                    <td className={styles.priceLabel}>{label}</td>
                    <td className={styles.priceValue}>{price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              For original fine art — tufted works, embroidery, paintings — pricing is by
              enquiry. <Link href="/fine-art">See the originals →</Link>
            </p>
          </section>

          <section id="shipping">
            <h2>Fulfillment &amp; Shipping</h2>
            <p>
              All prints, canvases, mugs, and totes in this shop are printed on demand by{" "}
              <a href="https://www.gelato.com" target="_blank" rel="noopener noreferrer">Gelato</a>,
              a print fulfillment network with production partners across Europe.
            </p>
            <p>
              This means nothing sits in a warehouse. Each order triggers production at the
              Gelato facility closest to you — no overproduction, no waste, fast local delivery.
            </p>
            <p>
              <strong>Production time:</strong> 1–3 business days after your order is placed.<br />
              <strong>Shipping time:</strong> 2–5 business days after production.<br />
              <strong>Total:</strong> approximately 3–7 business days.
            </p>
            <p>
              We ship to EU member states, the United Kingdom, and Norway. Within the EU: no customs
              fees. UK and Norway: may be subject to import duties — the buyer&apos;s responsibility.
            </p>
          </section>

          <section id="returns">
            <h2>Order Tracking &amp; Returns</h2>
            <p>
              After your order is confirmed, you&apos;ll receive a Shopify order confirmation email.
              When production is complete, a separate shipping email arrives with a tracking link.
            </p>
            <p>
              If you haven&apos;t received a shipping email within 4 business days, contact us with your
              order number and we&apos;ll check the status.
            </p>
            <p>
              Because products are printed on demand specifically for your order, we do not accept
              returns on change-of-mind purchases. If your order arrives damaged or defective, email
              us within 14 days with your order number and a photo of the issue — we will replace it
              at no cost.
            </p>
            <p>Email: <a href="mailto:stine@dayindayin.dk">stine@dayindayin.dk</a></p>
          </section>

          <section id="commissions">
            <h2>Commissions</h2>
            <p>
              Stine does take commissions — selectively and on her own terms. Embroidery, tufting,
              and painting. If you have something specific in mind, reach out and explain what you
              are thinking. Be direct: size, context, budget.
            </p>
            <p>
              Commission lead times are typically 4–10 weeks depending on complexity.
            </p>
            <p>
              <Link href="/commissions">See the full commissions page →</Link>
            </p>
          </section>

          <section id="faq">
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {FAQ_ITEMS.map((item) => (
                <details key={item.q} className={styles.faqItem}>
                  <summary>{item.q}</summary>
                  <div className={styles.faqBody}>
                    <p>{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section id="legal">
            <h2>Copyright &amp; Privacy</h2>
            <p>
              All artwork is copyright &copy; Stine Weirsøe Flamant. Purchasing a print gives
              you a physical product for personal use — it does not transfer any reproduction rights.
            </p>
            <p>
              Full details: <Link href="/legal/copyright">Copyright policy</Link>
            </p>
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
    </>
  );
}
