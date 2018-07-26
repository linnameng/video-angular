package videosmash;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class VideoController {
    private VideoRepository videoRepository;
    private UserVideoRepository userVideoRepository;
    private UserRepository userRepository;

    @Autowired
    VideoController(VideoRepository videoRepository, UserVideoRepository userVideoRepository, UserRepository userRepository) {
        this.videoRepository = videoRepository;
        this.userVideoRepository = userVideoRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/videos/random")
    public Video getRandomUnseenVideoForUserByGenre(@RequestParam("userId") Long userId, @RequestParam("genreId") Long genreId) {
        Video randomVideo = videoRepository.findRandomByGenreIdAndUserId(genreId, userId);
        return randomVideo;
    }
}
