package com.unplug.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_checkin")
public class DailyCheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate checkInDate;

    // MORNING | EVENING
    private String type;

    @Column(length = 500)
    private String intention;

    private Integer moodRating;

    private Integer anxietyRating;

    private Integer urgesResisted;

    @Column(length = 1000)
    private String reflectionNote;

    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        if (checkInDate == null) checkInDate = LocalDate.now();
    }

    public Long getId() { return id; }
    public LocalDate getCheckInDate() { return checkInDate; }
    public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getIntention() { return intention; }
    public void setIntention(String intention) { this.intention = intention; }
    public Integer getMoodRating() { return moodRating; }
    public void setMoodRating(Integer moodRating) { this.moodRating = moodRating; }
    public Integer getAnxietyRating() { return anxietyRating; }
    public void setAnxietyRating(Integer anxietyRating) { this.anxietyRating = anxietyRating; }
    public Integer getUrgesResisted() { return urgesResisted; }
    public void setUrgesResisted(Integer urgesResisted) { this.urgesResisted = urgesResisted; }
    public String getReflectionNote() { return reflectionNote; }
    public void setReflectionNote(String reflectionNote) { this.reflectionNote = reflectionNote; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
