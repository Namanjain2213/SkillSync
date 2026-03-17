package com.rmg.employee.repository;

import com.rmg.employee.model.McqQuestion;
import com.rmg.employee.model.DifficultyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface McqQuestionRepository extends JpaRepository<McqQuestion, Long> {
    List<McqQuestion> findBySkill(String skill);
    List<McqQuestion> findBySkillAndDifficulty(String skill, DifficultyLevel difficulty);
    
    @Query(value = "SELECT * FROM mcq_questions WHERE skill = :skill AND difficulty = :difficulty ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<McqQuestion> findRandomQuestionsBySkillAndDifficulty(@Param("skill") String skill, @Param("difficulty") String difficulty, @Param("limit") int limit);

    long countBySkill(String skill);

    @Transactional
    void deleteBySkill(String skill);
}