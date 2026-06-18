package com.sams.controller;

import com.sams.dto.AttendanceRequest;
import com.sams.dto.AttendanceResponse;
import com.sams.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService service;

    @GetMapping
    public List<AttendanceResponse> all() {
        return service.all().stream().map(AttendanceResponse::from).collect(Collectors.toList());
    }

    @GetMapping("/date")
    public List<AttendanceResponse> byDate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                           @RequestParam(required = false) String className) {
        return service.forDate(date, className).stream().map(AttendanceResponse::from).collect(Collectors.toList());
    }

    @GetMapping("/student/{studentId}")
    public List<AttendanceResponse> byStudent(@PathVariable Long studentId) {
        return service.forStudent(studentId).stream().map(AttendanceResponse::from).collect(Collectors.toList());
    }

    @PostMapping("/bulk")
    public List<AttendanceResponse> bulk(@RequestBody AttendanceRequest req) {
        return service.bulkSave(req).stream().map(AttendanceResponse::from).collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public AttendanceResponse update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return AttendanceResponse.from(service.update(id, body.get("status")));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
