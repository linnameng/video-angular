package videosmash;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
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

    @GetMapping("/videos/exclude/{excludeIds}")
    public Collection<Video> getAllUnseenVideosForGenre(@PathVariable("excludeIds")
                                                        Collection<Long>
                                                        excludeIds,
                                                @RequestParam("genreId") Long
                                                        genreId) {
        // calling findByIdNotIn(null) returns null, when we really want to
        // retrieve everything for that case
        if (excludeIds.isEmpty()) {
            return videoRepository.findAll();
        }
        return videoRepository.findByGenreIdAndIdNotIn(genreId, excludeIds);
    }

    @GetMapping("/videos/include/{includeIds}")
    public Collection<Video> getAllSeenVideosForGenre(@PathVariable("includeIds")
                                                      Collection<Long> includeIds,
                                                      @RequestParam("genreId") Long genreId) {
        return videoRepository.findByGenreIdAndIdIn(genreId, includeIds);
    }

    @GetMapping("/videos/random")
    public Video getRandomVideo() {
        Long count = videoRepository.count();
        int index = (int) (Math.random() * count);
        Page<Video> videoPage = videoRepository.findAll(PageRequest.of(index, 1));
        Video randomVideo = null;
        if (videoPage.hasContent()) {
            randomVideo = videoPage.getContent().get(0);
        }
        return randomVideo;
    }
}
