package bf.fasohoops.api.repository;

import bf.fasohoops.api.entity.DemandeLicence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DemandeLicenceRepository extends JpaRepository<DemandeLicence, UUID> {
    List<DemandeLicence> findByStatut(String statut);
    List<DemandeLicence> findByClubId(UUID clubId);
}
