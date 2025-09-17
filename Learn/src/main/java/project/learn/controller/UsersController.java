package project.learn.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import project.learn.Repository.UserRepo;
import project.learn.Security.JwtService;
import project.learn.UsersService.UsersService;
import project.learn.user.User;
import lombok.Data;

import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UsersController {
    private final UserRepo userRepo;
    private final UsersService usersService;
    private final JwtService jwtService;

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
    public ResponseEntity<Map<String, String>>  updateUser(@RequestBody User user) {
        User updatedUser = usersService.updateUser(user);

        Map<String, Object> claims = new HashMap<>();
        claims.put("fullName", updatedUser.fullName());
        claims.put("iduser", updatedUser.getIdUser());
        claims.put("phoneNumber", updatedUser.getPhoneNumber());
        if (updatedUser.getCreatedDate() != null) {
            claims.put("createdDate", Date.from(updatedUser.getCreatedDate().atZone(ZoneId.systemDefault()).toInstant()));
        }

        String newToken = jwtService.generateToken(claims, updatedUser);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User updated successfully");
        response.put("token", newToken);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/view-user/{iduser}")
    public User getUser(@PathVariable Long iduser) {
        return usersService.getUser(iduser);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal UserDetails principal
    ) {
        usersService.changePassword(principal.getUsername(), request.getCurrentPassword(), request.getNewPassword());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password changed successfully");
        return ResponseEntity.ok(response);
    }

    @Data
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
    }

}
