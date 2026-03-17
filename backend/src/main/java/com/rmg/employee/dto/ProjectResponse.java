package com.rmg.employee.dto;

import com.rmg.employee.model.Project;
import java.time.LocalDateTime;
import java.util.List;

public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private List<String> requiredSkills;
    private String createdByEmployeeId;
    private String createdByName;
    private String status;
    private LocalDateTime createdAt;

    public static ProjectResponse from(Project p) {
        ProjectResponse r = new ProjectResponse();
        r.id = p.getId();
        r.name = p.getName();
        r.description = p.getDescription();
        r.requiredSkills = p.getRequiredSkills();
        r.createdByEmployeeId = p.getCreatedBy().getEmployeeId();
        r.createdByName = p.getCreatedBy().getFullName();
        r.status = p.getStatus().name();
        r.createdAt = p.getCreatedAt();
        return r;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public List<String> getRequiredSkills() { return requiredSkills; }
    public String getCreatedByEmployeeId() { return createdByEmployeeId; }
    public String getCreatedByName() { return createdByName; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
