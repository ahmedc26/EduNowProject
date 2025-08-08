package project.learn.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.learn.Entity.Level;
import project.learn.Repository.LevelRepo;

import java.util.ArrayList;
import java.util.List;

@Service
public class LevelService {
    @Autowired
    private LevelRepo levelRepo;
    public Level saveLevel(Level level) {
        return levelRepo.save(level);
    }

    public List<Level> getLevels() {
    List<Level> Levels = new ArrayList<>();
    levelRepo.findAll().forEach(Levels::add);
    return Levels;
    }

    public void deleteLevel(Long idLevel) {
        levelRepo.deleteById(idLevel);
    }
}
