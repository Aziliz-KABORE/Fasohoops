package bf.fasohoops.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "demandes_licences")
@Data
@NoArgsConstructor
public class DemandeLicence {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    private String saison;
    
    // Nombres de joueurs prévus
    private int nombreJoueurs;

    // Statut : EN_ATTENTE, VALIDE, REFUSE
    private String statut = "EN_ATTENTE";
    
    private String commentaireClub;
    private String reponseAdmin;

    private LocalDateTime dateDemande = LocalDateTime.now();
    private LocalDateTime dateMiseAJour;
}
