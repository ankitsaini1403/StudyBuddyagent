import api from './axios'

// POST /api/quiz/generate -> { topic, difficulty, num_questions, note_id }
export const generateQuiz = async ({
  topic,
  difficulty = 'medium',
  numQuestions = 5,
  noteId = null,
}) => {
  const res = await api.post('/quiz/generate', {
    topic,
    difficulty,
    num_questions: numQuestions,
    note_id: noteId,
  })
  return res.data // { id, topic, difficulty, questions: [...], created_at }
}

// GET /api/quiz/:id
export const getQuiz = async (quizId) => {
  const res = await api.get(`/quiz/${quizId}`)
  return res.data
}

// GET /api/quiz
export const listQuizzes = async () => {
  const res = await api.get('/quiz')
  return res.data
}
