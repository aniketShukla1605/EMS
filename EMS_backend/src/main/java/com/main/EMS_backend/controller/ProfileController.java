package com.main.EMS_backend.controller;

import com.main.EMS_backend.dto.ChangePasswordRequest;
import com.main.EMS_backend.dto.ProfileResponse;
import com.main.EMS_backend.dto.UpdateProfileRequest;
import com.main.EMS_backend.entity.User;
import com.main.EMS_backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin("http://localhost:5173")
@Slf4j
public class ProfileController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/upload-profile")
    public ResponseEntity<?> uploadProfile(@RequestParam("file") MultipartFile file, Authentication authentication) throws IOException {
        String uploadDir = "uploads/profilePictures/";
        File folder = new File(uploadDir);
        if(!folder.exists())
            folder.mkdir();
        String fileName = System.currentTimeMillis() + "." + file.getOriginalFilename();
        Path path = Paths.get(uploadDir + fileName);
        Files.write(path, file.getBytes());
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        user.setProfilePicture("/uploads/profilePictures/" + fileName);
        userRepository.save(user);
        return ResponseEntity.ok(user.getProfilePicture());
    }



    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        ProfileResponse profileResponse = new ProfileResponse();
        profileResponse.setEmail(user.getEmail());
        profileResponse.setUsername(user.getUsername());
        profileResponse.setBranch(user.getBranch());
        profileResponse.setInstituteID(user.getInstituteID());
        profileResponse.setAddress(user.getAddress());
        profileResponse.setRole(user.getRole());
        profileResponse.setContact(user.getContact());
        profileResponse.setProfilePicture(user.getProfilePicture());

        return ResponseEntity.ok(profileResponse);
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        user.setUsername(request.getUsername());
        user.setBranch(request.getBranch());
        user.setInstituteID(request.getInstituteID());
        user.setContact(request.getContact());
        user.setAddress(request.getAddress());
        userRepository.save(user);

        return ResponseEntity.ok("Profile updated successfully");
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        if(!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Incorrect current password");

        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("Password changed successfully");
    }

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ChangePasswordRequest request, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("Password reset successfully");
    }
}