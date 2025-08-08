package project.learn.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.learn.Entity.Level;
import project.learn.Service.LevelService;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class LevelController {
    @Autowired
    private LevelService levelService;

    @PostMapping("/addLevel")
    public Level saveLevel(@RequestBody Level level){ return  levelService.saveLevel(level); }

    @GetMapping("/getLevels")
    public List<Level> getLevels(){ return levelService.getLevels(); }

    @DeleteMapping("/delete-Level/{idLevel}")
    public void deleteLevel(@PathVariable Long idLevel){ levelService.deleteLevel(idLevel);}

}
