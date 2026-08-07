package com.unplug.repository;

import com.unplug.model.UrgeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface UrgeLogRepository extends JpaRepository<UrgeLog, Long> {

    List<UrgeLog> findByTriggeredAtAfterOrderByTriggeredAtDesc(LocalDateTime after);

    @Query("SELECT u.triggerType, COUNT(u) FROM UrgeLog u WHERE u.triggeredAt >= :from GROUP BY u.triggerType")
    List<Object[]> countByTriggerTypeSince(@Param("from") LocalDateTime from);

    @Query("SELECT COUNT(u) FROM UrgeLog u WHERE u.triggeredAt >= :from AND u.resisted = true")
    long countResistedSince(@Param("from") LocalDateTime from);

    @Query("SELECT COUNT(u) FROM UrgeLog u WHERE u.triggeredAt >= :from")
    long countSince(@Param("from") LocalDateTime from);
}
