import { mockStudents, mockAttendance } from '../data/mockData.js'
import api from './api.js'
import { USE_MOCK } from './config.js'

const normalizeStudent = (student) => ({
  ...student,
  class: student.class ?? student.className ?? '',
})

const normalizeSummary = (summary) => ({
  ...summary,
  percent: summary.percent ?? summary.percentage ?? 0,
})

export const studentService = {
  // GET /students
  async list() {
    if (USE_MOCK) return [...mockStudents]
    const { data } = await api.get('/students')
    return data.map(normalizeStudent)
  },
  // GET /students/:id
  async get(id) {
    if (USE_MOCK) return mockStudents.find((s) => s.id === Number(id))
    const { data } = await api.get(`/students/${id}`)
    return normalizeStudent(data)
  },
  // POST /students
  async create(payload) {
    if (USE_MOCK) {
      const newS = { id: mockStudents.length + 1, role: 'STUDENT', ...payload }
      mockStudents.push(newS)
      return newS
    }
    return (await api.post('/students', payload)).data
  },
  // PUT /students/:id
  async update(id, payload) {
    if (USE_MOCK) {
      const i = mockStudents.findIndex((s) => s.id === Number(id))
      if (i >= 0) mockStudents[i] = { ...mockStudents[i], ...payload }
      return mockStudents[i]
    }
    const { data } = await api.put(`/students/${id}`, payload)
    return normalizeStudent(data)
  },
  // DELETE /students/:id
  async remove(id) {
    if (USE_MOCK) {
      const i = mockStudents.findIndex((s) => s.id === Number(id))
      if (i >= 0) mockStudents.splice(i, 1)
      return { ok: true }
    }
    return (await api.delete(`/students/${id}`)).data
  },
  // GET /students/:id/summary
  async summary(id) {
    if (USE_MOCK) {
      const rec = mockAttendance.filter((r) => r.studentId === Number(id))
      const total = rec.length
      const present = rec.filter((r) => r.status === 'PRESENT').length
      const absent = total - present
      const percent = total ? Math.round((present / total) * 100) : 0
      return { total, present, absent, percent }
    }
    const { data } = await api.get(`/reports/student-summary/${id}`)
    return normalizeSummary(data)
  },
}
