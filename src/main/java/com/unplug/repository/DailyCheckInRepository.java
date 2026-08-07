package com.unplug.repository;

import com.unplug.model.DailyCheckIn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DailyCheckInRepository extends JpaRepository<DailyCheckIn, Long> {

    List<DailyCheckIn> findByCheckInDate(LocalDate date);

    List<DailyCheckIn> findByCheckInDateAfterOrderByCheckInDateDesc(LocalDate after);

    boolean existsByCheckInDateAndType(LocalDate date, String type);
}
