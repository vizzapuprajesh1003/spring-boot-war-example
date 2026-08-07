package com.unplug.dto;

public class UrgeLogRequest {
    private String triggerType;
    private Boolean resisted;
    private String replacementUsed;
    private String notes;

    public String getTriggerType() { return triggerType; }
    public void setTriggerType(String triggerType) { this.triggerType = triggerType; }
    public Boolean getResisted() { return resisted; }
    public void setResisted(Boolean resisted) { this.resisted = resisted; }
    public String getReplacementUsed() { return replacementUsed; }
    public void setReplacementUsed(String replacementUsed) { this.replacementUsed = replacementUsed; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
