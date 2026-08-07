package com.unplug.controller;

import com.unplug.dto.DashboardResponse;
import com.unplug.model.UserProfile;
import com.unplug.repository.UrgeLogRepository;
import com.unplug.service.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserService userService;
    private final UrgeService urgeService;
    private final CheckInService checkInService;
    private final StreakService streakService;
    private final UrgeLogRepository urgeLogRepo;

    public DashboardController(UserService userService, UrgeService urgeService,
                                CheckInService checkInService, StreakService streakService,
                                UrgeLogRepository urgeLogRepo) {
        this.userService = userService;
        this.urgeService = urgeService;
        this.checkInService = checkInService;
        this.streakService = streakService;
        this.urgeLogRepo = urgeLogRepo;
    }

    @GetMapping
    public DashboardResponse get() {
        DashboardResponse resp = new DashboardResponse();

        UserProfile profile = userService.getProfile().orElse(null);
        if (profile == null) return resp;

        resp.setCurrentPhase(profile.getCurrentPhase());

        long dayInProgram = profile.getCreatedAt() != null
                ? ChronoUnit.DAYS.between(profile.getCreatedAt().toLocalDate(), LocalDate.now()) + 1
                : 1;
        resp.setDayInProgram((int) dayInProgram);

        resp.setCheckInStreak(streakService.getCurrentStreak("CHECK_IN"));
        resp.setLongestCheckInStreak(streakService.getLongestStreak("CHECK_IN"));
        resp.setUrgeSurfedStreak(streakService.getCurrentStreak("URGE_SURFED"));

        LocalDateTime from7 = LocalDateTime.now().minusDays(7);
        long total = urgeLogRepo.countSince(from7);
        long resisted = urgeLogRepo.countResistedSince(from7);
        resp.setTotalUrges7Days(total);
        resp.setResistedUrges7Days(resisted);
        resp.setResistanceRate7Days(total > 0 ? Math.round((resisted * 100.0 / total) * 10.0) / 10.0 : 0);

        List<Object[]> breakdown = urgeLogRepo.countByTriggerTypeSince(from7);
        Map<String, Long> triggerMap = new LinkedHashMap<>();
        for (Object[] row : breakdown) triggerMap.put((String) row[0], (Long) row[1]);
        resp.setTriggerBreakdown7Days(triggerMap);

        resp.setTodayCheckIns(checkInService.getToday());
        resp.setRecentUrges(urgeService.getRecent(3));
        resp.setMorningCheckInDone(checkInService.isMorningDone());
        resp.setEveningCheckInDone(checkInService.isEveningDone());

        return resp;
    }
}
