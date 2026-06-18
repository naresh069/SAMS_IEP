import { mockAttendance, mockStudents } from '../data/mockData.js'
import api from './api.js'

export const USE_MOCK = false

const normalizeAttendance = (record) => {
  const student = record.student ?? {}
  return {
    ...record,
    studentId: record.studentId ?? student.id,
    studentName: record.studentName ?? student.name ?? '',
    class: record.class ?? record.className ?? student.className ?? student.class ?? '',
    date: record.date ?? record.attendanceDate,
  }
}

export const attendanceService = {
  // GET /attendance/date?date=&className=
  async byDate(date, klass) {
    if (USE_MOCK) {
      return mockAttendance.filter(
        (r) => r.date === date && (!klass || r.class === klass),
      )
    }
    const { data } = await api.get('/attendance/date', {
      params: { date, className: klass || undefined },
    })
    return data.map(normalizeAttendance)
  },

  // GET /attendance/student/:id
  async byStudent(studentId) {
    if (USE_MOCK) {
      return mockAttendance
        .filter((r) => r.studentId === Number(studentId))
        .sort((a, b) => b.date.localeCompare(a.date))
    }
    const { data } = await api.get(`/attendance/student/${studentId}`)
    return data.map(normalizeAttendance)
  },

  // POST /attendance/bulk  { date, className, entries: [{ studentId, status }] }
  async saveBulk(records, options = {}) {
    if (USE_MOCK) {
      for (const r of records) {
        const existing = mockAttendance.find(
          (x) => x.studentId === r.studentId && x.date === r.date,
        )
        if (existing) existing.status = r.status
        else {
          const stu = mockStudents.find((s) => s.id === r.studentId)
          mockAttendance.push({
            id: mockAttendance.length + 1,
            studentId: r.studentId,
            studentName: stu?.name ?? '—',
            class: stu?.class ?? '—',
            date: r.date,
            status: r.status,
          })
        }
      }
      return { saved: records.length }
    }
    const date = options.date ?? records[0]?.date
    const payload = {
      date,
      className: options.className,
      entries: records.map(({ studentId, status }) => ({ studentId, status })),
    }
    const { data } = await api.post('/attendance/bulk', payload)
    return data.map(normalizeAttendance)
  },

  // PUT /attendance/:id
  async update(id, status) {
    if (USE_MOCK) {
      const r = mockAttendance.find((x) => x.id === Number(id))
      if (r) r.status = status
      return r
    }
    const { data } = await api.put(`/attendance/${id}`, { status })
    return normalizeAttendance(data)
  },
}
