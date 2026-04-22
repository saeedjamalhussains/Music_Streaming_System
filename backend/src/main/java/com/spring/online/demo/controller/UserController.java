package com.spring.online.demo.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.online.demo.domain.entity.User;
import com.spring.online.demo.service.UserService;

import jakarta.mail.MessagingException;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/send-otp")
    public Map<String, Object> sendOtp(@RequestBody Map<String, String> request) throws MessagingException {
        String email = request.get("email");
        return userService.generateAndSendOtp(email);
    }

    @PostMapping("/signup")
    public Map<String, Object> addUser(@RequestBody User user) throws MessagingException {
        return userService.addUser(user);
    }

    @PostMapping("/signin")
    public Map<String, Object> signin(@RequestBody User user) throws MessagingException {
        return userService.validateUser(user.getEmail(), user.getPassword());
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable int id) {
        return userService.getUserById(id);
    }

}
