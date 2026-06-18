package com.sams.service;

import com.sams.dto.DashboardResponse;
import com.sams.entity.Attendance;
import com.sams.entity.Student;
import com.sams.repository.AttendanceRepository;
import com.sams.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final StudentRepository studentRepo;
    private final AttendanceRepository attendanceRepo;

    public DashboardResponse overview() {
        LocalDate today = LocalDate.now();
        long total = studentRepo.count();
        long present = attendanceRepo.countByAttendanceDateAndStatus(today, Attendance.Status.PRESENT);
        long absent = attendanceRepo.countByAttendanceDateAndStatus(today, Attendance.Status.ABSENT);
        long records = attendanceRepo.count();
        long allPresent = attendanceRepo.findAll().stream()
                .filter(a -> a.getStatus() == Attendance.Status.PRESENT).count();
        double pct = records == 0 ? 0 : Math.round((allPresent * 10000.0 / records)) / 100.0;
        return DashboardResponse.builder()
                .totalStudents(total)
                .presentToday(present)
                .absentToday(absent)
                .attendancePercentage(pct)
                .totalRecords(records)
                .build();
    }

    public List<Map<String, Object>> monthly() {
        Map<String, long[]> map = new TreeMap<>();
        for (Attendance a : attendanceRepo.findAll()) {
            String month = a.getAttendanceDate().toString().substring(0, 7);
            long[] cur = map.computeIfAbsent(month, k -> new long[2]);
            if (a.getStatus() == Attendance.Status.PRESENT) cur[0]++; else cur[1]++;
        }
        return map.entrySet().stream().map(e -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("month", e.getKey());
            m.put("present", e.getValue()[0]);
            m.put("absent", e.getValue()[1]);
            return m;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> studentSummary(Long id) {
        Student s = studentRepo.findById(id).orElseThrow();
        List<Attendance> recs = attendanceRepo.findByStudentIdOrderByAttendanceDateDesc(id);
        long present = recs.stream().filter(a -> a.getStatus() == Attendance.Status.PRESENT).count();
        long absent = recs.size() - present;
        double pct = recs.isEmpty() ? 0 : Math.round((present * 10000.0 / recs.size())) / 100.0;
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", s.getId());
        out.put("studentId", s.getStudentId());
        out.put("rollNumber", s.getRollNumber());
        out.put("name", s.getName());
        out.put("className", s.getClassName());
        out.put("section", s.getSection());
        out.put("total", recs.size());
        out.put("present", present);
        out.put("absent", absent);
        out.put("percentage", pct);
        return out;
    }
}
