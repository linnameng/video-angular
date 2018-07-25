package videosmash;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;

public interface VideoRepository extends JpaRepository<Video, Long> {

    Collection<Video> findByGenreIdAndIdNotIn(Long genreId, Collection<Long>
            excludeVideoIds);

    Page<Video> findByGenreIdAndIdNotIn(Long genreId, Collection<Long>
            excludeVideoIds, Pageable var1);

    Page<Video> findByGenreId(Long genreId, Pageable var1);

    Collection<Video> findByGenreIdAndIdIn(Long genreId, Collection<Long>
            includeVideoIds);

    @Query(nativeQuery=true, value="SELECT *  FROM videos WHERE genre_id = ?1 AND videos.id NOT IN (?2) ORDER BY random() LIMIT 1")
    Video findRandomByGenreIdAndIdNotIn(Long genreId, Collection<Long> excludeVideoIds);

    @Query(nativeQuery=true, value="SELECT *  FROM videos WHERE genre_id = ?1 ORDER BY random() LIMIT 1")
    Video findRandomByGenreId(Long genreId);
}
