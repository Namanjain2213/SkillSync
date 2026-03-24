package com.rmg.employee.dto;

import java.time.LocalDateTime;

public class McqTestDto {
    private Long id;
    private String skill;
    private Integer score;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private String status;
    private LocalDateTime testDate;
    private LocalDateTime completedDate;
    private Integer attemptNumber;
    private Integer remainingAttempts;

    public Integer getAttemptNumber() { return attemptNumber; }
    public void setAttemptNumber(Integer attemptNumber) { this.attemptNumber = attemptNumber; }
    public Integer getRemainingAttempts() { return remainingAttempts; }
    public void setRemainingAttempts(Integer remainingAttempts) { this.remainingAttempts = remainingAttempts; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }
    public Integer getCorrectAnswers() { return correctAnswers; }
    public void setCorrectAnswers(Integer correctAnswers) { this.correctAnswers = correctAnswers; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getTestDate() { return testDate; }
    public void setTestDate(LocalDateTime testDate) { this.testDate = testDate; }
    public LocalDateTime getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDateTime completedDate) { this.completedDate = completedDate; }
}
