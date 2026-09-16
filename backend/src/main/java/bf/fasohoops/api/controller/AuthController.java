package bf.fasohoops.api.controller;

import bf.fasohoops.api.entity.*;
import bf.fasohoops.api.repository.UserRepository;
import bf.fasohoops.api.services.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping({"/api/auth", "/api/v1/auth"})
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    // ═══════════════════════════════════════════
    // POST /api/auth/register ou /api/v1/auth/register
    // ═══════════════════════════════════════════
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String nom = body.get("nom");
        String prenom = body.get("prenom");
        String roleStr = body.getOrDefault("role", "JOUEUR");

        // Compatibilité avec champ "name" du frontend
        if ((nom == null || nom.isBlank()) && body.containsKey("name")) {
            String fullName = body.get("name").trim();
            String[] parts = fullName.split(" ", 2);
            prenom = parts[0];
            nom = parts.length > 1 ? parts[1] : parts[0];
        }

        // Validation
        if (email == null || password == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Email et mot de passe requis"));
        }
        if (password.length() < 6) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Le mot de passe doit faire au moins 6 caractères"));
        }

        String normalizedEmail = email.trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Cet email est déjà utilisé. Connectez-vous plutôt."));
        }

        Role role;
        try {
            role = Role.valueOf(roleStr.toUpperCase());
        } catch (Exception e) {
            role = Role.JOUEUR;
        }

        AbstractUser user;
        if (role == Role.CLUB) {
            Club club = new Club();
            club.setNomStructure((nom != null && !nom.isBlank()) ? nom : "Club de Basketball");
            club.setVille("Ouagadougou");
            club.setStatutValidation("VALIDE");
            user = club;
        } else if (role == Role.ENTRAINEUR) {
            Entraineur entraineur = new Entraineur();
            entraineur.setStatutValidation("VALIDE");
            user = entraineur;
        } else {
            Joueur joueur = new Joueur();
            joueur.setNiveau("Senior");
            user = joueur;
        }

        user.setEmail(normalizedEmail);
        user.setMotDePasse(passwordEncoder.encode(password));
        user.setNom(nom != null ? nom : "");
        user.setPrenom(prenom != null ? prenom : "");
        user.setRole(role);

        AbstractUser saved = userRepository.save(user);

        // Générer le token JWT
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
            .username(saved.getEmail())
            .password(saved.getMotDePasse())
            .authorities("ROLE_" + saved.getRole().name())
            .build();

        String token = jwtService.generateToken(userDetails);

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", saved.getId() != null ? saved.getId().toString() : "");
        userMap.put("email", saved.getEmail());
        userMap.put("nom", saved.getNom());
        userMap.put("prenom", saved.getPrenom());
        userMap.put("name", (saved.getPrenom() + " " + saved.getNom()).trim());
        userMap.put("role", saved.getRole().name());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Inscription réussie");
        response.put("token", token);
        response.put("user", userMap);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ═══════════════════════════════════════════
    // POST /api/auth/login ou /api/v1/auth/login
    // ═══════════════════════════════════════════
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Email et mot de passe requis"));
        }

        String normalizedEmail = email.trim().toLowerCase();

        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, password)
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtService.generateToken(userDetails);

            AbstractUser user = userRepository.findByEmail(normalizedEmail).orElseThrow();

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId() != null ? user.getId().toString() : "");
            userMap.put("email", user.getEmail());
            userMap.put("nom", user.getNom());
            userMap.put("prenom", user.getPrenom());
            userMap.put("name", (user.getPrenom() + " " + user.getNom()).trim());
            userMap.put("role", user.getRole() != null ? user.getRole().name() : "JOUEUR");

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Connexion réussie");
            response.put("token", token);
            response.put("user", userMap);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Email ou mot de passe incorrect"));
        }
    }

    // ═══════════════════════════════════════════
    // GET /api/auth/test
    // ═══════════════════════════════════════════
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "message", "Backend FasoHoops fonctionnel avec Java & Spring Boot !"
        ));
    }
}