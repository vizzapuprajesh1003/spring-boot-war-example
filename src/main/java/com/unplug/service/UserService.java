package com.unplug.service;

import com.unplug.dto.OnboardingRequest;
import com.unplug.model.UserProfile;
import com.unplug.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserProfileRepository repo;
    private final ChallengeService challengeService;

    public UserService(UserProfileRepository repo, ChallengeService challengeService) {
        this.repo = repo;
        this.challengeService = challengeService;
    }

    public Optional<UserProfile> getProfile() {
        return repo.findAll().stream().findFirst();
    }

    public UserProfile setupProfile(OnboardingRequest req) {
        UserProfile profile = getProfile().orElse(new UserProfile());
        profile.setTriggers(String.join(",", req.getTriggers()));
        profile.setReplacementHabits(String.join(",", req.getReplacementHabits()));
        if (req.getIfThenIntentions() != null) {
            profile.setIfThenIntentions(String.join("||", req.getIfThenIntentions()));
        }
        profile.setOnboardingComplete(true);
        profile.setCurrentPhase(1);
        UserProfile saved = repo.save(profile);
        challengeService.seedChallengesIfEmpty();
        return saved;
    }

    public UserProfile advancePhase() {
        UserProfile profile = getProfile().orElseThrow(() -> new RuntimeException("No profile found"));
        int next = Math.min(profile.getCurrentPhase() + 1, 4);
        profile.setCurrentPhase(next);
        return repo.save(profile);
    }

    public boolean isSetupComplete() {
        return getProfile().map(UserProfile::getOnboardingComplete).orElse(false);
    }
}
