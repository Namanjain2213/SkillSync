package com.rmg.employee.service;

import com.rmg.employee.dto.EmployeeProfileResponse;
import com.rmg.employee.model.Employee;
import com.rmg.employee.model.ProfileStatus;
import com.rmg.employee.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HrService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public List<EmployeeProfileResponse> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(EmployeeProfileResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmployeeProfileResponse> getPendingEmployees() {
        return employeeRepository.findByStatus(ProfileStatus.PENDING).stream()
                .map(EmployeeProfileResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmployeeProfileResponse getEmployeeDetail(Long id) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return EmployeeProfileResponse.from(emp);
    }

    @Transactional
    public EmployeeProfileResponse onBenchProfile(Long id) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        emp.setStatus(ProfileStatus.ON_BENCH);
        emp.setRejectionReason(null);
        emp.setUpdatedAt(LocalDateTime.now());
        return EmployeeProfileResponse.from(employeeRepository.save(emp));
    }

    @Transactional
    public EmployeeProfileResponse approveProfile(Long id) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        emp.setStatus(ProfileStatus.APPROVED);
        emp.setRejectionReason(null);
        emp.setUpdatedAt(LocalDateTime.now());
        return EmployeeProfileResponse.from(employeeRepository.save(emp));
    }

    @Transactional
    public EmployeeProfileResponse rejectProfile(Long id, String reason) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        emp.setStatus(ProfileStatus.REJECTED);
        emp.setRejectionReason(reason);
        emp.setUpdatedAt(LocalDateTime.now());
        return EmployeeProfileResponse.from(employeeRepository.save(emp));
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getStats() {
        List<Employee> all = employeeRepository.findAll();
        long total    = all.size();
        long pending  = all.stream().filter(e -> e.getStatus() == ProfileStatus.PENDING).count();
        long approved = all.stream().filter(e -> e.getStatus() == ProfileStatus.APPROVED).count();
        long rejected = all.stream().filter(e -> e.getStatus() == ProfileStatus.REJECTED).count();

        // skill distribution
        Map<String, Long> skillCount = new LinkedHashMap<>();
        for (Employee e : all) {
            for (String skill : e.getSkills()) {
                skillCount.merge(skill, 1L, Long::sum);
            }
        }

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("total", total);
        stats.put("pending", pending);
        stats.put("approved", approved);
        stats.put("rejected", rejected);
        stats.put("skillDistribution", skillCount);
        return stats;
    }
}
