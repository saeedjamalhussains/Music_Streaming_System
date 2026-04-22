package com.spring.online.demo.controller;

import com.spring.online.demo.domain.entity.Song;
import com.spring.online.demo.service.SongService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/songs")
@CrossOrigin(origins = "*")
public class SongController {

    private final SongService songService;

    @Autowired
    public SongController(SongService songService) {
        this.songService = songService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadSong(@RequestParam("songName") String songName,
            @RequestParam("mp3File") MultipartFile mp3File,
            @RequestParam("albumImage") MultipartFile albumImage,
            @RequestParam(value = "songImage", required = false) MultipartFile songImage,
            @RequestParam("artist") String artist,
            @RequestParam("movie") String movie,
            @RequestParam(value = "releaseYear", required = false) String releaseYear,
            @RequestParam(value = "featuredArtists", required = false) String featuredArtists) {
        try {
            Song song = songService.storeSong(songName, mp3File, albumImage, songImage, artist, movie, releaseYear, featuredArtists);
            return ResponseEntity.ok(song);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Song>> getAllSongs() {
        return ResponseEntity.ok(songService.getAllSongs());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSong(@PathVariable Long id,
            @RequestParam("songName") String songName,
            @RequestParam(value = "mp3File", required = false) MultipartFile mp3File,
            @RequestParam(value = "albumImage", required = false) MultipartFile albumImage,
            @RequestParam(value = "songImage", required = false) MultipartFile songImage,
            @RequestParam("artist") String artist,
            @RequestParam("movie") String movie,
            @RequestParam(value = "releaseYear", required = false) String releaseYear,
            @RequestParam(value = "featuredArtists", required = false) String featuredArtists) {
        try {
            Song song = songService.updateSong(id, songName, mp3File, albumImage, songImage, artist, movie, releaseYear, featuredArtists);
            return ResponseEntity.ok(song);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSong(@PathVariable Long id) {
        try {
            songService.deleteSong(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
