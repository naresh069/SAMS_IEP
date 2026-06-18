package com.sams.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AttendanceRequest {
    private LocalDate date;
    private String className;
    private List<Entry> entries;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Entry {
        private Long studentId;
        private String status; // PRESENT | ABSENT
    }
}
