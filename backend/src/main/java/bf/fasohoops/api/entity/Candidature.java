package bf.fasohoops.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "candidatures")
@Data
@NoArgsConstructor
public class Candidature {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "joueur_id", nullable = false)
    private Joueur joueur;

    // Peut concerner une Offre
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "offre_id", nullable = true)
    private Offre offre;

    // Ou peut concerner un Evénement
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "evenement_id", nullable = true)
    private Evenement evenement;

    private String message;
    
    // Statut : EN_ATTENTE, ACCEPTEE, REFUSEE
    private String statut = "EN_ATTENTE";

    private LocalDateTime dateCandidature = LocalDateTime.now();
}
