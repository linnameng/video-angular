package videosmash;

import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/videos/exclude")
    public Collection<Video> getAllUnseenVideosForGenre(@RequestParam("excludeIds")
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

//    @GetMapping("/videos/random")
//    public Video getRandomUnseenVideoForGenre(@RequestParam("excludeIds") Collection<Long> excludeIds,
//                                              @RequestParam("genreId") Long genreId) {
//        Long count = videoRepository.count();
//        int index = (int) (Math.random() * count);
//        Page<Video> videoPage = null;
//
//        if (excludeIds.isEmpty()) {
//            videoPage = videoRepository.findByGenreId(genreId, PageRequest.of(index, 1));
//        } else {
//            videoPage = videoRepository.findByGenreIdAndIdNotIn(genreId, excludeIds, PageRequest.of(index, 1));
//        }
//
//        Video randomVideo = null;
//        if (videoPage.hasContent()) {
//            randomVideo = videoPage.getContent().get(0);
//        }
//        return randomVideo;
//    }
}
