import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Copyright — Day In Day In',
  description: 'Copyright notice for all artwork on DayInDayIn. All works by Stine Weirsøe Flamant.',
}

export default function CopyrightPage() {
  return (
    <>
      <h1>Copyright</h1>
      <p className="updated">Last updated: May 2026</p>

      <h2>All artwork by Stine Weirsøe Flamant</h2>
      <p>
        All artwork, photographs, patterns, illustrations, and designs on this website are
        copyright &copy; Stine Weirsøe Flamant, all rights reserved, unless otherwise stated.
      </p>
      <p>
        This includes but is not limited to: tufted textile works, embroidery pieces,
        paintings, drawings, digital illustrations, photography, and pattern designs.
      </p>

      <h2>What you can do</h2>
      <p>
        When you purchase a print from this shop, you receive a physical product for personal
        use. This is a limited personal use license. It means you can:
      </p>
      <ul>
        <li>Display the print in your home, office, or personal space</li>
        <li>Gift the physical print to someone else</li>
        <li>Share a photo of the print on personal (non-commercial) social media, with credit</li>
      </ul>

      <h2>What you cannot do</h2>
      <ul>
        <li>Reproduce, scan, or copy the artwork in any form</li>
        <li>Print additional copies of purchased designs</li>
        <li>Use artwork for commercial purposes, merchandise, or marketing</li>
        <li>Sell or sublicense the design</li>
        <li>Claim ownership of any artwork</li>
        <li>Use artwork in AI training datasets</li>
      </ul>

      <h2>Licensing and commercial use</h2>
      <p>
        If you are interested in licensing artwork for commercial use — including editorial,
        advertising, product design, or interior projects — contact us to discuss terms.
      </p>
      <p>
        Email: <a href="mailto:sebastianhflamant@gmail.com">sebastianhflamant@gmail.com</a>
      </p>
      <p>
        Please include what you are planning to use the artwork for, the specific work or works
        you are interested in, and the territory and duration of use. We will respond and discuss
        fair terms.
      </p>

      <h2>Photography on this site</h2>
      <p>
        All photography on this website, including studio photos and documentation of artworks,
        is also copyright &copy; Stine Weirsøe Flamant or the credited photographer where stated.
        No reproduction without permission.
      </p>

      <h2>Reporting infringement</h2>
      <p>
        If you believe any of Stine&apos;s work has been reproduced without permission, please
        let us know at{' '}
        <a href="mailto:sebastianhflamant@gmail.com">sebastianhflamant@gmail.com</a>.
      </p>
    </>
  )
}
