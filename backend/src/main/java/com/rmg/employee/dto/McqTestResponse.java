package com.rmg.employee.dto;

import java.util.List;

public class McqTestResponse {
    private Long testId;
    private String skill;
    private List<McqQuestionDto> questions;
    private int totalQuestions;
    private int timeLimit = 30; // 30 minutes

    public Long getTestId() { return testId; }
    public void setTestId(Long testId) { this.testId = testId; }
    
    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }
    
    public List<McqQuestionDto> getQuestions() { return questions; }
    public void setQuestions(List<McqQuestionDto> questions) { this.questions = questions; }
    
    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }
    
    public int getTimeLimit() { return timeLimit; }
    public void setTimeLimit(int timeLimit) { this.timeLimit = timeLimit; }
}