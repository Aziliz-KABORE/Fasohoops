package bf.fasohoops.api.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "clubs")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Club extends AbstractUser {

    private String nomStructure;
    private String ville;
    private String historique;
    private String besoinsRecrutement;

    // Relations avec Offre, Evenement à ajouter ultérieurement
}
