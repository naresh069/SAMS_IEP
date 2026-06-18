// Mock data used when USE_MOCK = true in services.
// Replace with real Spring Boot endpoints via VITE_API_URL.

export const mockTeachers = [
  { id: 1, name: 'Dr. Anita Sharma', email: 'teacher@sams.com', password: 'teacher123', role: 'TEACHER', subject: 'Computer Science', phone: '+91 9876500001' },
]

export const mockStudents = [
  { id: 1, studentId: 'STU001', name: 'Aarav Patel',  rollNumber: 'CSE001', email: 'student@sams.com', password: 'student123', role: 'STUDENT', class: 'CSE-A', section: 'A', phone: '+91 9876510001' },
  { id: 2, studentId: 'STU002', name: 'Diya Sharma',  rollNumber: 'CSE002', email: 'diya@sams.com',    password: 'student123', role: 'STUDENT', class: 'CSE-A', section: 'A', phone: '+91 9876510002' },
  { id: 3, studentId: 'STU003', name: 'Vihaan Singh', rollNumber: 'CSE003', email: 'vihaan@sams.com',  password: 'student123', role: 'STUDENT', class: 'CSE-A', section: 'A', phone: '+91 9876510003' },
  { id: 4, studentId: 'STU004', name: 'Anaya Gupta',  rollNumber: 'CSE004', email: 'anaya@sams.com',   password: 'student123', role: 'STUDENT', class: 'CSE-B', section: 'B', phone: '+91 9876510004' },
  { id: 5, studentId: 'STU005', name: 'Reyansh Khan', rollNumber: 'CSE005', email: 'reyansh@sams.com', password: 'student123', role: 'STUDENT', class: 'CSE-B', section: 'B', phone: '+91 9876510005' },
  { id: 6, studentId: 'STU006', name: 'Ishaan Verma', rollNumber: 'CSE006', email: 'ishaan@sams.com',  password: 'student123', role: 'STUDENT', class: 'CSE-B', section: 'B', phone: '+91 9876510006' },
  { id: 7, studentId: 'STU007', name: 'Saanvi Iyer',  rollNumber: 'CSE007', email: 'saanvi@sams.com',  password: 'student123', role: 'STUDENT', class: 'CSE-A', section: 'A', phone: '+91 9876510007' },
  { id: 8, studentId: 'STU008', name: 'Aditya Rao',   rollNumber: 'CSE008', email: 'aditya@sams.com',  password: 'student123', role: 'STUDENT', class: 'CSE-A', section: 'A', phone: '+91 9876510008' },
]

function genRecords() {
  const records = []
  const today = new Date()
  let id = 1
  for (let d = 0; d < 60; d++) {
    const day = new Date(today)
    day.setDate(today.getDate() - d)
    if (day.getDay() === 0) continue // skip Sundays
    const iso = day.toISOString().slice(0, 10)
    for (const s of mockStudents) {
      const present = Math.random() > 0.18
      records.push({
        id: id++,
        studentId: s.id,
        studentName: s.name,
        class: s.class,
        date: iso,
        status: present ? 'PRESENT' : 'ABSENT',
      })
    }
  }
  return records
}

export const mockAttendance = genRecords()

export const CLASSES = ['CSE-A', 'CSE-B', 'ECE-A', 'ME-A']
