package bf.fasohoops.api.services;

import bf.fasohoops.api.entity.AbstractUser;
import bf.fasohoops.api.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AbstractUser user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable : " + email));

        String role = user.getRole() != null ? user.getRole().toString() : "JOUEUR";

        return org.springframework.security.core.userdetails.User.builder()
            .username(user.getEmail())
            .password(user.getMotDePasse())
            .authorities("ROLE_" + role)
            .build();
    }
}