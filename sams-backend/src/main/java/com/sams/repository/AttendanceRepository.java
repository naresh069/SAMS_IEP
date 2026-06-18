package com.sams.repository;

import com.sams.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByAttendanceDate(LocalDate date);
    Optional<Attendance> findByStudentIdAndAttendanceDate(Long studentId, LocalDate date);
    List<Attendance> findByStudentIdOrderByAttendanceDateDesc(Long studentId);
    List<Attendance> findByStudentIdAndAttendanceDateBetween(Long studentId, LocalDate from, LocalDate to);
    long countByAttendanceDateAndStatus(LocalDate date, Attendance.Status status);
    long countByStudentIdAndStatus(Long studentId, Attendance.Status status);
    long countByStudentId(Long studentId);

    @Query("SELECT a FROM Attendance a WHERE a.attendanceDate = :date AND a.student.className = :className")
    List<Attendance> findByDateAndClassName(LocalDate date, String className);
}
