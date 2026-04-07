package com.main.EMS_backend.controller;

import com.main.EMS_backend.service.DashboardService;
import com.main.EMS_backend.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin("http://localhost:5173")
@Slf4j
public class AdminUserController {
    @Autowired
    private UserService userService;
    @GetMapping("/{role}")
    public ResponseEntity<?> getUsers(@PathVariable String role) {
        return ResponseEntity.ok(userService.getUsersByRole(role));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("USER DELETED");
    }
    @PutMapping("/demote/{id}")
    public ResponseEntity<?> demote(@PathVariable Long id) {
        userService.changeRole(id);
        return ResponseEntity.ok("ROLE CHANGED");
    }

    @Autowired
    private DashboardService dashboardService;
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }
}
