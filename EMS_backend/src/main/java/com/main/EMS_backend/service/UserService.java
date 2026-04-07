package com.main.EMS_backend.service;

import com.main.EMS_backend.entity.User;
import com.main.EMS_backend.exception.UserNotFoundException;
import com.main.EMS_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public void registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }
    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }
    public long countUsers(String role) {
        return userRepository.countByRole(role);
    }
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    public void changeRole(Long id) {
        User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException("User not found"));
        user.setRole("USER");
        userRepository.save(user);
    }
}
