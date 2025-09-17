package project.learn.UsersService;


import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.learn.Repository.TokenRepo;
import project.learn.Repository.UserRepo;
import project.learn.user.User;

@Service
public class    UsersService {

    @Autowired
    UserRepo userRepo;

    @Autowired
    TokenRepo tokenRepo;

    @Autowired
    PasswordEncoder passwordEncoder;

    public void DeleteUser(Long idUser) {
        tokenRepo.deleteById(idUser);
        userRepo.deleteById(idUser);
    }
    public User updateUser(User user) {
        User existingUser = userRepo.findUserByIdUser(user.getIdUser())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getFirstName() != null) {
            existingUser.setFirstName(user.getFirstName());
        }
        if (user.getLastName() != null) {
            existingUser.setLastName(user.getLastName());
        }
        if (user.getEmail() != null) {
            existingUser.setEmail(user.getEmail());
        }
        if (user.getPassword() != null) {
            existingUser.setPassword(user.getPassword());
        }
        if (user.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(user.getPhoneNumber());
        }
        if (user.getBirthDate() != null) {
            existingUser.setBirthDate(user.getBirthDate());
        }
        if(user.getRoles()!=null){
            existingUser.setRoles(user.getRoles());
        }


        return userRepo.save(existingUser);


    }

    public User getUser(Long idUser){
        return userRepo.findUserByIdUser(idUser).orElseThrow();
    }

    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = userRepo.findUserByEmail(email).orElseThrow(() -> new EntityNotFoundException("User not found"));
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
    }

}
