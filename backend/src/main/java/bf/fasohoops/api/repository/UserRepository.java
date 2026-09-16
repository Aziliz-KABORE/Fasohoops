package bf.fasohoops.api.repository;

import bf.fasohoops.api.entity.AbstractUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<AbstractUser, UUID> {
    Optional<AbstractUser> findByEmail(String email);
    boolean existsByEmail(String email);
}