package com.unplug.repository;

import com.unplug.model.ChallengeCompletion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface ChallengeCompletionRepository extends JpaRepository<ChallengeCompletion, Long> {

    List<ChallengeCompletion> findAllByOrderByCompletedAtDesc();

    boolean existsByChallengeId(Long challengeId);

    List<ChallengeCompletion> findByChallengeIdIn(Set<Long> challengeIds);
}
