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

    @GetMapping("/scores")
    public List<Score> scores() {
        return scoreRepository.findAll(Sort.by(Sort.Direction.DESC, SORT_PROPERTY));
    }

    @PostMapping("/score")
    @ResponseBody
    public ResponseEntity newScore(@RequestBody Score score) {
        if (!isValid(score)) {
            LOG.warn("Invalid score: " + score);
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
        saveScore(score);
        return new ResponseEntity(HttpStatus.OK);
    }

    private void saveScore(Score score) {
        List<Score> savedScores = scoreRepository.findAll(Sort.by(Sort.Direction.DESC, SORT_PROPERTY));
        int numSavedScores = savedScores.size();
        if (numSavedScores < MAX_NUM_SCORES) {
            scoreRepository.save(score);
        } else {
            Score lastScore = savedScores.get(numSavedScores - 1);
            if (score.getScore() > lastScore.getScore()) {
                scoreRepository.save(score);
                scoreRepository.delete(lastScore);
            }
        }
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
