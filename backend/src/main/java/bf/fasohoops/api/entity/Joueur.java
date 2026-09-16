package bf.fasohoops.api.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.Period;

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
    private String licenceNumero;

    public int getAge() {
        if (dateNaissance == null) return 18;
        return Period.between(dateNaissance, LocalDate.now()).getYears();
    }

    public boolean isMineur() {
        return getAge() < 18;
    }
}

