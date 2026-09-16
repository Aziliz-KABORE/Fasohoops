package bf.fasohoops.api.repository;

import bf.fasohoops.api.entity.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CandidatureRepository extends JpaRepository<Candidature, UUID> {
    List<Candidature> findByJoueurId(UUID joueurId);
    List<Candidature> findByEvenementId(UUID evenementId);
    List<Candidature> findByOffreId(UUID offreId);
}
