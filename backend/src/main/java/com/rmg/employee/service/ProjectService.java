package com.rmg.employee.service;

import com.rmg.employee.dto.EmployeeProfileResponse;
import com.rmg.employee.dto.ProjectRequest;
import com.rmg.employee.dto.ProjectResponse;
import com.rmg.employee.model.Employee;
import com.rmg.employee.model.ProfileStatus;
import com.rmg.employee.model.Project;
import com.rmg.employee.model.ProjectStatus;
import com.rmg.employee.model.User;
import com.rmg.employee.repository.EmployeeRepository;
import com.rmg.employee.repository.ProjectRepository;
import com.rmg.employee.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired private ProjectRepository projectRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private EmployeeRepository employeeRepository;

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
}
