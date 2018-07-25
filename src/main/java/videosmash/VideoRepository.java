package videosmash;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface VideoRepository extends JpaRepository<Video, Long> {
    Collection<Video> findByGenreIdAndIdNotIn(Long genreId, Collection<Long>
            excludeVideoIds);
    Collection<Video> findByGenreIdAndIdIn(Long genreId, Collection<Long>
            includeVideoIds);
}
