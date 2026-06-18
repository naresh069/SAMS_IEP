package com.sams.controller;

import com.sams.dto.DashboardResponse;
import com.sams.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService service;

    @GetMapping("/overview")
    public DashboardResponse overview() { return service.overview(); }

    @GetMapping("/monthly")
    public List<Map<String, Object>> monthly() { return service.monthly(); }

    @GetMapping("/student-summary/{id}")
    public Map<String, Object> studentSummary(@PathVariable Long id) { return service.studentSummary(id); }
}
