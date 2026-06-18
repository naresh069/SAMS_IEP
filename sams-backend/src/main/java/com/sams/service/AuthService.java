package com.sams.service;

import com.sams.dto.*;
import com.sams.entity.Student;
import com.sams.entity.Teacher;
import com.sams.exception.BadRequestException;
import com.sams.repository.StudentRepository;
import com.sams.repository.TeacherRepository;
import com.sams.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final TeacherRepository teacherRepo;
    private final StudentRepository studentRepo;
    private final PasswordEncoder encoder;
    private final JwtTokenProvider jwt;

    public LoginResponse registerTeacher(TeacherRegisterRequest req) {
        if (teacherRepo.existsByEmail(req.getEmail()))
            throw new BadRequestException("Email already in use");
        Teacher t = Teacher.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(encoder.encode(req.getPassword()))
                .subject(req.getSubject())
                .phone(req.getPhone())
                .build();
        teacherRepo.save(t);
        String token = jwt.generateToken(t.getEmail(), "TEACHER", t.getId());
        return LoginResponse.builder().token(token).user(toUser(t)).build();
    }

    public LoginResponse loginTeacher(LoginRequest req) {
        Teacher t = teacherRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        if (!encoder.matches(req.getPassword(), t.getPassword()))
            throw new BadCredentialsException("Invalid credentials");
        String token = jwt.generateToken(t.getEmail(), "TEACHER", t.getId());
        return LoginResponse.builder().token(token).user(toUser(t)).build();
    }

    public LoginResponse loginStudent(LoginRequest req) {
        Student s = studentRepo.findByEmail(req.getEmail())
                .or(() -> studentRepo.findByRollNumber(req.getRollNumber()))
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        if (!encoder.matches(req.getPassword(), s.getPassword()))
            throw new BadCredentialsException("Invalid credentials");
        String token = jwt.generateToken(s.getRollNumber(), "STUDENT", s.getId());
        return LoginResponse.builder().token(token).user(toUser(s)).build();
    }

    private Map<String, Object> toUser(Teacher t) {
        return Map.of(
                "id", t.getId(),
                "name", t.getName(),
                "email", t.getEmail(),
                "role", "TEACHER",
                "subject", t.getSubject() == null ? "" : t.getSubject(),
                "phone", t.getPhone() == null ? "" : t.getPhone()
        );
    }

    private Map<String, Object> toUser(Student s) {
        return Map.of(
                "id", s.getId(),
                "studentId", s.getStudentId(),
                "rollNumber", s.getRollNumber(),
                "name", s.getName(),
                "email", s.getEmail(),
                "className", s.getClassName() == null ? "" : s.getClassName(),
                "section", s.getSection() == null ? "" : s.getSection(),
                "role", "STUDENT"
        );
    }
}
