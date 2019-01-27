package com.vroxcode.snake.repository;

import com.vroxcode.snake.model.Score;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScoreRepository extends JpaRepository<Score, Long> { }
