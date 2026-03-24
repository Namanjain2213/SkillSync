package com.rmg.employee.service;

import com.rmg.employee.dto.*;
import com.rmg.employee.model.*;
import com.rmg.employee.repository.EmployeeRepository;
import com.rmg.employee.repository.McqQuestionRepository;
import com.rmg.employee.repository.McqTestRepository;
import com.rmg.employee.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private McqQuestionRepository mcqQuestionRepository;
    @Autowired private McqTestRepository mcqTestRepository;

    private static final List<String> MCQ_SKILLS = Arrays.asList("JAVA", "PYTHON", "AI_ML", "DOTNET");
    private static final String UPLOAD_DIR = "uploads/certifications/";

    private User findUser(String employeeId) {
        return userRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("User not found: " + employeeId));
    }

    @Transactional
    public EmployeeProfileResponse createProfile(String employeeId, EmployeeProfileRequest request) {
        User user = findUser(employeeId);

        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElse(new Employee());

        employee.setUser(user);
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setContactNo(request.getContactNo());
        employee.setAddress(request.getAddress());
        employee.setHighestQualification(request.getHighestQualification());
        employee.setUpdatedAt(LocalDateTime.now());

        // Skills that already have MCQ tests are locked — cannot be removed
        // Use existing employee skills as source of truth for locked mandatory skills
        List<String> existingSkills = employee.getSkills() != null ? new ArrayList<>(employee.getSkills()) : new ArrayList<>();
        List<String> lockedSkills = existingSkills.stream()
                .filter(s -> MCQ_SKILLS.contains(normalizeSkill(s)))
                .collect(Collectors.toList());

        // Merge: start with request skills, then add back any locked ones that were removed
        List<String> mergedSkills = new ArrayList<>(request.getSkills() != null ? request.getSkills() : new ArrayList<>());
        for (String locked : lockedSkills) {
            boolean alreadyIn = mergedSkills.stream()
                    .anyMatch(s -> normalizeSkill(s).equals(normalizeSkill(locked)));
            if (!alreadyIn) {
                mergedSkills.add(locked);
            }
        }
        employee.setSkills(mergedSkills);

        employee = employeeRepository.save(employee);
        createMcqTestsForSkills(employee, mergedSkills);
        employee = employeeRepository.save(employee);

        return EmployeeProfileResponse.from(employee);
    }

    private String normalizeSkill(String skill) {
        if (skill == null) return "";
        String s = skill.toUpperCase().replace(" ", "_").replace(".", "");
        if (s.equals("NET") || s.equals("DOTNET")) return "DOTNET";
        if (s.equals("AI/ML") || s.equals("AI_ML")) return "AI_ML";
        return s;
    }

    private void createMcqTestsForSkills(Employee employee, List<String> skills) {
        if (skills == null) return;
        for (String skill : skills) {
            String normalizedSkill = normalizeSkill(skill);
            if (MCQ_SKILLS.contains(normalizedSkill)) {
                final String finalSkill = normalizedSkill;
                boolean testExists = employee.getMcqTests().stream()
                        .anyMatch(t -> t.getSkill().equals(finalSkill));
                if (!testExists) {
                    McqTest test = new McqTest();
                    test.setEmployee(employee);
                    test.setSkill(finalSkill);
                    test.setTestDate(LocalDateTime.now());
                    employee.getMcqTests().add(test);
                }
            }
        }
    }

    @Transactional
    public String uploadCertification(String employeeId, String certificationName, MultipartFile file) throws IOException {
        User user = findUser(employeeId);
        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee profile not found"));

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), uploadPath.resolve(fileName));

        Certification certification = new Certification();
        certification.setEmployee(employee);
        certification.setName(certificationName);
        certification.setImagePath(fileName);
        employee.getCertifications().add(certification);
        employeeRepository.save(employee);
        return fileName;
    }

    private static final int MAX_ATTEMPTS = 3;

    @Transactional
    public McqTestResponse generateTest(String employeeId, String skill) {
        User user = findUser(employeeId);
        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee profile not found"));

        // Use direct DB queries — avoids lazy-load stale cache issues
        long totalAttempts = mcqTestRepository.countByEmployeeIdAndSkill(employee.getId(), skill);
        boolean alreadyPassed = mcqTestRepository
                .countByEmployeeIdAndSkillAndStatus(employee.getId(), skill, TestStatus.PASSED) > 0;

        if (alreadyPassed) {
            throw new RuntimeException("You have already passed the " + skill + " test.");
        }
        if (totalAttempts >= MAX_ATTEMPTS) {
            throw new RuntimeException("ATTEMPT_LIMIT_REACHED:" + skill);
        }

        McqTest test = mcqTestRepository
                .findByEmployeeIdAndSkillAndStatus(employee.getId(), skill, TestStatus.PENDING)
                .orElseGet(() -> {
                    // Auto-create PENDING test if missing (handles legacy failed tests without retry record)
                    McqTest retry = new McqTest();
                    retry.setEmployee(employee);
                    retry.setSkill(skill);
                    retry.setTestDate(LocalDateTime.now());
                    retry.setAttemptNumber((int) totalAttempts + 1);
                    return mcqTestRepository.save(retry);
                });

        List<McqQuestion> easy     = mcqQuestionRepository.findRandomQuestionsBySkillAndDifficulty(skill, "EASY",     10);
        List<McqQuestion> moderate = mcqQuestionRepository.findRandomQuestionsBySkillAndDifficulty(skill, "MODERATE", 10);
        List<McqQuestion> advanced = mcqQuestionRepository.findRandomQuestionsBySkillAndDifficulty(skill, "ADVANCED", 10);

        List<McqQuestion> questions = new ArrayList<>();
        questions.addAll(easy);
        questions.addAll(moderate);
        questions.addAll(advanced);
        Collections.shuffle(questions);

        if (questions.size() < 30) {
            throw new RuntimeException("Not enough questions for skill: " + skill);
        }

        McqTestResponse response = new McqTestResponse();
        response.setTestId(test.getId());
        response.setSkill(skill);
        response.setTotalQuestions(30);
        response.setTimeLimit(30);
        response.setQuestions(questions.stream().map(q -> {
            McqQuestionDto dto = new McqQuestionDto();
            dto.setId(q.getId());
            dto.setQuestion(q.getQuestion());
            dto.setOptionA(q.getOptionA());
            dto.setOptionB(q.getOptionB());
            dto.setOptionC(q.getOptionC());
            dto.setOptionD(q.getOptionD());
            dto.setDifficulty(q.getDifficulty().name());
            return dto;
        }).collect(Collectors.toList()));
        return response;
    }

    @Transactional
    public McqTestDto submitTest(String employeeId, TestSubmissionRequest request) {
        User user = findUser(employeeId);
        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee profile not found"));

        McqTest test = mcqTestRepository.findById(request.getTestId())
                .orElseThrow(() -> new RuntimeException("Test not found"));

        int correctAnswers = 0;
        for (Map.Entry<Long, String> entry : request.getAnswers().entrySet()) {
            McqQuestion question = mcqQuestionRepository.findById(entry.getKey()).orElse(null);
            if (question != null && question.getCorrectAnswer().equalsIgnoreCase(entry.getValue())) {
                correctAnswers++;
            }
        }

        int score = (correctAnswers * 100) / 30;
        test.setCorrectAnswers(correctAnswers);
        test.setScore(score);
        test.setCompletedDate(LocalDateTime.now());
        boolean passed = score >= 60;
        test.setStatus(passed ? TestStatus.PASSED : TestStatus.FAILED);
        mcqTestRepository.save(test);

        // Count completed (non-PENDING) attempts for this skill from DB
        long attemptsUsed = mcqTestRepository.countByEmployeeIdAndSkillAndStatus(employee.getId(), test.getSkill(), TestStatus.FAILED)
                + mcqTestRepository.countByEmployeeIdAndSkillAndStatus(employee.getId(), test.getSkill(), TestStatus.PASSED);

        int remainingAttempts = 0;
        if (!passed) {
            remainingAttempts = (int) Math.max(0, MAX_ATTEMPTS - attemptsUsed);
            if (remainingAttempts > 0) {
                McqTest retryTest = new McqTest();
                retryTest.setEmployee(employee);
                retryTest.setSkill(test.getSkill());
                retryTest.setTestDate(LocalDateTime.now());
                retryTest.setAttemptNumber((int) attemptsUsed + 1);
                mcqTestRepository.save(retryTest);
            }
        }

        McqTestDto dto = new McqTestDto();
        dto.setId(test.getId());
        dto.setSkill(test.getSkill());
        dto.setScore(test.getScore());
        dto.setTotalQuestions(test.getTotalQuestions());
        dto.setCorrectAnswers(test.getCorrectAnswers());
        dto.setStatus(test.getStatus().name());
        dto.setTestDate(test.getTestDate());
        dto.setCompletedDate(test.getCompletedDate());
        dto.setAttemptNumber(test.getAttemptNumber() != null ? test.getAttemptNumber() : 1);
        dto.setRemainingAttempts(remainingAttempts);
        return dto;
    }

    @Transactional(readOnly = true)
    public EmployeeProfileResponse getProfile(String employeeId) {
        User user = findUser(employeeId);
        return employeeRepository.findByUserId(user.getId())
                .map(emp -> {
                    // Force-load mcqTests so lockedSkills is populated correctly
                    emp.getMcqTests().size();
                    return EmployeeProfileResponse.from(emp);
                })
                .orElse(null);
    }
}
