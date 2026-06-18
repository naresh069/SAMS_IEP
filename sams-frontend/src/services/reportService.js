import { mockAttendance, mockStudents } from '../data/mockData.js'
import api from './api.js'
import { USE_MOCK } from './config.js'

const normalizeOverview = (overview) => ({
  ...overview,
  present: overview.present ?? overview.presentToday ?? 0,
  absent: overview.absent ?? overview.absentToday ?? 0,
  percent: overview.percent ?? overview.attendancePercentage ?? 0,
})

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

const normalizeStudent = (student) => ({
  ...student,
  class: student.class ?? student.className ?? '',
})

export const reportService = {
  // GET /reports/overview
  async overview() {
    if (USE_MOCK) {
      const today = new Date().toISOString().slice(0, 10)
      const todays = mockAttendance.filter((r) => r.date === today)
      const present = todays.filter((r) => r.status === 'PRESENT').length
      const absent = todays.filter((r) => r.status === 'ABSENT').length
      const totalStudents = mockStudents.length
      const totalRecords = mockAttendance.length
      const presentAll = mockAttendance.filter((r) => r.status === 'PRESENT').length
      const percent = totalRecords ? Math.round((presentAll / totalRecords) * 100) : 0
      return { totalStudents, present, absent, percent, totalRecords }
    }
    const { data } = await api.get('/reports/overview')
    return normalizeOverview(data)
  },

  // GET /reports/monthly
  async monthly() {
    if (USE_MOCK) {
      const byMonth = {}
      for (const r of mockAttendance) {
        const m = r.date.slice(0, 7)
        byMonth[m] ||= { present: 0, absent: 0 }
        byMonth[m][r.status === 'PRESENT' ? 'present' : 'absent']++
      }
      return Object.entries(byMonth)
        .sort()
        .map(([month, v]) => ({ month, ...v, total: v.present + v.absent }))
    }
    const { data } = await api.get('/reports/monthly')
    return data.map((m) => ({ ...m, total: m.total ?? m.present + m.absent }))
  },

  // GET /reports/trend
  async trend() {
    if (USE_MOCK) {
      const map = {}
      for (const r of mockAttendance) {
        map[r.date] ||= { present: 0, total: 0 }
        map[r.date].total++
        if (r.status === 'PRESENT') map[r.date].present++
      }
      return Object.entries(map)
        .sort()
        .slice(-14)
        .map(([date, v]) => ({
          date: date.slice(5),
          percent: Math.round((v.present / v.total) * 100),
        }))
    }
    const { data } = await api.get('/attendance')
    const map = {}
    for (const r of data.map(normalizeAttendance)) {
      if (!r.date) continue
      map[r.date] ||= { present: 0, total: 0 }
      map[r.date].total++
      if (r.status === 'PRESENT') map[r.date].present++
    }
    return Object.entries(map)
      .sort()
      .slice(-14)
      .map(([date, v]) => ({
        date: date.slice(5),
        percent: Math.round((v.present / v.total) * 100),
      }))
  },

  // GET /reports/leaderboard
  async leaderboard() {
    if (USE_MOCK) {
      const items = mockStudents.map((s) => {
        const rec = mockAttendance.filter((r) => r.studentId === s.id)
        const p = rec.filter((r) => r.status === 'PRESENT').length
        const percent = rec.length ? Math.round((p / rec.length) * 100) : 0
        return { id: s.id, name: s.name, class: s.class, percent }
      })
      return {
        top: [...items].sort((a, b) => b.percent - a.percent).slice(0, 5),
        bottom: [...items].sort((a, b) => a.percent - b.percent).slice(0, 5),
      }
    }
    const [studentsRes, attendanceRes] = await Promise.all([
      api.get('/students'),
      api.get('/attendance'),
    ])
    const attendance = attendanceRes.data.map(normalizeAttendance)
    const items = studentsRes.data.map(normalizeStudent).map((s) => {
      const rec = attendance.filter((r) => r.studentId === s.id)
      const present = rec.filter((r) => r.status === 'PRESENT').length
      const percent = rec.length ? Math.round((present / rec.length) * 100) : 0
      return { id: s.id, name: s.name, class: s.class, percent }
    })
    return {
      top: [...items].sort((a, b) => b.percent - a.percent).slice(0, 5),
      bottom: [...items].sort((a, b) => a.percent - b.percent).slice(0, 5),
    }
  },
}
