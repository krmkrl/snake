package com.vroxcode.snake;

import com.vroxcode.snake.controller.ScoreController;
import com.vroxcode.snake.model.Score;
import com.vroxcode.snake.repository.ScoreRepository;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ScoreControllerTests {

    private static final int MAX_NUM_SCORES = 10;
    @Autowired
    private ScoreController scoreController;
    @Autowired
    private ScoreRepository scoreRepository;

    @Before
    public void setUp() {
        scoreRepository.deleteAll();
    }

    @Test
    public void scoresEmpty() throws Exception {
        List<Score> scores = scoreController.scores();
        Assert.assertEquals(0, scores.size());
    }

    @Test
    public void scoreAdded() throws Exception {
        ResponseEntity response = scoreController.newScore(createScore("John", 5));
        Assert.assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void invalidScoreName() {
        ResponseEntity response = scoreController.newScore(createScore("", 5));
        Assert.assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void invalidScoreVal() {
        ResponseEntity response = scoreController.newScore(createScore("", 0));
        Assert.assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void scoresSorted() {
        scoreController.newScore(createScore("Anna", 3));
        scoreController.newScore(createScore("Elsa", 7));
        List<Score> scores = scoreController.scores();
        System.out.println(scores);
        Assert.assertEquals(scores.get(0).getName(), "Elsa");
        Assert.assertEquals(scores.get(0).getScore(), 7);
        Assert.assertEquals(scores.get(1).getName(), "Anna");
        Assert.assertEquals(scores.get(1).getScore(), 3);
    }

    @Test
    public void lowScoreNotAddedWhenHighscoreListFull() {
        for (int i = 1; i <= MAX_NUM_SCORES; i++) {
            scoreController.newScore(createScore("Arya", i));
        }
        scoreController.newScore(createScore("Sansa", 1));
        List<Score> scores = scoreController.scores();
        Assert.assertEquals("Arya", scores.get(MAX_NUM_SCORES - 1).getName());
    }

    @Test
    public void scoreAddedAndLowestScoreRemovedWhenHighscoreListFull() {
        for (int i = 1; i <= MAX_NUM_SCORES; i++) {
            scoreController.newScore(createScore("Arya", i));
        }
        scoreController.newScore(createScore("Sansa", 15));
        List<Score> scores = scoreController.scores();
        Assert.assertEquals(2, scores.get(MAX_NUM_SCORES - 1).getScore());
        Assert.assertEquals(15, scores.get(0).getScore());
    }

    private Score createScore(String name, int scoreVal) {
        Score score = new Score();
        score.setName(name);
        score.setScore(scoreVal);
        return score;
    }

}

