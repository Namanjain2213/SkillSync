package com.rmg.employee.dto;

public class AdminStatsDto {
    private long totalUsers;
    private long totalEmployees;
    private long totalHR;
    private long totalProjectManagers;
    private long totalAdmins;
    private long activeUsers;
    private long inactiveUsers;

    public AdminStatsDto(long totalUsers, long totalEmployees, long totalHR,
                         long totalProjectManagers, long totalAdmins,
                         long activeUsers, long inactiveUsers) {
        this.totalUsers = totalUsers;
        this.totalEmployees = totalEmployees;
        this.totalHR = totalHR;
        this.totalProjectManagers = totalProjectManagers;
        this.totalAdmins = totalAdmins;
        this.activeUsers = activeUsers;
        this.inactiveUsers = inactiveUsers;
    }

    public long getTotalUsers() { return totalUsers; }
    public long getTotalEmployees() { return totalEmployees; }
    public long getTotalHR() { return totalHR; }
    public long getTotalProjectManagers() { return totalProjectManagers; }
    public long getTotalAdmins() { return totalAdmins; }
    public long getActiveUsers() { return activeUsers; }
    public long getInactiveUsers() { return inactiveUsers; }
}
