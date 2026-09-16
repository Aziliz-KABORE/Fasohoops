package bf.fasohoops.api.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "entraineurs")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Entraineur extends AbstractUser {

    private String cv;
    private String experiences;
    private String formations;
    private String licenceNumero;
    private String statutValidation = "EN_ATTENTE"; // EN_ATTENTE, VALIDE, REFUSE
}
