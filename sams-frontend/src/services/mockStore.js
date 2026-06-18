import { mockAttendance, mockStudents, mockTeachers } from '../data/mockData.js'

const TEACHERS_KEY = 'sams_mock_teachers'
const STUDENTS_KEY = 'sams_mock_students'
const ATTENDANCE_KEY = 'sams_mock_attendance'

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : [...fallback]
  } catch {
    return [...fallback]
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
  return value
}

function nextId(items) {
  return items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
}

export function getTeachers() {
  return read(TEACHERS_KEY, mockTeachers)
}

export function saveTeachers(teachers) {
  return write(TEACHERS_KEY, teachers)
}

export function addTeacher(payload) {
  const teachers = getTeachers()
  if (teachers.some((teacher) => teacher.email.toLowerCase() === payload.email.toLowerCase())) {
    throw new Error('A teacher account with this email already exists')
  }
  const teacher = { id: nextId(teachers), role: 'TEACHER', ...payload }
  saveTeachers([...teachers, teacher])
  return teacher
}

export function getStudents() {
  return read(STUDENTS_KEY, mockStudents)
}

export function saveStudents(students) {
  return write(STUDENTS_KEY, students)
}

export function addStudent(payload) {
  const students = getStudents()
  if (students.some((student) => student.email.toLowerCase() === payload.email.toLowerCase())) {
    throw new Error('A student account with this email already exists')
  }
  const student = {
    id: nextId(students),
    role: 'STUDENT',
    ...payload,
    class: payload.class ?? payload.className ?? '',
  }
  saveStudents([...students, student])
  return student
}

export function getAttendance() {
  return read(ATTENDANCE_KEY, mockAttendance)
}

export function saveAttendance(records) {
  return write(ATTENDANCE_KEY, records)
}
