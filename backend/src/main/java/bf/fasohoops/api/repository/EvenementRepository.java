package bf.fasohoops.api.repository;

import bf.fasohoops.api.entity.Evenement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EvenementRepository extends JpaRepository<Evenement, UUID> {
    List<Evenement> findByStatut(String statut);
    List<Evenement> findByCreateurId(UUID createurId);
}
