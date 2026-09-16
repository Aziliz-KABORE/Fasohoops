package bf.fasohoops.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private AbstractUser utilisateur;

    @Column(nullable = false)
    private String contenu;

    private String type = "INFO"; // MESSAGE, VALIDATION, CANDIDATURE

    private boolean lue = false;

    private LocalDateTime dateCreation = LocalDateTime.now();
}
