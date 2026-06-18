package com.sams.controller;

import com.sams.dto.*;
import com.sams.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/teacher/register")
    public LoginResponse registerTeacher(@Valid @RequestBody TeacherRegisterRequest req) {
        return authService.registerTeacher(req);
    }

    @PostMapping("/teacher/login")
    public LoginResponse teacherLogin(@RequestBody LoginRequest req) {
        return authService.loginTeacher(req);
    }

    @PostMapping("/student/login")
    public LoginResponse studentLogin(@RequestBody LoginRequest req) {
        return authService.loginStudent(req);
    }
}
