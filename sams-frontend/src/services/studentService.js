import api from './api.js'
import { USE_MOCK } from './config.js'
import { addStudent, getAttendance, getStudents, saveStudents } from './mockStore.js'

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
    if (USE_MOCK) return getStudents().map(normalizeStudent)
    const { data } = await api.get('/students')
    return data.map(normalizeStudent)
  },
  // GET /students/:id
  async get(id) {
    if (USE_MOCK) return normalizeStudent(getStudents().find((s) => s.id === Number(id)))
    const { data } = await api.get(`/students/${id}`)
    return normalizeStudent(data)
  },
  // POST /students
  async create(payload) {
    if (USE_MOCK) {
      return normalizeStudent(addStudent(payload))
    }
    return (await api.post('/students', payload)).data
  },
  // PUT /students/:id
  async update(id, payload) {
    if (USE_MOCK) {
      const students = getStudents()
      const i = students.findIndex((s) => s.id === Number(id))
      if (i >= 0) {
        students[i] = normalizeStudent({ ...students[i], ...payload })
        saveStudents(students)
      }
      return students[i]
    }
    const { data } = await api.put(`/students/${id}`, payload)
    return normalizeStudent(data)
  },
  // DELETE /students/:id
  async remove(id) {
    if (USE_MOCK) {
      saveStudents(getStudents().filter((s) => s.id !== Number(id)))
      return { ok: true }
    }
    return (await api.delete(`/students/${id}`)).data
  },
  // GET /students/:id/summary
  async summary(id) {
    if (USE_MOCK) {
      const rec = getAttendance().filter((r) => r.studentId === Number(id))
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
