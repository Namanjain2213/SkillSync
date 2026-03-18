package com.rmg.employee.controller;

import com.rmg.employee.dto.EmployeeProfileResponse;
import com.rmg.employee.dto.ProjectApplicationDto;
import com.rmg.employee.dto.ProjectRequest;
import com.rmg.employee.dto.ProjectResponse;
import com.rmg.employee.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pm")
public class ProjectController {

    @Autowired private ProjectService projectService;

    @PostMapping("/projects")
    public ResponseEntity<ProjectResponse> createProject(Principal principal, @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.createProject(principal.getName(), request));
    }

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectResponse>> getMyProjects(Principal principal) {
        return ResponseEntity.ok(projectService.getMyProjects(principal.getName()));
    }

    @GetMapping("/projects/{id}")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProject(id));
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable Long id, Principal principal,
                                                          @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(id, principal.getName(), request));
    }

    @GetMapping("/projects/{id}/candidates")
    public ResponseEntity<List<EmployeeProfileResponse>> getCandidates(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getSuggestedCandidates(id));
    }

    // Called by employees — returns projects matching their skills
    @GetMapping("/suggested")
    public ResponseEntity<List<ProjectResponse>> getSuggestedProjects(Principal principal) {
        return ResponseEntity.ok(projectService.getSuggestedProjectsForEmployee(principal.getName()));
    }

    // PM: get all applications for a project
    @GetMapping("/projects/{id}/applications")
    public ResponseEntity<List<ProjectApplicationDto>> getApplications(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getApplicationsForProject(id));
    }

    // PM: approve an application
    @PostMapping("/applications/{id}/approve")
    public ResponseEntity<ProjectApplicationDto> approveApplication(
            @PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        String note = body != null ? body.getOrDefault("note", "") : "";
        return ResponseEntity.ok(projectService.approveApplication(id, note));
    }

    // PM: reject an application
    @PostMapping("/applications/{id}/reject")
    public ResponseEntity<ProjectApplicationDto> rejectApplication(
            @PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        String note = body != null ? body.getOrDefault("note", "") : "";
        return ResponseEntity.ok(projectService.rejectApplication(id, note));
    }
}
