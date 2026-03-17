package com.rmg.employee.repository;

import com.rmg.employee.model.Role;
import com.rmg.employee.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmployeeId(String employeeId);
    Optional<User> findByEmail(String email);
    boolean existsByEmployeeId(String employeeId);
    boolean existsByEmail(String email);

    List<User> findAllByOrderByCreatedAtDesc();
    List<User> findByRoleOrderByCreatedAtDesc(Role role);

    long countByRole(Role role);
    long countByActive(boolean active);

    // Get max sequence number for a given prefix (e.g. "EMP")
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRoleForId(Role role);
}
