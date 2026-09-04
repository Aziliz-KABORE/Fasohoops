package bf.fasohoops.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "offres")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Offre {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String titre;

    @Column(nullable = false)
    private String posteRecherche;

    @Column(nullable = false)
    private String niveau;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String ville;

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    private String statut = "ACTIVE"; // ACTIVE, CLOTUREE

    @CreationTimestamp
    private LocalDateTime datePublication;

    private LocalDateTime dateExpiration;
}
