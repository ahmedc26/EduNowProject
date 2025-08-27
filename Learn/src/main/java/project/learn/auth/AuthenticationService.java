package project.learn.auth;


import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import project.learn.Repository.RoleRepo;
import project.learn.Repository.TokenRepo;
import project.learn.Repository.UserRepo;
import project.learn.Security.JwtService;
import project.learn.email.EmailService;
import project.learn.email.EmailTemplateName;
import project.learn.user.Token;
import project.learn.user.User;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class  AuthenticationService {

    private final RoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final UserRepo userRepo;
    private final TokenRepo tokenRepo;
    private final EmailService emailService;
    private final JwtService jwtService;
    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;
    private final AuthenticationManager authenticationManager;


    public void register(RegistrationRequest request) throws MessagingException {
        var userRole =  roleRepo.findByName("STUDENT")
                .orElseThrow(()-> new IllegalStateException("Username not found"));
    var user = User.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .phoneNumber(request.getPhoneNumber())
            .birthDate(LocalDate.parse(request.getBirthDate()))
            .password(passwordEncoder.encode(request.getPassword()))
            .accountLocked(false)
            .enabled(false)
            .roles(List.of(userRole))
            .build();
    userRepo.save(user);
    sendValidationEmail(user);
    }

    private void sendValidationEmail(User user) throws MessagingException {
   var newToken = generateAndSaveActivationToken(user);
    //send email
    emailService.sendEmail(user.getEmail(),user.fullName(),
            EmailTemplateName.ACTIVATION_ACCOUNT,
            activationUrl,newToken,
            "Account Activation"
    );

    }

    private String generateAndSaveActivationToken(User user) {
        String generatedToken= generateAndSaveActivationCode(6);
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        tokenRepo.save(token);
        return generatedToken;
    }

    private String generateAndSaveActivationCode(int length) {
    String characters = "0123456789";
    StringBuilder codeBuilder = new StringBuilder();
    SecureRandom secureRandom = new SecureRandom();
    for (int i = 0; i < length; i++) {
        int randomIndex = secureRandom.nextInt(characters.length());
        codeBuilder.append(characters.charAt(randomIndex));
    }
    return codeBuilder.toString();
    }

    public AuthenticationResponse authenticate( AuthenticateRequest request) {
    var auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword()));
    var claims = new HashMap<String,Object>();
    var user = ((User) auth.getPrincipal());
    claims.put("fullName", user.fullName());
    claims.put("iduser", user.getIdUser());
    claims.put("phoneNumber", user.getPhoneNumber());

    claims.put("createdDate", Date.from(user.getCreatedDate().atZone(ZoneId.systemDefault()).toInstant()));

    var jwtToken = jwtService.generateToken(claims,user);
    return AuthenticationResponse.builder().token(jwtToken).build();
    }

    //@Transactional
    public void activateAccount(String token) throws MessagingException {
        token = token.trim();
        Token savedToken = tokenRepo.findByToken(token)
        .orElseThrow(()-> new RuntimeException("Token not found"));
    if(LocalDateTime.now().isAfter(savedToken.getExpiresAt())){
        sendValidationEmail(savedToken.getUser());
        throw new RuntimeException("A new token has been send because the old is expired");
    }
    var user = userRepo.findById(savedToken.getUser().getIdUser())
            .orElseThrow(()-> new RuntimeException("User not found"));
    user.setEnabled(true);
    userRepo.save(user);
    savedToken.setValidateAt(LocalDateTime.now());
    tokenRepo.save(savedToken);
    }



}
