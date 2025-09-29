package project.learn.auth;


import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import project.learn.Repository.UserRepo;
import project.learn.Entity.LoginHistory;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name="Authentication")
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(@RequestBody @Valid RegistrationRequest request) throws MessagingException {
        service.register(request);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody @Valid AuthenticateRequest request)
    {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/activate-account")
    public ModelAndView confirm(@RequestParam String token) throws MessagingException {
        service.activateAccount(token);
        ModelAndView modelAndView = new ModelAndView("ACTIVATED");
        return modelAndView;
    }

    @GetMapping("/login-history/{userId}")
    public ResponseEntity<List<LoginHistory>> getUserLoginHistory(@PathVariable Long userId) {
        try {
            List<LoginHistory> loginHistory = service.getUserLoginHistory(userId);
            return ResponseEntity.ok(loginHistory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/last-login/{userId}")
    public ResponseEntity<LoginHistory> getLastLogin(@PathVariable Long userId) {
        try {
            Optional<LoginHistory> lastLogin = service.getLastLogin(userId);
            return lastLogin.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/logout/{userId}")
    public ResponseEntity<Void> logout(@PathVariable Long userId) {
        try {
            service.recordLogout(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/admin/login-history")
    public ResponseEntity<List<LoginHistory>> getAllLoginHistory() {
        try {
            List<LoginHistory> allLoginHistory = service.getAllLoginHistory();
            return ResponseEntity.ok(allLoginHistory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}
