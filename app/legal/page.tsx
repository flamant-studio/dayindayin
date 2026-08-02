import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Legal',
  description: 'Privacy policy and copyright information for Day In Day In.',
  robots: { index: false, follow: false },
}

export default function LegalPage() {
  return (
    <>
      <h1>Legal</h1>
      <p>Day In Day In is operated by Flamant Tekst &amp; Design, CVR registered in Denmark.</p>
      <ul>
        <li><Link href="/legal/privacy">Privacy Policy</Link> — How we collect, use, and protect your data.</li>
        <li><Link href="/legal/copyright">Copyright</Link> — All artwork on this site is the original work of Stine Weirsøe Flamant.</li>
      </ul>
      <p>For any legal enquiries, contact <a href="mailto:hello@dayindayin.dk">hello@dayindayin.dk</a>.</p>
    </>
  )
}
