package com.unplug.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profile")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Comma-separated trigger types e.g. "BOREDOM,ANXIETY,FOMO"
    private String triggers;

    // Comma-separated replacement habits
    @Column(length = 1000)
    private String replacementHabits;

    // JSON array of if-then intentions
    @Column(length = 2000)
    private String ifThenIntentions;

    private Integer currentPhase = 1;

    private Boolean onboardingComplete = false;

    private LocalDateTime createdAt;

    private LocalDate phaseStartDate;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        phaseStartDate = LocalDate.now();
    }

    public Long getId() { return id; }
    public String getTriggers() { return triggers; }
    public void setTriggers(String triggers) { this.triggers = triggers; }
    public String getReplacementHabits() { return replacementHabits; }
    public void setReplacementHabits(String replacementHabits) { this.replacementHabits = replacementHabits; }
    public String getIfThenIntentions() { return ifThenIntentions; }
    public void setIfThenIntentions(String ifThenIntentions) { this.ifThenIntentions = ifThenIntentions; }
    public Integer getCurrentPhase() { return currentPhase; }
    public void setCurrentPhase(Integer currentPhase) { this.currentPhase = currentPhase; }
    public Boolean getOnboardingComplete() { return onboardingComplete; }
    public void setOnboardingComplete(Boolean onboardingComplete) { this.onboardingComplete = onboardingComplete; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDate getPhaseStartDate() { return phaseStartDate; }
    public void setPhaseStartDate(LocalDate phaseStartDate) { this.phaseStartDate = phaseStartDate; }
}
