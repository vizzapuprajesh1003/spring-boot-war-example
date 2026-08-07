package com.unplug.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "streak")
public class Streak {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // CHECK_IN | URGE_SURFED
    private String streakType;

    private Integer currentStreak = 0;

    private Integer longestStreak = 0;

    private LocalDate lastActivityDate;

    private Integer freezesAvailable = 1;

    private Integer freezesUsed = 0;

    public Long getId() { return id; }
    public String getStreakType() { return streakType; }
    public void setStreakType(String streakType) { this.streakType = streakType; }
    public Integer getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(Integer currentStreak) {
        this.currentStreak = currentStreak;
        if (currentStreak > this.longestStreak) this.longestStreak = currentStreak;
    }
    public Integer getLongestStreak() { return longestStreak; }
    public void setLongestStreak(Integer longestStreak) { this.longestStreak = longestStreak; }
    public LocalDate getLastActivityDate() { return lastActivityDate; }
    public void setLastActivityDate(LocalDate lastActivityDate) { this.lastActivityDate = lastActivityDate; }
    public Integer getFreezesAvailable() { return freezesAvailable; }
    public void setFreezesAvailable(Integer freezesAvailable) { this.freezesAvailable = freezesAvailable; }
    public Integer getFreezesUsed() { return freezesUsed; }
    public void setFreezesUsed(Integer freezesUsed) { this.freezesUsed = freezesUsed; }
}
