package project.learn.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.learn.Repository.UserRepo;
import project.learn.UsersService.UsersService;
import project.learn.user.User;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UsersController {
    private final UserRepo userRepo;
    private final UsersService usersService;

    @GetMapping("/count")
    public long getUserCount() {
        return userRepo.count();
    }

   @GetMapping("/allstudents")
    public ResponseEntity<List<User>> getAllStudents() {
        List<User> users = userRepo.findByRoles_name("STUDENT");
       return ResponseEntity.ok(users);
    }
    @DeleteMapping("/delete/{idUser}")
    public void deleteUser(@PathVariable Long idUser) {
        usersService.DeleteUser(idUser);
    }
    @PutMapping("/update/user")
    public User updateUser(@RequestBody User user) {
        return usersService.updateUser(user);
    }

    @GetMapping("/view/{iduser}")
    public User getUser(@PathVariable Long iduser) {
        return usersService.getUser(iduser);
    }


}
