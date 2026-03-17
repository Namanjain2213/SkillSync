package com.rmg.employee.service;

import com.rmg.employee.dto.*;
import com.rmg.employee.model.*;
import com.rmg.employee.repository.EmployeeRepository;
import com.rmg.employee.repository.McqQuestionRepository;
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
        employee.setSkills(request.getSkills());
        employee.setUpdatedAt(LocalDateTime.now());

        employee = employeeRepository.save(employee);
        createMcqTestsForSkills(employee, request.getSkills());
        employee = employeeRepository.save(employee);

        return EmployeeProfileResponse.from(employee);
    }

    private void createMcqTestsForSkills(Employee employee, List<String> skills) {
        if (skills == null) return;
        for (String skill : skills) {
            String normalizedSkill = skill.toUpperCase().replace(" ", "_").replace(".", "");
            if (normalizedSkill.equals("NET") || normalizedSkill.equals("DOTNET") || skill.equalsIgnoreCase(".NET")) {
                normalizedSkill = "DOTNET";
            }
            if (normalizedSkill.equals("AI/ML") || normalizedSkill.equals("AI_ML")) {
                normalizedSkill = "AI_ML";
            }
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

    @Transactional(readOnly = true)
    public McqTestResponse generateTest(String employeeId, String skill) {
        User user = findUser(employeeId);
        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee profile not found"));

        McqTest test = employee.getMcqTests().stream()
                .filter(t -> t.getSkill().equals(skill) && t.getStatus() == TestStatus.PENDING)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Test not found or already completed for skill: " + skill));

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

        McqTest test = employee.getMcqTests().stream()
                .filter(t -> t.getId().equals(request.getTestId()))
                .findFirst()
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
        test.setStatus(score >= 60 ? TestStatus.PASSED : TestStatus.FAILED);
        employeeRepository.save(employee);

        McqTestDto dto = new McqTestDto();
        dto.setId(test.getId());
        dto.setSkill(test.getSkill());
        dto.setScore(test.getScore());
        dto.setTotalQuestions(test.getTotalQuestions());
        dto.setCorrectAnswers(test.getCorrectAnswers());
        dto.setStatus(test.getStatus().name());
        dto.setTestDate(test.getTestDate());
        dto.setCompletedDate(test.getCompletedDate());
        return dto;
    }

    @Transactional(readOnly = true)
    public EmployeeProfileResponse getProfile(String employeeId) {
        User user = findUser(employeeId);
        return employeeRepository.findByUserId(user.getId())
                .map(EmployeeProfileResponse::from)
                .orElse(null);
    }
}
