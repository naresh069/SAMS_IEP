package com.sams.dto;

import com.sams.entity.Attendance;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AttendanceResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String className;
    private LocalDate date;
    private String status;

    public static AttendanceResponse from(Attendance attendance) {
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .studentId(attendance.getStudent().getId())
                .studentName(attendance.getStudent().getName())
                .className(attendance.getStudent().getClassName())
                .date(attendance.getAttendanceDate())
                .status(attendance.getStatus().name())
                .build();
    }
}
