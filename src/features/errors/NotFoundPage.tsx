import { Compass } from 'lucide-react'
import { PageMeta } from '@/components/layout/PageMeta'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { EmptyState } from '@/components/ui/EmptyState'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <PageMeta title="Page not found" noindex />
      <EmptyState
        icon={Compass}
        title="This page doesn't exist"
        hint="The link may be out of date, or the address mistyped."
        action={
          <ButtonLink to="/" size="sm" variant="secondary" className="mt-2">
            Go home
          </ButtonLink>
        }
      />
    </div>
  )
}
