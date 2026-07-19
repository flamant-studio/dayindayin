import Link from 'next/link'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'link'

interface BaseProps {
  variant?: Variant
  /** Full-width block button */
  full?: boolean
  /** Append a trailing → arrow (typical for link variant) */
  arrow?: boolean
  className?: string
  children: React.ReactNode
}

type ButtonAsLink = BaseProps & {
  href: string
  onClick?: never
  type?: never
  disabled?: never
}

type ButtonAsButton = BaseProps & {
  href?: never
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}

type Props = ButtonAsLink | ButtonAsButton

/**
 * The one button. Three variants — primary (vermillion CTA), secondary
 * (outlined), link (inline text link). Renders an <a> when given href,
 * otherwise a <button>. See DESIGN_SYSTEM.md › Buttons.
 */
export default function Button({
  variant = 'primary',
  full = false,
  arrow = false,
  className = '',
  children,
  ...rest
}: Props) {
  const cls = [
    styles.btn,
    styles[variant],
    full ? styles.full : '',
    className,
  ].filter(Boolean).join(' ')

  const content = (
    <>
      {children}
      {arrow && <span className={styles.arrow} aria-hidden="true">→</span>}
    </>
  )

  if ('href' in rest && rest.href !== undefined) {
    return (
      <Link href={rest.href} className={cls}>
        {content}
      </Link>
    )
  }

  const { onClick, type = 'button', disabled } = rest as ButtonAsButton
  return (
    <button className={cls} onClick={onClick} type={type} disabled={disabled}>
      {content}
    </button>
  )
}
