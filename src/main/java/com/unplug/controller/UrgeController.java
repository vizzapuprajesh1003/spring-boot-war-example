package com.unplug.controller;

import com.unplug.dto.UrgeLogRequest;
import com.unplug.model.UrgeLog;
import com.unplug.service.UrgeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/urges")
public class UrgeController {

    private final UrgeService service;

    public UrgeController(UrgeService service) {
        this.service = service;
    }

    @PostMapping
    public UrgeLog log(@RequestBody UrgeLogRequest req) {
        return service.logUrge(req);
    }

    @GetMapping
    public List<UrgeLog> recent(@RequestParam(defaultValue = "7") int days) {
        return service.getRecent(days);
    }

    @GetMapping("/stats")
    public Map<String, Object> stats(@RequestParam(defaultValue = "7") int days) {
        return service.getStats(days);
    }
}
