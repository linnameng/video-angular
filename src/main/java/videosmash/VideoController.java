package videosmash;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/api")
public class VideoController {
    private VideoRepository videoRepository;
    private GenreRepository genreRepository;

    @Autowired
    VideoController(VideoRepository videoRepository, GenreRepository
            genreRepository) {
        this.videoRepository = videoRepository;
        this.genreRepository = genreRepository;
    }

    @GetMapping("/genres")
    public Collection<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    @GetMapping("/videos/seen")
    public Collection<Video> getAllSeenVideosForGenre(@RequestParam("includeIds") Collection<Long> includeIds,
                                                      @RequestParam("genreId") Long genreId) {
        return videoRepository.findByGenreIdAndIdIn(genreId, includeIds);
    }

    @GetMapping("/videos/random")
    public Video getRandomUnseenVideoForGenre(@RequestParam("excludeIds") Collection<Long> excludeIds,
                                              @RequestParam("genreId") Long genreId) {
        Video randomVideo = null;

        if (excludeIds.isEmpty()) {
            randomVideo = videoRepository.findRandomByGenreId(genreId);
        } else {
            randomVideo = videoRepository.findRandomByGenreIdAndIdNotIn(genreId, excludeIds);
        }

        return randomVideo;
    }
}
