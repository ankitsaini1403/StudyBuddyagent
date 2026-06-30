import api from './axios'

// POST /api/auth/register  -> { email, password, full_name }
export const registerUser = async ({ email, password, fullName }) => {
  const res = await api.post('/auth/register', {
    email,
    password,
    full_name: fullName || null,
  })
  return res.data // { id, email, full_name, is_active }
}

// POST /api/auth/login  -> { email, password }
export const loginUser = async ({ email, password }) => {
  const res = await api.post('/auth/login', { email, password })
  const { access_token, refresh_token } = res.data

  localStorage.setItem('sb_token', access_token)
  localStorage.setItem('sb_refresh_token', refresh_token)

  return res.data
}

// POST /api/auth/refresh  (note: backend expects refresh_token as a query param)
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('sb_refresh_token')
  if (!refreshToken) throw new Error('No refresh token available')

  const res = await api.post('/auth/refresh', null, {
    params: { refresh_token: refreshToken },
  })
  const { access_token, refresh_token } = res.data

  localStorage.setItem('sb_token', access_token)
  localStorage.setItem('sb_refresh_token', refresh_token)

  return res.data
}

// GET /api/auth/me
export const getCurrentUser = async () => {
  const res = await api.get('/auth/me')
  return res.data // { id, email, full_name, is_active }
}

export const logoutUser = () => {
  localStorage.removeItem('sb_token')
  localStorage.removeItem('sb_refresh_token')
}

export const isAuthenticated = () => !!localStorage.getItem('sb_token')
