package com.rmg.employee.repository;

import com.rmg.employee.model.ApplicationStatus;
import com.rmg.employee.model.ProjectApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectApplicationRepository extends JpaRepository<ProjectApplication, Long> {

    // Fetch applications with employee and project — collections loaded separately via .size() calls in service
    @Query("SELECT DISTINCT a FROM ProjectApplication a " +
           "JOIN FETCH a.employee e " +
           "JOIN FETCH a.project " +
           "JOIN FETCH e.user " +
           "WHERE a.project.id = :projectId " +
           "ORDER BY a.appliedAt DESC")
    List<ProjectApplication> findByProjectIdWithDetails(@Param("projectId") Long projectId);

    List<ProjectApplication> findByProjectId(Long projectId);
    List<ProjectApplication> findByEmployeeId(Long employeeId);
    Optional<ProjectApplication> findByProjectIdAndEmployeeId(Long projectId, Long employeeId);
    boolean existsByProjectIdAndEmployeeId(Long projectId, Long employeeId);
    List<ProjectApplication> findByProjectIdAndStatus(Long projectId, ApplicationStatus status);
}
