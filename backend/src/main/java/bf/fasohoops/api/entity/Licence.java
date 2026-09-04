package bf.fasohoops.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "licences")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Licence {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String numeroLicence;

    private String nomTitulaire;
    private String roleTitulaire;
    private String clubAffiliation;
    private LocalDate valideJusquA;
    private String statut = "ACTIVE"; // ACTIVE, EXPIREE, SUSPENDUE
}
