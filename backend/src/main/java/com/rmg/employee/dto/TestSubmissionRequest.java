package com.rmg.employee.dto;

import java.util.Map;

public class TestSubmissionRequest {
    private Long testId;
    private Map<Long, String> answers; // questionId -> selectedAnswer (A, B, C, or D)

    public Long getTestId() { return testId; }
    public void setTestId(Long testId) { this.testId = testId; }
    
    public Map<Long, String> getAnswers() { return answers; }
    public void setAnswers(Map<Long, String> answers) { this.answers = answers; }
}