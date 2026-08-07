package com.unplug.service;

import com.unplug.model.Streak;
import com.unplug.repository.StreakRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class StreakService {

    private final StreakRepository repo;

    public StreakService(StreakRepository repo) {
        this.repo = repo;
    }

    public void recordActivity(String streakType) {
        Streak streak = repo.findByStreakType(streakType).orElseGet(() -> {
            Streak s = new Streak();
            s.setStreakType(streakType);
            return s;
        });

        LocalDate today = LocalDate.now();
        LocalDate last = streak.getLastActivityDate();

        if (last == null) {
            streak.setCurrentStreak(1);
        } else if (last.equals(today)) {
            // Already recorded today — no change
        } else if (last.equals(today.minusDays(1))) {
            streak.setCurrentStreak(streak.getCurrentStreak() + 1);
        } else {
            // Streak broken
            streak.setCurrentStreak(1);
        }

        streak.setLastActivityDate(today);
        repo.save(streak);
    }

    public boolean useFreeze(String streakType) {
        Streak streak = repo.findByStreakType(streakType).orElse(null);
        if (streak == null || streak.getFreezesAvailable() <= 0) return false;
        streak.setFreezesAvailable(streak.getFreezesAvailable() - 1);
        streak.setFreezesUsed(streak.getFreezesUsed() + 1);
        // Don't reset streak, just keep the last date as yesterday
        streak.setLastActivityDate(LocalDate.now().minusDays(1));
        repo.save(streak);
        return true;
    }

    public List<Streak> getAllStreaks() {
        return repo.findAll();
    }

    public int getCurrentStreak(String streakType) {
        return repo.findByStreakType(streakType)
                .map(Streak::getCurrentStreak)
                .orElse(0);
    }

    public int getLongestStreak(String streakType) {
        return repo.findByStreakType(streakType)
                .map(Streak::getLongestStreak)
                .orElse(0);
    }
}
