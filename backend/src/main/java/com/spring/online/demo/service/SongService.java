package com.spring.online.demo.service;

import com.spring.online.demo.domain.entity.Song;
import com.spring.online.demo.domain.repository.SongRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
@Service
public class SongService {

    private final Path fileStorageLocation;
    private final SongRepository songRepository;

    @Autowired
    public SongService(SongRepository songRepository) {
        this.songRepository = songRepository;
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
            Files.createDirectories(this.fileStorageLocation.resolve("songs"));
            Files.createDirectories(this.fileStorageLocation.resolve("songs"));
            Files.createDirectories(this.fileStorageLocation.resolve("images"));
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public Song storeSong(String songName, MultipartFile mp3File, MultipartFile albumImage, MultipartFile songImage, String artist,
            String movie, String releaseYear, String featuredArtists) {
        try {
            String mp3Url = saveFile(mp3File, "songs");
            String imageUrl = saveFile(albumImage, "images");
            String songImageUrl = (songImage != null && !songImage.isEmpty()) ? saveFile(songImage, "images") : null;

            Song song = new Song(songName, mp3Url, imageUrl, artist, movie, releaseYear, featuredArtists, songImageUrl);
            return songRepository.save(song);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store files. Please try again!", ex);
        }
    }

    public Song updateSong(Long id, String songName, MultipartFile mp3File, MultipartFile albumImage, MultipartFile songImage, String artist,
            String movie, String releaseYear, String featuredArtists) {
        Song existingSong = songRepository.findById(id).orElseThrow(() -> new RuntimeException("Song not found"));

        existingSong.setName(songName);
        existingSong.setArtist(artist);
        existingSong.setMovie(movie);
        existingSong.setReleaseYear(releaseYear);
        existingSong.setFeaturedArtists(featuredArtists);

        try {
            if (mp3File != null && !mp3File.isEmpty()) {
                existingSong.setFilePath(saveFile(mp3File, "songs"));
            }
            if (albumImage != null && !albumImage.isEmpty()) {
                existingSong.setImagePath(saveFile(albumImage, "images"));
            }
            if (songImage != null && !songImage.isEmpty()) {
                existingSong.setSongImagePath(saveFile(songImage, "images"));
            }
        } catch (IOException ex) {
            throw new RuntimeException("Could not update files. Please try again!", ex);
        }

        return songRepository.save(existingSong);
    }

    private String saveFile(MultipartFile file, String subDir) throws IOException {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        if (fileName.contains("..")) {
            throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
        }
        String uniqueName = UUID.randomUUID().toString() + "_" + fileName;
        Path targetLocation = this.fileStorageLocation.resolve(subDir).resolve(uniqueName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        return "/uploads/" + subDir + "/" + uniqueName;
    }

    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    public void deleteSong(Long id) {
        songRepository.deleteById(id);
    }
}
