package project.learn.Security;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import project.learn.Repository.UserRepo;


@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepo userRepo;


@Override
@Transactional
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException{
    return userRepo.findUserByEmail(userEmail).orElseThrow(() -> new UsernameNotFoundException("User not found"));
}

}
