package bf.fasohoops.api.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "joueurs")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Joueur extends AbstractUser {
    
    private String poste;
    private Float taille;
    private Float poids;
    private LocalDate dateNaissance;
    private String niveau;
    private String clubActuel;
    
    // Relation avec Statistique, Inscription, Candidature à ajouter dans le module 3
}
