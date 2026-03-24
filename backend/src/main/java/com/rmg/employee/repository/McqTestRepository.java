package com.rmg.employee.repository;

import com.rmg.employee.model.McqTest;
import com.rmg.employee.model.TestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface McqTestRepository extends JpaRepository<McqTest, Long> {
    List<McqTest> findByEmployeeId(Long employeeId);
    List<McqTest> findByEmployeeIdAndSkill(Long employeeId, String skill);
    Optional<McqTest> findByEmployeeIdAndSkillAndStatus(Long employeeId, String skill, TestStatus status);
    long countByEmployeeIdAndSkill(Long employeeId, String skill);
    long countByEmployeeIdAndSkillAndStatus(Long employeeId, String skill, TestStatus status);
}
