package videosmash;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import videosmash.genre.Genre;
import videosmash.genre.GenreRepository;
import videosmash.user.User;
import videosmash.user.UserRepository;
import videosmash.userVideo.UserVideo;
import videosmash.userVideo.UserVideoRepository;
import videosmash.video.Video;
import videosmash.video.VideoRepository;

import java.util.Collection;

@RestController
@RequestMapping("/api")
public class AppController {
    private UserVideoRepository userVideoRepository;
    private UserRepository userRepository;
    private VideoRepository videoRepository;
    private GenreRepository genreRepository;

    @Autowired
    AppController(UserVideoRepository userVideoRepository, UserRepository userRepository, VideoRepository videoRepository, GenreRepository genreRepository) {
        this.userVideoRepository = userVideoRepository;
        this.userRepository = userRepository;
        this.videoRepository = videoRepository;
        this.genreRepository = genreRepository;
    }

    @GetMapping("/genres")
    public Collection<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    @PostMapping("/users/add")
    public User createUser() {
        User newUser = new User();
        userRepository.save(newUser);
        return newUser;
    }

    @GetMapping("/videos/random")
    public Video getRandomUnseenVideoForUserByGenre(@RequestParam("userId") Long userId, @RequestParam("genreId") Long genreId) {
        Video randomVideo = videoRepository.findRandomByGenreIdAndUserId(genreId, userId);
        return randomVideo;
    }

    @GetMapping("/userVideos/user/{userId}")
    public Collection<UserVideo> getAllSeenVideosByGenre(@PathVariable("userId") Long userId, @RequestParam("genreId") Long genreId) {
        return userVideoRepository.findByVideoGenreIdAndUserId(genreId, userId);
    }

    @PostMapping("/userVideos/add")
    public @ResponseBody UserVideo createUserVideo(@RequestBody UserVideo userVideo) {
        userVideoRepository.save(userVideo);
        return userVideo;
    }
}
