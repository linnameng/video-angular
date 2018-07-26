package videosmash.video;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VideoRepository extends JpaRepository<Video, Long> {

    @Query(nativeQuery=true, value="SELECT *  FROM videos WHERE genre_id = ?1 AND id NOT IN (SELECT video_id FROM user_videos WHERE user_id = ?2) ORDER BY random() LIMIT 1")
    Video findRandomByGenreIdAndUserId(Long genreId, Long userId);
}
