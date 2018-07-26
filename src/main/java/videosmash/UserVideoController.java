package videosmash;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/api/userVideos")
public class UserVideoController {
    private UserVideoRepository userVideoRepository;
    private UserRepository userRepository;
    private VideoRepository videoRepository;

    @Autowired
    UserVideoController(UserVideoRepository userVideoRepository, UserRepository userRepository, VideoRepository videoRepository) {
        this.userVideoRepository = userVideoRepository;
        this.userRepository = userRepository;
        this.videoRepository = videoRepository;
    }

    @GetMapping("/user/{userId}")
    public Collection<UserVideo> getAllSeenVideosByGenre(@PathVariable("userId") Long userId, @RequestParam("genreId") Long genreId) {
        return userVideoRepository.findByVideoGenreIdAndUserId(genreId, userId);
    }

    @PostMapping("/add")
    public @ResponseBody UserVideo createUserVideo(@RequestBody UserVideo userVideo) {
        userVideoRepository.save(userVideo);
        return userVideo;
    }
}
