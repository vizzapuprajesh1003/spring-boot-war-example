package com.unplug.dto;

public class CheckInRequest {
    private String type; // MORNING | EVENING
    private String intention;
    private Integer moodRating;
    private Integer anxietyRating;
    private Integer urgesResisted;
    private String reflectionNote;

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
}
