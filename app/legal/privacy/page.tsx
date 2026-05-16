import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Day In Day In',
  description: 'How DayInDayIn collects, uses, and protects your personal data. GDPR-compliant.',
}

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="updated">Last updated: May 2026</p>

      <h2>Who we are</h2>
      <p>
        Day In Day In is operated by Flamant Tekst &amp; Design, CVR registered in Denmark.
        Contact: <a href="mailto:sebastianhflamant@gmail.com">sebastianhflamant@gmail.com</a>.
      </p>
      <p>
        This site is the online shop for artwork by Stine Weirsøe Flamant. We take your
        privacy seriously. This policy explains what data we collect, why, and what rights
        you have.
      </p>

      <h2>What data we collect</h2>
      <p>When you place an order, we collect:</p>
      <ul>
        <li>Name</li>
        <li>Email address</li>
        <li>Delivery address</li>
        <li>Order details (products, price, quantity)</li>
        <li>Payment status (we do not store card numbers — payments processed by Shopify)</li>
      </ul>
      <p>When you use the contact form, we collect your name and email address.</p>
      <p>
        We do not run advertising trackers. We do not sell your data. We do not use your
        data for anything other than fulfilling your order and communicating with you about it.
      </p>

      <h2>Legal basis</h2>
      <p>
        We process your data on the basis of contract performance (Article 6(1)(b) GDPR) —
        specifically, to fulfill your order. Contact form data is processed on the basis of
        legitimate interest (responding to your inquiry).
      </p>

      <h2>Who processes your data</h2>
      <p>Your data is shared with:</p>
      <ul>
        <li>
          <strong>Shopify Inc.</strong> — our e-commerce platform and payment processor.
          Shopify is a data processor acting on our instructions. Shopify is certified under
          the EU-U.S. Data Privacy Framework. See{' '}
          <a href="https://www.shopify.com/legal/privacy" target="_blank" rel="noopener noreferrer">
            Shopify&apos;s privacy policy
          </a>.
        </li>
        <li>
          <strong>Gelato AS</strong> — our print and fulfillment partner. Gelato receives your
          name and shipping address to print and ship your order. Gelato processes data in
          accordance with GDPR. See{' '}
          <a href="https://www.gelato.com/privacy-policy" target="_blank" rel="noopener noreferrer">
            Gelato&apos;s privacy policy
          </a>.
        </li>
        <li>
          <strong>Vercel Inc.</strong> — our hosting provider. Site infrastructure only; Vercel
          does not process order data.
        </li>
        <li>
          <strong>Resend Inc.</strong> — email delivery for contact form responses. Your name and
          email are used to send you a reply.
        </li>
      </ul>

      <h2>How long we keep your data</h2>
      <p>
        Order data is retained for 5 years from the order date, in accordance with Danish
        accounting law (bogføringsloven). Contact form data is kept for up to 12 months.
      </p>

      <h2>Your rights</h2>
      <p>Under GDPR, you have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion of your data (right to erasure)</li>
        <li>Object to processing</li>
        <li>Data portability</li>
      </ul>
      <p>
        To exercise any of these rights, contact us at{' '}
        <a href="mailto:sebastianhflamant@gmail.com">sebastianhflamant@gmail.com</a>.
        We will respond within 30 days.
      </p>
      <p>
        If you believe your rights have been violated, you can lodge a complaint with
        Datatilsynet, the Danish supervisory authority:{' '}
        <a href="https://www.datatilsynet.dk" target="_blank" rel="noopener noreferrer">
          datatilsynet.dk
        </a>.
      </p>

      <h2>Cookies</h2>
      <p>
        This site uses only technically necessary cookies (session management via Shopify).
        We do not use advertising cookies or analytics trackers.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy when our data practices change. The date at the top of this
        page shows when it was last updated.
      </p>
    </>
  )
}
