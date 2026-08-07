package com.unplug.controller;

import com.unplug.dto.OnboardingRequest;
import com.unplug.model.UserProfile;
import com.unplug.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }

    @GetMapping("/status")
    public Map<String, Object> status() {
        boolean setup = service.isSetupComplete();
        int phase = service.getProfile().map(UserProfile::getCurrentPhase).orElse(0);
        return Map.of("setup", setup, "phase", phase);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfile> profile() {
        return service.getProfile()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/setup")
    public UserProfile setup(@RequestBody OnboardingRequest req) {
        return service.setupProfile(req);
    }

    @PostMapping("/advance-phase")
    public UserProfile advancePhase() {
        return service.advancePhase();
    }
}
