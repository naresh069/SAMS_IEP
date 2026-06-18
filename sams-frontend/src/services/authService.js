import { mockTeachers, mockStudents } from '../data/mockData.js'
import api from './api.js'

export const USE_MOCK = false

function apiError(err, fallback) {
  return new Error(err.response?.data?.message || err.message || fallback)
}

function fakeToken(user) {
  return btoa(JSON.stringify({ uid: user.id, role: user.role, ts: Date.now() }))
}

export const authService = {
  // POST /auth/login/teacher  { email, password } -> { user, token }
  async loginTeacher(email, password) {
    if (USE_MOCK) {
      const t = mockTeachers.find((x) => x.email === email && x.password === password)
      if (!t) throw new Error('Invalid teacher credentials')
      const { password: _p, ...user } = t
      return { user, token: fakeToken(user) }
    }
    try {
      const { data } = await api.post('/auth/teacher/login', { email, password })
      return data
    } catch (err) {
      throw apiError(err, 'Teacher login failed')
    }
  },

  // POST /auth/login/student  { email, password } -> { user, token }
  async loginStudent(email, password) {
    if (USE_MOCK) {
      const s = mockStudents.find((x) => x.email === email && x.password === password)
      if (!s) throw new Error('Invalid student credentials')
      const { password: _p, ...user } = s
      return { user, token: fakeToken(user) }
    }
    try {
      const { data } = await api.post('/auth/student/login', { email, password })
      return data
    } catch (err) {
      throw apiError(err, 'Student login failed')
    }
  },

  // POST /auth/register/teacher
  async registerTeacher(payload) {
    if (USE_MOCK) {
      const newT = { id: mockTeachers.length + 1, role: 'TEACHER', ...payload }
      mockTeachers.push(newT)
      const { password: _p, ...user } = newT
      return { user, token: fakeToken(user) }
    }
    try {
      const { data } = await api.post('/auth/teacher/register', payload)
      return data
    } catch (err) {
      throw apiError(err, 'Teacher registration failed')
    }
  },
}
