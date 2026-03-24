package com.rmg.employee.service;

import com.rmg.employee.dto.EmployeeProfileResponse;
import com.rmg.employee.dto.ProjectApplicationDto;
import com.rmg.employee.dto.ProjectRequest;
import com.rmg.employee.dto.ProjectResponse;
import com.rmg.employee.model.*;
import com.rmg.employee.repository.EmployeeRepository;
import com.rmg.employee.repository.ProjectApplicationRepository;
import com.rmg.employee.repository.ProjectRepository;
import com.rmg.employee.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired private ProjectRepository projectRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private ProjectApplicationRepository applicationRepository;

    @Transactional
    public ProjectResponse createProject(String pmEmployeeId, ProjectRequest request) {
        User pm = userRepository.findByEmployeeId(pmEmployeeId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setRequiredSkills(request.getRequiredSkills());
        project.setCreatedBy(pm);

        return ProjectResponse.from(projectRepository.save(project));
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getMyProjects(String pmEmployeeId) {
        return projectRepository.findByCreatedByEmployeeId(pmEmployeeId)
                .stream().map(ProjectResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProject(Long id) {
        return projectRepository.findById(id)
                .map(ProjectResponse::from)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    @Transactional
    public ProjectResponse updateProject(Long id, String pmEmployeeId, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getCreatedBy().getEmployeeId().equals(pmEmployeeId)) {
            throw new RuntimeException("Not authorized to update this project");
        }

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setRequiredSkills(request.getRequiredSkills());
        project.setUpdatedAt(LocalDateTime.now());

        return ProjectResponse.from(projectRepository.save(project));
    }

    /**
     * Returns approved employees whose skills overlap with the project's required skills.
     * Sorted by number of matching skills (descending).
     */
    @Transactional(readOnly = true)
    public List<EmployeeProfileResponse> getSuggestedCandidates(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        List<String> required = project.getRequiredSkills().stream()
                .map(s -> s.toUpperCase(Locale.ROOT))
                .collect(Collectors.toList());

        return employeeRepository.findAll().stream()
                .filter(e -> e.getStatus() == ProfileStatus.APPROVED)
                .filter(e -> hasMatchingSkill(e, required))
                .sorted((a, b) -> countMatches(b, required) - countMatches(a, required))
                .map(EmployeeProfileResponse::from)
                .collect(Collectors.toList());
    }

    private boolean hasMatchingSkill(Employee e, List<String> required) {
        return e.getSkills().stream()
                .anyMatch(s -> required.contains(s.toUpperCase(Locale.ROOT)));
    }

    private int countMatches(Employee e, List<String> required) {
        return (int) e.getSkills().stream()
                .filter(s -> required.contains(s.toUpperCase(Locale.ROOT)))
                .count();
    }

    /**
     * Returns active projects whose required skills overlap with the employee's skills.
     */
    @Transactional(readOnly = true)
    public List<ProjectResponse> getSuggestedProjectsForEmployee(String employeeId) {
        User user = userRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElse(null);

        if (employee == null || employee.getSkills().isEmpty()) return List.of();

        List<String> empSkills = employee.getSkills().stream()
                .map(s -> s.toUpperCase(Locale.ROOT))
                .collect(Collectors.toList());

        return projectRepository.findAll().stream()
                .filter(p -> p.getStatus() == ProjectStatus.ACTIVE)
                .filter(p -> p.getRequiredSkills().stream()
                        .anyMatch(s -> empSkills.contains(s.toUpperCase(Locale.ROOT))))
                .sorted((a, b) -> countProjectMatches(b, empSkills) - countProjectMatches(a, empSkills))
                .map(ProjectResponse::from)
                .collect(Collectors.toList());
    }

    private int countProjectMatches(Project p, List<String> empSkills) {
        return (int) p.getRequiredSkills().stream()
                .filter(s -> empSkills.contains(s.toUpperCase(Locale.ROOT)))
                .count();
    }

    // ── Employee applies to a project ──────────────────────────────────────────
    @Transactional
    public ProjectApplicationDto applyToProject(String employeeId, Long projectId) {
        User user = userRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee profile not found"));

        // HR approval is the final verification — if approved, employee can apply directly.
        if (employee.getStatus() != ProfileStatus.APPROVED) {
            throw new RuntimeException("Only employees with an HR-approved profile can apply to projects.");
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (applicationRepository.existsByProjectIdAndEmployeeId(projectId, employee.getId())) {
            throw new RuntimeException("You have already applied to this project.");
        }

        ProjectApplication app = new ProjectApplication();
        app.setProject(project);
        app.setEmployee(employee);
        ProjectApplication saved = applicationRepository.save(app);
        // Force-init lazy collections before DTO mapping
        employee.getSkills().size();
        employee.getCertifications().size();
        employee.getMcqTests().size();
        return ProjectApplicationDto.from(saved);
    }

    // ── Get all applications for a project (PM view) ───────────────────────────
    @Transactional
    public List<ProjectApplicationDto> getApplicationsForProject(Long projectId) {
        // Use simple query to avoid MultipleBagFetchException, then force-init lazily
        List<ProjectApplication> apps = applicationRepository.findByProjectIdWithDetails(projectId);
        // Force-initialize all lazy collections within the transaction before DTO mapping
        for (ProjectApplication app : apps) {
            Employee emp = app.getEmployee();
            // Initialize ElementCollection (skills) — must call size() to trigger load
            emp.getSkills().size();
            // Initialize OneToMany collections
            emp.getCertifications().size();
            emp.getMcqTests().size();
            // Touch each element to ensure Hibernate proxies are fully initialized
            emp.getCertifications().forEach(c -> c.getName());
            emp.getMcqTests().forEach(t -> t.getSkill());
            // Ensure user is loaded (should be EAGER via @OneToOne but touch it anyway)
            emp.getUser().getUsername();
        }
        return apps.stream()
                .map(ProjectApplicationDto::from)
                .collect(Collectors.toList());
    }

    // ── PM approves an application ─────────────────────────────────────────────
    @Transactional
    public ProjectApplicationDto approveApplication(Long applicationId, String note) {
        ProjectApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(ApplicationStatus.APPROVED);
        app.setPmNote(note);
        app.setUpdatedAt(LocalDateTime.now());
        applicationRepository.save(app);
        // Force-initialize lazy collections before mapping
        app.getEmployee().getSkills().size();
        app.getEmployee().getCertifications().size();
        app.getEmployee().getMcqTests().size();
        return ProjectApplicationDto.from(app);
    }

    @Transactional
    public ProjectApplicationDto rejectApplication(Long applicationId, String note) {
        ProjectApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(ApplicationStatus.REJECTED);
        app.setPmNote(note);
        app.setUpdatedAt(LocalDateTime.now());
        applicationRepository.save(app);
        app.getEmployee().getSkills().size();
        app.getEmployee().getCertifications().size();
        app.getEmployee().getMcqTests().size();
        return ProjectApplicationDto.from(app);
    }

    // ── Get employee's own applications ────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<ProjectApplicationDto> getMyApplications(String employeeId) {
        User user = userRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee profile not found"));
        return applicationRepository.findByEmployeeId(employee.getId()).stream()
                .map(a -> {
                    ProjectApplicationDto dto = new ProjectApplicationDto();
                    dto.setId(a.getId());
                    dto.setProjectId(a.getProject().getId());
                    dto.setProjectName(a.getProject().getName());
                    dto.setStatus(a.getStatus().name());
                    dto.setPmNote(a.getPmNote());
                    dto.setAppliedAt(a.getAppliedAt());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // ── Check if employee already applied ──────────────────────────────────────
    @Transactional(readOnly = true)
    public Map<Long, String> getApplicationStatusMap(String employeeId) {
        User user = userRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Employee employee = employeeRepository.findByUserId(user.getId()).orElse(null);
        if (employee == null) return Map.of();
        Map<Long, String> map = new java.util.HashMap<>();
        applicationRepository.findByEmployeeId(employee.getId())
                .forEach(a -> map.put(a.getProject().getId(), a.getStatus().name()));
        return map;
    }
}
