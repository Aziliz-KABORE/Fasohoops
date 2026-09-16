package bf.fasohoops.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "evenements")
@Data
@NoArgsConstructor
public class Evenement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String titre;
    private String description;
    
    // Type d'événement : TOURNOI, DETECTION, FORMATION, DEPOT
    private String type;
    
    // Statut : EN_ATTENTE, VALIDE, REFUSE
    private String statut = "EN_ATTENTE";
    
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private String lieu;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "createur_id")
    private AbstractUser createur; // L'admin ou le club qui lance l'événement
    
    private LocalDateTime dateCreation = LocalDateTime.now();
}
