import { Compass } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { EmptyState } from '@/components/ui/EmptyState'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
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
