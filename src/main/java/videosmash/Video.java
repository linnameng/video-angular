package videosmash;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
@Table(name = "videos")
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String color;

    @ManyToOne
    @JoinColumn(name = "genre_id")
    private Genre genre;

    /*
    @JoinColumn(name = "message_key")
    @ManyToOne(targetEntity = Messages.class, fetch = FetchType.LAZY)
    private Messages message;

    @Column(name = "message_key", insertable = false, updatable = false)
    private Long message_fk;
     */

    public Video() {}

    public Video(String name, Genre genre) {
        this.name = name;
        this.genre = genre;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Genre getGenre() {
        return genre;
    }

    public void setGenre(Genre genre) {
        this.genre = genre;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
