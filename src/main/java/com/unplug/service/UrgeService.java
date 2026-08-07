package com.unplug.service;

import com.unplug.dto.UrgeLogRequest;
import com.unplug.model.UrgeLog;
import com.unplug.repository.UrgeLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class UrgeService {

    private final UrgeLogRepository repo;
    private final StreakService streakService;

    public UrgeService(UrgeLogRepository repo, StreakService streakService) {
        this.repo = repo;
        this.streakService = streakService;
    }

    public UrgeLog logUrge(UrgeLogRequest req) {
        UrgeLog urge = new UrgeLog();
        urge.setTriggerType(req.getTriggerType());
        urge.setResisted(req.getResisted() != null ? req.getResisted() : false);
        urge.setReplacementUsed(req.getReplacementUsed());
        urge.setNotes(req.getNotes());
        UrgeLog saved = repo.save(urge);
        if (Boolean.TRUE.equals(saved.getResisted())) {
            streakService.recordActivity("URGE_SURFED");
        }
        return saved;
    }

    public List<UrgeLog> getRecent(int days) {
        return repo.findByTriggeredAtAfterOrderByTriggeredAtDesc(
                LocalDateTime.now().minusDays(days));
    }

    public Map<String, Object> getStats(int days) {
        LocalDateTime from = LocalDateTime.now().minusDays(days);
        long total = repo.countSince(from);
        long resisted = repo.countResistedSince(from);
        double rate = total > 0 ? Math.round((resisted * 100.0 / total) * 10.0) / 10.0 : 0;

        List<Object[]> breakdown = repo.countByTriggerTypeSince(from);
        Map<String, Long> triggerMap = new LinkedHashMap<>();
        for (Object[] row : breakdown) {
            triggerMap.put((String) row[0], (Long) row[1]);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalUrges", total);
        result.put("resistedUrges", resisted);
        result.put("resistanceRate", rate);
        result.put("triggerBreakdown", triggerMap);
        return result;
    }
}
