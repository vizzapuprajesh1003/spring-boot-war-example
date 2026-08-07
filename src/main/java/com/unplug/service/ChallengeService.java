package com.unplug.service;

import com.unplug.model.Challenge;
import com.unplug.model.ChallengeCompletion;
import com.unplug.repository.ChallengeCompletionRepository;
import com.unplug.repository.ChallengeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ChallengeService {

    private final ChallengeRepository challengeRepo;
    private final ChallengeCompletionRepository completionRepo;

    public ChallengeService(ChallengeRepository challengeRepo,
                            ChallengeCompletionRepository completionRepo) {
        this.challengeRepo = challengeRepo;
        this.completionRepo = completionRepo;
    }

    public List<Challenge> getChallengesForPhase(int phase) {
        return challengeRepo.findByPhaseOrderByOrderIndex(phase);
    }

    public Challenge getCurrentChallenge(int phase) {
        List<Challenge> all = challengeRepo.findByPhaseOrderByOrderIndex(phase);
        Set<Long> completedIds = completionRepo.findAllByOrderByCompletedAtDesc()
                .stream().map(ChallengeCompletion::getChallengeId).collect(Collectors.toSet());
        return all.stream()
                .filter(c -> !completedIds.contains(c.getId()))
                .findFirst()
                .orElse(all.isEmpty() ? null : all.get(all.size() - 1));
    }

    public ChallengeCompletion complete(Long challengeId, String note) {
        ChallengeCompletion cc = new ChallengeCompletion();
        cc.setChallengeId(challengeId);
        cc.setNote(note);
        return completionRepo.save(cc);
    }

    public List<ChallengeCompletion> getCompletions() {
        return completionRepo.findAllByOrderByCompletedAtDesc();
    }

    public Set<Long> getCompletedIds() {
        return completionRepo.findAllByOrderByCompletedAtDesc()
                .stream().map(ChallengeCompletion::getChallengeId).collect(Collectors.toSet());
    }

    public void seedChallengesIfEmpty() {
        if (challengeRepo.count() > 0) return;

        String[][] data = {
            // Phase 1 - Awareness
            {"1","1","AWARENESS","Notice Your Patterns","For the next 24 hours, every time you feel the urge to check social media, pause and ask yourself: why am I reaching for my phone right now? Just observe — no judgment.","5"},
            {"1","2","AWARENESS","Name Your Triggers","After logging 5 urges, look at your trigger history. What's your #1 trigger? Write one sentence about it in the notes.","5"},
            {"1","3","AWARENESS","The Phone-Free Meal","Eat one complete meal today without your phone. Notice how it feels to just sit with your food and your thoughts.","20"},
            {"1","4","AWARENESS","Morning Audit","Before you check your phone tomorrow morning, notice: how many seconds pass from waking up until you pick it up? Log it.","5"},
            {"1","5","AWARENESS","Count Your Pickups","Manually count how many times you pick up your phone in one hour. No judgment, just data.","60"},
            {"1","6","AWARENESS","Your Usage Story","Write 3 sentences: when do you use your phone most? How does it make you feel? What are you avoiding?","10"},
            {"1","7","AWARENESS","Notification Triage","Go through your notification settings and turn off notifications for every app that isn't essential (calls, messages from family). Aim to reduce by at least half.","15"},
            // Phase 2 - Friction
            {"2","1","FRICTION","The 5-Minute Rule","Every time you feel the urge, wait exactly 5 minutes before picking up your phone. Set a timer. If the urge passes, log it as resisted.","5"},
            {"2","2","FRICTION","Breathing Surf","Complete the full 90-second breathing exercise in the Urge Surfer at least 3 times today when an urge hits.","10"},
            {"2","3","FRICTION","Bedroom Detox","Tonight, charge your phone outside your bedroom. If you don't have an alarm clock, use your phone's alarm but set it to flight mode.","0"},
            {"2","4","FRICTION","Greyscale Evening","Enable greyscale mode on your phone from 8pm tonight. Notice if your urge to scroll changes.","5"},
            {"2","5","FRICTION","App Relocation","Move all social media apps off your home screen into a folder called 'Later'. Observe how the extra tap changes your behavior.","5"},
            {"2","6","BOREDOM","Sit With Boredom","Deliberately sit without your phone or any stimulation for 10 full minutes. No music, no book, no conversation. Just sit. Notice the discomfort — it will pass.","10"},
            {"2","7","BOREDOM","Queue Without Phone","Next time you're waiting in line or a waiting room, leave your phone in your pocket for the entire wait. Notice what your mind does.","0"},
            // Phase 3 - Structure
            {"3","1","STRUCTURE","Define Your Check-In Windows","Set 3 specific times today when you're allowed to check social media (e.g., 10am, 1pm, 6pm). Outside those windows, it's closed.","10"},
            {"3","2","STRUCTURE","Phone-Free Morning","Don't check your phone for the first 30 minutes after waking up. Do something else — drink water, stretch, journal, shower.","30"},
            {"3","3","STRUCTURE","The 1-Hour Digital Sunset","Put your phone away completely 1 hour before bed for 3 consecutive days.","60"},
            {"3","4","STRUCTURE","If-Then Refresh","Review your if-then intentions from onboarding. Are they still relevant? Update them if needed and commit to one new one.","10"},
            {"3","5","BOREDOM","Boredom Sprint","Set a timer for 15 minutes. Sit in a quiet place with no phone, no TV, no stimulation. Just be present. Do this every day for 3 days.","15"},
            {"3","6","STRUCTURE","Social Media Budget","Set a personal daily time budget for social media (e.g., 20 minutes). Use a phone screen time tool or just a timer to enforce it for 3 days.","5"},
            {"3","7","REFLECTION","The Weekly Review","Write a short reflection: what triggered you most this week? When were you most successful? What do you want to do differently?","15"},
            // Phase 4 - Maintenance
            {"4","1","REFLECTION","Monthly Audit","Look at your urge logs from the last 30 days. What has improved? What patterns remain? What will you work on this month?","20"},
            {"4","2","STRUCTURE","Digital Minimalism Experiment","For one full day, only use your phone for essential communication and navigation. No social media, no news, no entertainment apps.","480"},
            {"4","3","BOREDOM","Analog Saturday","One morning this week, keep your phone in a drawer from when you wake up until noon. Fill the time with anything physical or social.","240"},
            {"4","4","REFLECTION","The Gratitude Reframe","Write down 3 things you gained by reducing phone use. Time? Presence? Sleep? Relationships? Read this when you feel tempted to slip back.","10"},
            {"4","5","STRUCTURE","Teach Someone Else","Share one technique from your journey with someone who might benefit. Teaching reinforces your own commitment.","15"},
        };

        for (String[] row : data) {
            Challenge c = new Challenge();
            c.setPhase(Integer.parseInt(row[0]));
            c.setOrderIndex(Integer.parseInt(row[1]));
            c.setCategory(row[2]);
            c.setTitle(row[3]);
            c.setDescription(row[4]);
            c.setDurationMinutes(Integer.parseInt(row[5]));
            challengeRepo.save(c);
        }
    }
}
