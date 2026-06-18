package com.sams.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudentRequest {
    @NotBlank private String studentId;
    @NotBlank private String rollNumber;
    @NotBlank private String name;
    @NotBlank @Email private String email;
    private String password;
    private String phone;
    private String className;
    private String section;
}
