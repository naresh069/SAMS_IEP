package com.sams.service;

import com.sams.dto.StudentRequest;
import com.sams.entity.Student;
import com.sams.exception.BadRequestException;
import com.sams.exception.ResourceNotFoundException;
import com.sams.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository repo;
    private final PasswordEncoder encoder;

    public List<Student> list() { return repo.findAll(); }

    public Student get(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Student not found: " + id));
    }

    public Student create(StudentRequest r) {
        if (repo.existsByEmail(r.getEmail())) throw new BadRequestException("Email already in use");
        if (repo.existsByRollNumber(r.getRollNumber())) throw new BadRequestException("Roll number already in use");
        if (repo.existsByStudentId(r.getStudentId())) throw new BadRequestException("Student ID already in use");
        Student s = Student.builder()
                .studentId(r.getStudentId())
                .rollNumber(r.getRollNumber())
                .name(r.getName())
                .email(r.getEmail())
                .password(encoder.encode(r.getPassword() == null || r.getPassword().isBlank() ? "student123" : r.getPassword()))
                .phone(r.getPhone())
                .className(r.getClassName())
                .section(r.getSection())
                .build();
        return repo.save(s);
    }

    public Student update(Long id, StudentRequest r) {
        Student s = get(id);
        s.setStudentId(r.getStudentId());
        s.setRollNumber(r.getRollNumber());
        s.setName(r.getName());
        s.setEmail(r.getEmail());
        s.setPhone(r.getPhone());
        s.setClassName(r.getClassName());
        s.setSection(r.getSection());
        if (r.getPassword() != null && !r.getPassword().isBlank())
            s.setPassword(encoder.encode(r.getPassword()));
        return repo.save(s);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) throw new ResourceNotFoundException("Student not found: " + id);
        repo.deleteById(id);
    }
}
