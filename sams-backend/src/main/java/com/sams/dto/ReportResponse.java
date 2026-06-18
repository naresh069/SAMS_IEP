package com.sams.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReportResponse {
    private String label;
    private long present;
    private long absent;
    private double percentage;
}
