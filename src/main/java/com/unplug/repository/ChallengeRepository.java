package com.unplug.repository;

import com.unplug.model.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {

    List<Challenge> findByPhaseOrderByOrderIndex(Integer phase);

    long countByPhase(Integer phase);
}
