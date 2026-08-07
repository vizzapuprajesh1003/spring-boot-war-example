package com.unplug.service;

import com.unplug.dto.CheckInRequest;
import com.unplug.model.DailyCheckIn;
import com.unplug.repository.DailyCheckInRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CheckInService {

    private final DailyCheckInRepository repo;
    private final StreakService streakService;

    public CheckInService(DailyCheckInRepository repo, StreakService streakService) {
        this.repo = repo;
        this.streakService = streakService;
    }

    public DailyCheckIn saveCheckIn(CheckInRequest req) {
        DailyCheckIn ci = new DailyCheckIn();
        ci.setType(req.getType());
        ci.setIntention(req.getIntention());
        ci.setMoodRating(req.getMoodRating());
        ci.setAnxietyRating(req.getAnxietyRating());
        ci.setUrgesResisted(req.getUrgesResisted());
        ci.setReflectionNote(req.getReflectionNote());
        DailyCheckIn saved = repo.save(ci);
        streakService.recordActivity("CHECK_IN");
        return saved;
    }

    public List<DailyCheckIn> getToday() {
        return repo.findByCheckInDate(LocalDate.now());
    }

    public List<DailyCheckIn> getHistory(int days) {
        return repo.findByCheckInDateAfterOrderByCheckInDateDesc(
                LocalDate.now().minusDays(days));
    }

    public boolean isMorningDone() {
        return repo.existsByCheckInDateAndType(LocalDate.now(), "MORNING");
    }

    public boolean isEveningDone() {
        return repo.existsByCheckInDateAndType(LocalDate.now(), "EVENING");
    }
}
