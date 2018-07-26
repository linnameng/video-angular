package videosmash;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequestMapping("/api/genres")
public class GenreController {
    private GenreRepository genreRepository;

    @Autowired
    GenreController(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    @GetMapping("")
    public Collection<Genre> getAllGenres() {
        return genreRepository.findAll();
    }
}
