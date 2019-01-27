package com.vroxcode.snake.controller;

import com.vroxcode.snake.model.Score;
import com.vroxcode.snake.repository.ScoreRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ScoreController {

    private static Logger LOG = LoggerFactory.getLogger(ScoreController.class);
    private static final String SORT_PROPERTY = "score";
    private static final int MAX_NUM_SCORES = 10;

    @Autowired
    private ScoreRepository scoreRepository;

    @PostMapping("/score")
    @ResponseBody
    public ResponseEntity newScore(@RequestBody Score score) {
        if (!isValid(score)) {
            LOG.warn("Invalid score: " + score);
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
        List<Score> savedScores = scoreRepository.findAll(Sort.by(Sort.Direction.DESC, SORT_PROPERTY));
        int numSavedScores = savedScores.size();
        if (numSavedScores < MAX_NUM_SCORES) {
            scoreRepository.save(score);
        } else {
            boolean isHighscore = savedScores.stream().anyMatch(savedScore -> score.getScore() > savedScore.getScore());

            if (isHighscore) {
                scoreRepository.save(score);

                Score lastScore = savedScores.get(savedScores.size() - 1);
                scoreRepository.delete(lastScore);
            }
        }
        return new ResponseEntity(HttpStatus.OK);
    }

    @GetMapping("/scores")
    public List<Score> scores() {
        return scoreRepository.findAll(Sort.by(Sort.Direction.DESC, SORT_PROPERTY));
    }

    private boolean isValid(Score score) {
        boolean valid = true;
        String name = score.getName();
        if (name.length() == 0 || name.length() > 10) {
            valid = false;
        }
        int scoreVal = score.getScore();
        if (scoreVal <= 0 || scoreVal > 160000) {
            valid = false;
        }
        return valid;
    }

}