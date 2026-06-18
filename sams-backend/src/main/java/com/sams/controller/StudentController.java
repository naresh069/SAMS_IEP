package com.sams.controller;

import com.sams.dto.StudentRequest;
import com.sams.entity.Student;
import com.sams.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService service;

    @GetMapping
    public List<Student> list() { return service.list(); }

    @GetMapping("/{id}")
    public Student get(@PathVariable Long id) { return service.get(id); }

    @PostMapping
    public Student create(@Valid @RequestBody StudentRequest req) { return service.create(req); }

    @PutMapping("/{id}")
    public Student update(@PathVariable Long id, @Valid @RequestBody StudentRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
