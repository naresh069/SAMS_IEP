package com.sams.service;

import com.sams.dto.AttendanceRequest;
import com.sams.entity.Attendance;
import com.sams.entity.Student;
import com.sams.exception.ResourceNotFoundException;
import com.sams.repository.AttendanceRepository;
import com.sams.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository repo;
    private final StudentRepository studentRepo;

    public List<Attendance> all() { return repo.findAll(); }

    public List<Attendance> forDate(LocalDate date, String className) {
        return (className == null || className.isBlank())
                ? repo.findByAttendanceDate(date)
                : repo.findByDateAndClassName(date, className);
    }

    public List<Attendance> forStudent(Long studentId) {
        return repo.findByStudentIdOrderByAttendanceDateDesc(studentId);
    }

    @Transactional
    public List<Attendance> bulkSave(AttendanceRequest req) {
        List<Attendance> saved = new ArrayList<>();
        for (AttendanceRequest.Entry e : req.getEntries()) {
            Student s = studentRepo.findById(e.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + e.getStudentId()));
            Attendance attendance = repo.findByStudentIdAndAttendanceDate(e.getStudentId(), req.getDate())
                    .orElseGet(() -> Attendance.builder()
                            .student(s)
                            .attendanceDate(req.getDate())
                            .build());
            attendance.setStatus(Attendance.Status.valueOf(e.getStatus()));
            saved.add(repo.save(attendance));
        }
        return saved;
    }

    public Attendance update(Long id, String status) {
        Attendance a = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Record not found: " + id));
        a.setStatus(Attendance.Status.valueOf(status));
        return repo.save(a);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) throw new ResourceNotFoundException("Record not found: " + id);
        repo.deleteById(id);
    }

    public double percentageFor(Long studentId) {
        long total = repo.countByStudentId(studentId);
        if (total == 0) return 0.0;
        long present = repo.countByStudentIdAndStatus(studentId, Attendance.Status.PRESENT);
        return Math.round((present * 10000.0 / total)) / 100.0;
    }
}
