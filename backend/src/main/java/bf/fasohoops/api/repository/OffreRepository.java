package bf.fasohoops.api.repository;

import bf.fasohoops.api.entity.Offre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OffreRepository extends JpaRepository<Offre, UUID> {
    List<Offre> findByStatut(String statut);
    List<Offre> findByClubId(UUID clubId);
}
