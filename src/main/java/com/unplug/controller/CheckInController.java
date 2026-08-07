package com.unplug.controller;

import com.unplug.dto.CheckInRequest;
import com.unplug.model.DailyCheckIn;
import com.unplug.service.CheckInService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/checkins")
public class CheckInController {

    private final CheckInService service;

    public CheckInController(CheckInService service) {
        this.service = service;
    }

    @PostMapping
    public DailyCheckIn save(@RequestBody CheckInRequest req) {
        return service.saveCheckIn(req);
    }

    @GetMapping("/today")
    public List<DailyCheckIn> today() {
        return service.getToday();
    }

    @GetMapping("/history")
    public List<DailyCheckIn> history(@RequestParam(defaultValue = "30") int days) {
        return service.getHistory(days);
    }
}
