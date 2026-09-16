package bf.fasohoops.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
public class Message {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "expediteur_id", nullable = false)
    private AbstractUser expediteur;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "destinataire_id", nullable = false)
    private AbstractUser destinataire;

    @Column(nullable = false, length = 1000)
    private String contenu;

    private boolean lu = false;

    private LocalDateTime dateEnvoi = LocalDateTime.now();
}
