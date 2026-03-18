package com.rmg.employee.dto;

import com.rmg.employee.model.ProjectApplication;

import java.time.LocalDateTime;

public class ProjectApplicationDto {
    private Long id;
    private Long projectId;
    private String projectName;
    private String status;
    private String pmNote;
    private LocalDateTime appliedAt;
    private EmployeeProfileResponse employee;

    public static ProjectApplicationDto from(ProjectApplication a) {
        ProjectApplicationDto dto = new ProjectApplicationDto();
        dto.id = a.getId();
        dto.projectId = a.getProject().getId();
        dto.projectName = a.getProject().getName();
        dto.status = a.getStatus().name();
        dto.pmNote = a.getPmNote();
        dto.appliedAt = a.getAppliedAt();
        dto.employee = EmployeeProfileResponse.from(a.getEmployee());
        return dto;
    }

    public Long getId() { return id; }
    public Long getProjectId() { return projectId; }
    public String getProjectName() { return projectName; }
    public String getStatus() { return status; }
    public String getPmNote() { return pmNote; }
    public LocalDateTime getAppliedAt() { return appliedAt; }
    public EmployeeProfileResponse getEmployee() { return employee; }

    public void setId(Long id) { this.id = id; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public void setStatus(String status) { this.status = status; }
    public void setPmNote(String pmNote) { this.pmNote = pmNote; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
    public void setEmployee(EmployeeProfileResponse employee) { this.employee = employee; }
}
