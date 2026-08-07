package com.unplug.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "urge_log")
public class UrgeLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime triggeredAt;

    // BOREDOM | ANXIETY | HABIT | FOMO | LONELINESS | OTHER
    private String triggerType;

    private Boolean resisted;

    private String replacementUsed;

    @Column(length = 500)
    private String notes;

    @PrePersist
    void onCreate() {
        if (triggeredAt == null) triggeredAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public LocalDateTime getTriggeredAt() { return triggeredAt; }
    public void setTriggeredAt(LocalDateTime triggeredAt) { this.triggeredAt = triggeredAt; }
    public String getTriggerType() { return triggerType; }
    public void setTriggerType(String triggerType) { this.triggerType = triggerType; }
    public Boolean getResisted() { return resisted; }
    public void setResisted(Boolean resisted) { this.resisted = resisted; }
    public String getReplacementUsed() { return replacementUsed; }
    public void setReplacementUsed(String replacementUsed) { this.replacementUsed = replacementUsed; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
