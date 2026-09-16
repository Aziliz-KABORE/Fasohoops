package bf.fasohoops.api.repository;

import bf.fasohoops.api.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClubRepository extends JpaRepository<Club, UUID> {
    List<Club> findByStatutValidation(String statutValidation);
}
