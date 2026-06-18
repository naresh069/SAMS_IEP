package com.sams.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardResponse {
    private long totalStudents;
    private long presentToday;
    private long absentToday;
    private double attendancePercentage;
    private long totalRecords;
}
