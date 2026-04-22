package com.spring.online.demo.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "songs")
public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String filePath;
    private String imagePath;
    private String artist;
    private String movie;

    private String releaseYear;
    private String featuredArtists;
    private String songImagePath;

    public Song() {
    }

    public Song(String name, String filePath, String imagePath, String artist, String movie, String releaseYear, String featuredArtists, String songImagePath) {
        this.name = name;
        this.filePath = filePath;
        this.imagePath = imagePath;
        this.artist = artist;
        this.movie = movie;
        this.releaseYear = releaseYear;
        this.featuredArtists = featuredArtists;
        this.songImagePath = songImagePath;
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

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getMovie() {
        return movie;
    }

    public void setMovie(String movie) {
        this.movie = movie;
    }

    public String getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(String releaseYear) {
        this.releaseYear = releaseYear;
    }

    public String getFeaturedArtists() {
        return featuredArtists;
    }

    public void setFeaturedArtists(String featuredArtists) {
        this.featuredArtists = featuredArtists;
    }

    public String getSongImagePath() {
        return songImagePath;
    }

    public void setSongImagePath(String songImagePath) {
        this.songImagePath = songImagePath;
    }
}
