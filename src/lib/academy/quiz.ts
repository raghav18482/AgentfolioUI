/** One answer per question: the chosen option's index, or `null` while unanswered. */
export type QuizAnswers = Array<number | null>

export interface QuizResult {
  score: number
  total: number
  /** Whether each question was answered correctly, in question order. */
  correct: boolean[]
}

export function emptyAnswers(questionCount: number): QuizAnswers {
  return Array.from({ length: questionCount }, () => null)
}

export function allAnswered(answers: QuizAnswers): boolean {
  return answers.length > 0 && answers.every((a) => a !== null)
}

export function scoreQuiz(questions: ReadonlyArray<{ correctIndex: number }>, answers: QuizAnswers): QuizResult {
  if (answers.length !== questions.length) {
    throw new Error(`Expected ${questions.length} answers, got ${answers.length}`)
  }
  const correct = questions.map((q, i) => answers[i] === q.correctIndex)
  return { score: correct.filter(Boolean).length, total: questions.length, correct }
}
