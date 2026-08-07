package com.unplug.dto;

import com.unplug.model.DailyCheckIn;
import com.unplug.model.UrgeLog;

import java.util.List;
import java.util.Map;

public class DashboardResponse {
    private int currentPhase;
    private int dayInProgram;
    private int checkInStreak;
    private int longestCheckInStreak;
    private int urgeSurfedStreak;
    private long totalUrges7Days;
    private long resistedUrges7Days;
    private double resistanceRate7Days;
    private Map<String, Long> triggerBreakdown7Days;
    private List<DailyCheckIn> todayCheckIns;
    private List<UrgeLog> recentUrges;
    private boolean morningCheckInDone;
    private boolean eveningCheckInDone;

    public int getCurrentPhase() { return currentPhase; }
    public void setCurrentPhase(int currentPhase) { this.currentPhase = currentPhase; }
    public int getDayInProgram() { return dayInProgram; }
    public void setDayInProgram(int dayInProgram) { this.dayInProgram = dayInProgram; }
    public int getCheckInStreak() { return checkInStreak; }
    public void setCheckInStreak(int checkInStreak) { this.checkInStreak = checkInStreak; }
    public int getLongestCheckInStreak() { return longestCheckInStreak; }
    public void setLongestCheckInStreak(int longestCheckInStreak) { this.longestCheckInStreak = longestCheckInStreak; }
    public int getUrgeSurfedStreak() { return urgeSurfedStreak; }
    public void setUrgeSurfedStreak(int urgeSurfedStreak) { this.urgeSurfedStreak = urgeSurfedStreak; }
    public long getTotalUrges7Days() { return totalUrges7Days; }
    public void setTotalUrges7Days(long totalUrges7Days) { this.totalUrges7Days = totalUrges7Days; }
    public long getResistedUrges7Days() { return resistedUrges7Days; }
    public void setResistedUrges7Days(long resistedUrges7Days) { this.resistedUrges7Days = resistedUrges7Days; }
    public double getResistanceRate7Days() { return resistanceRate7Days; }
    public void setResistanceRate7Days(double resistanceRate7Days) { this.resistanceRate7Days = resistanceRate7Days; }
    public Map<String, Long> getTriggerBreakdown7Days() { return triggerBreakdown7Days; }
    public void setTriggerBreakdown7Days(Map<String, Long> triggerBreakdown7Days) { this.triggerBreakdown7Days = triggerBreakdown7Days; }
    public List<DailyCheckIn> getTodayCheckIns() { return todayCheckIns; }
    public void setTodayCheckIns(List<DailyCheckIn> todayCheckIns) { this.todayCheckIns = todayCheckIns; }
    public List<UrgeLog> getRecentUrges() { return recentUrges; }
    public void setRecentUrges(List<UrgeLog> recentUrges) { this.recentUrges = recentUrges; }
    public boolean isMorningCheckInDone() { return morningCheckInDone; }
    public void setMorningCheckInDone(boolean morningCheckInDone) { this.morningCheckInDone = morningCheckInDone; }
    public boolean isEveningCheckInDone() { return eveningCheckInDone; }
    public void setEveningCheckInDone(boolean eveningCheckInDone) { this.eveningCheckInDone = eveningCheckInDone; }
}
