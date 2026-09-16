package bf.fasohoops.api.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "admins")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Admin extends AbstractUser {
    private String poste; // ex: "Président FEBBA", "Secrétaire Général"
}
