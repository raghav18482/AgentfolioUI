import { Alert } from '@/components/ui/Alert'

/** The disclaimer every Academy page carries. */
export function EducationNotice({ className }: { className?: string }) {
  return (
    <Alert variant="info" className={className}>
      General financial education, not personalised investment, tax or legal advice. Figures are illustrative
      assumptions, not forecasts or recommendations. For advice on your own situation, consult a SEBI-registered
      investment adviser.
    </Alert>
  )
}
