package videosmash;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface VideoRepository extends JpaRepository<Video, Long> {
    Collection<Video> findByIdNotIn(Collection<Long> videos);
    Collection<Video> findByIdIn(Collection<Long> videos);
}
