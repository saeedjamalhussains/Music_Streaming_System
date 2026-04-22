package com.spring.online.demo.service;

import com.spring.online.demo.domain.entity.User;
import com.spring.online.demo.domain.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final int TOKEN_EXPIRY_SECONDS = 3600;
    private static final SecureRandom OTP_RANDOM = new SecureRandom();

    private final Map<String, String> otpStore = new ConcurrentHashMap<>();
    private final UserRepository userRepository;
    private final JwtManager jwtManager;
    private final JavaMailSender mailSender;

    @Autowired
    public UserService(UserRepository userRepository, JwtManager jwtManager, JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.jwtManager = jwtManager;
        this.mailSender = mailSender;
    }

    public Map<String, Object> addUser(User user) throws MessagingException {
        Map<String, Object> response = new HashMap<>();

        if (userRepository.existsByEmail(user.getEmail())) {
            response.put("status", "error");
            response.put("message", "Email already exists");
            return response;
        }

        String storedOtp = otpStore.get(user.getEmail());
        if (user.getOtp() == null || !user.getOtp().equals(storedOtp)) {
            response.put("status", "error");
            response.put("message", "Invalid or expired OTP");
            return response;
        }

        otpStore.remove(user.getEmail());
        user.setRole(user.getRole() == null ? "USER" : user.getRole().toUpperCase());
        User savedUser = userRepository.save(user);
        return buildAuthSuccessResponse(savedUser);
    }

    public Map<String, Object> validateUser(String email, String password) throws MessagingException {
        Map<String, Object> response = new HashMap<>();
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password))
                .map(this::buildAuthSuccessResponse)
                .orElseGet(() -> {
                    response.put("status", "error");
                    response.put("message", "Invalid Credentials");
                    return response;
                });
    }

    public User getUserById(int id) {
        return userRepository.findById(id).orElse(null);
    }

    public Map<String, Object> generateAndSendOtp(String email) throws MessagingException {
        Map<String, Object> response = new HashMap<>();
        if (userRepository.existsByEmail(email)) {
            response.put("status", "error");
            response.put("message", "Email already registered");
            return response;
        }

        String otp = String.format("%06d", OTP_RANDOM.nextInt(1_000_000));
        otpStore.put(email, otp);

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
        String htmlContent = String.format(
                "<!DOCTYPE html><html><body>"
                        + "<h2>Your Verification Code</h2>"
                        + "<p>Your OTP for signing up to TuneUp is: <strong>%s</strong></p>"
                        + "<p>Please enter this code to complete your registration.</p>"
                        + "</body></html>",
                otp);

        helper.setTo(email);
        helper.setSubject("TuneUp Verification Code");
        helper.setText(htmlContent, true);
        mailSender.send(mimeMessage);

        response.put("status", "success");
        response.put("message", "OTP sent to email");
        return response;
    }

    public String sendMail(String email) throws MessagingException {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return "User not found";
        }

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
        String htmlContent = String.format(
                "<!DOCTYPE html><html><body><h2>Welcome to TuneUp, %s!</h2></body></html>",
                user.getUsername());

        helper.setTo(email);
        helper.setSubject("Welcome to TuneUp!");
        helper.setText(htmlContent, true);
        mailSender.send(mimeMessage);
        return "Mail Sent Successfully";
    }

    private Map<String, Object> buildAuthSuccessResponse(User user) {
        Map<String, Object> response = new HashMap<>();
        String token = jwtManager.generateToken(user.getEmail(), String.valueOf(user.getRole()));
        response.put("token", token);
        response.put("user", user);
        response.put("expiresIn", TOKEN_EXPIRY_SECONDS);
        response.put("status", "success");
        return response;
    }
}
