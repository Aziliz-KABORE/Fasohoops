package bf.fasohoops.api.repository;

import bf.fasohoops.api.entity.Joueur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JoueurRepository extends JpaRepository<Joueur, UUID> {

    @Query("SELECT j FROM Joueur j WHERE " +
           "(:poste IS NULL OR j.poste = :poste) AND " +
           "(:niveau IS NULL OR j.niveau = :niveau) AND " +
           "(:club IS NULL OR LOWER(j.clubActuel) LIKE LOWER(CONCAT('%', :club, '%')))")
    List<Joueur> searchJoueurs(
            @Param("poste") String poste,
            @Param("niveau") String niveau,
            @Param("club") String club
    );
}
