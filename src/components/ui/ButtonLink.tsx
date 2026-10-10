import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { buttonClasses, type ButtonSize, type ButtonVariant } from './buttonStyles'

type ButtonLinkProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
} & ({ to: string; href?: never } | { href: string; to?: never })

/**
 * A link that looks like a button. `to` routes inside the app; `href` leaves it
 * and opens in a new tab.
 */
export function ButtonLink({ variant, size, className, children, ...target }: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className)
  if (target.to !== undefined) {
    return (
      <Link to={target.to} className={classes}>
        {children}
      </Link>
    )
  }
  return (
    <a href={target.href} target="_blank" rel="noopener noreferrer" className={classes}>
      {children}
    </a>
  )
}
