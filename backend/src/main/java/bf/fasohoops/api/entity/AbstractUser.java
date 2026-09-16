package bf.fasohoops.api.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class AbstractUser {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private String nom;
    private String prenom;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @JsonIgnore
    @Column(nullable = false)
    private String motDePasse;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime dateCreation;

    @Column(name = "photo_url", columnDefinition = "TEXT")
    private String photoUrl;

    @Column(columnDefinition = "TEXT")
    private String bio;
}
