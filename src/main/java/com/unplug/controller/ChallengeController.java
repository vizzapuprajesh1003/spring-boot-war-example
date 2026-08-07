package com.unplug.controller;

import com.unplug.model.Challenge;
import com.unplug.model.ChallengeCompletion;
import com.unplug.service.ChallengeService;
import com.unplug.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    private final ChallengeService service;
    private final UserService userService;

    public ChallengeController(ChallengeService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @GetMapping
    public List<Challenge> list() {
        int phase = userService.getProfile().map(p -> p.getCurrentPhase()).orElse(1);
        return service.getChallengesForPhase(phase);
    }

    @GetMapping("/current")
    public Challenge current() {
        int phase = userService.getProfile().map(p -> p.getCurrentPhase()).orElse(1);
        return service.getCurrentChallenge(phase);
    }

    @GetMapping("/completed-ids")
    public Set<Long> completedIds() {
        return service.getCompletedIds();
    }

    @PostMapping("/{id}/complete")
    public ChallengeCompletion complete(@PathVariable Long id,
                                        @RequestBody(required = false) Map<String, String> body) {
        String note = body != null ? body.get("note") : null;
        return service.complete(id, note);
    }

    @GetMapping("/completions")
    public List<ChallengeCompletion> completions() {
        return service.getCompletions();
    }
}
