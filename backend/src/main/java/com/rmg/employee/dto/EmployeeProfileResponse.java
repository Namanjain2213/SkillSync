package com.rmg.employee.dto;

import com.rmg.employee.model.Employee;
import com.rmg.employee.model.ProfileStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class EmployeeProfileResponse {
    private Long id;
    private String username;
    private String name;
    private String email;
    private String contactNo;
    private String address;
    private String highestQualification;
    private List<String> skills;
    private ProfileStatus status;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CertificationDto> certifications;
    private List<McqTestDto> mcqTests;
    private List<String> lockedSkills;

    public static EmployeeProfileResponse from(Employee e) {
        EmployeeProfileResponse r = new EmployeeProfileResponse();
        r.id = e.getId();
        r.username = e.getUser().getUsername();
        r.name = e.getName();
        r.email = e.getEmail();
        r.contactNo = e.getContactNo();
        r.address = e.getAddress();
        r.highestQualification = e.getHighestQualification();
        r.skills = e.getSkills();
        r.status = e.getStatus();
        r.rejectionReason = e.getRejectionReason();
        r.createdAt = e.getCreatedAt();
        r.updatedAt = e.getUpdatedAt();
        r.certifications = e.getCertifications().stream().map(c -> {
            CertificationDto cd = new CertificationDto();
            cd.setId(c.getId());
            cd.setName(c.getName());
            cd.setImagePath(c.getImagePath());
            cd.setUploadedAt(c.getUploadedAt());
            return cd;
        }).collect(Collectors.toList());
        r.mcqTests = e.getMcqTests().stream().map(t -> {
            McqTestDto td = new McqTestDto();
            td.setId(t.getId());
            td.setSkill(t.getSkill());
            td.setScore(t.getScore());
            td.setTotalQuestions(t.getTotalQuestions());
            td.setCorrectAnswers(t.getCorrectAnswers());
            td.setStatus(t.getStatus() != null ? t.getStatus().name() : null);
            td.setTestDate(t.getTestDate());
            td.setCompletedDate(t.getCompletedDate());
            td.setAttemptNumber(t.getAttemptNumber() != null ? t.getAttemptNumber() : 1);
            return td;
        }).collect(Collectors.toList());
        // Skills that have MCQ tests are locked — cannot be removed on profile update
        r.lockedSkills = e.getMcqTests().stream()
                .map(t -> t.getSkill())
                .distinct()
                .collect(Collectors.toList());
        return r;
    }

    // Getters
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getContactNo() { return contactNo; }
    public String getAddress() { return address; }
    public String getHighestQualification() { return highestQualification; }
    public List<String> getSkills() { return skills; }
    public ProfileStatus getStatus() { return status; }
    public String getRejectionReason() { return rejectionReason; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public List<CertificationDto> getCertifications() { return certifications; }
    public List<McqTestDto> getMcqTests() { return mcqTests; }
    public List<String> getLockedSkills() { return lockedSkills; }
}
