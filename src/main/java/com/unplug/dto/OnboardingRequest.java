package com.unplug.dto;

import java.util.List;

public class OnboardingRequest {
    private List<String> triggers;
    private List<String> replacementHabits;
    private List<String> ifThenIntentions;

    public List<String> getTriggers() { return triggers; }
    public void setTriggers(List<String> triggers) { this.triggers = triggers; }
    public List<String> getReplacementHabits() { return replacementHabits; }
    public void setReplacementHabits(List<String> replacementHabits) { this.replacementHabits = replacementHabits; }
    public List<String> getIfThenIntentions() { return ifThenIntentions; }
    public void setIfThenIntentions(List<String> ifThenIntentions) { this.ifThenIntentions = ifThenIntentions; }
}
