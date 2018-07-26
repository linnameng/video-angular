package videosmash;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface UserVideoRepository extends JpaRepository<UserVideo, Long> {
    Collection<UserVideo> findByVideoGenreIdAndUserId(Long videoGenreId, Long userId);
}
