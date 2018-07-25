import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';
import { Video, Genre } from '../models/app.models';
import { VideoService } from './video.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})

export class VideoComponent implements OnInit {

  seenVideosForGenre: Video[];
  randomVideo: Video;
  allGenres: Genre[];
  selectedGenreId: string;
  userId: String;

  isNextButtonEnabled = false;
  isDisplayNoVideoMessage = true;
  noVideoMessage: string;

  COOKIE_USER_ID = 'userId';
  COOKIE_CURRENT_GENRE_ID = 'currentGenreId';

  constructor(private router: Router, private videoService: VideoService, private _cookieService: CookieService) {
    this.userId = this.getCookie(this.COOKIE_USER_ID);
    // if we have a returning user, load the latest genre they have viewed
    if (this.userId !== undefined) {
      this.selectedGenreId = this.getCookie(this.COOKIE_CURRENT_GENRE_ID);
    } else {
      this.putCookie(this.COOKIE_USER_ID, this.generateRandomUserId());
      this.selectedGenreId = null;
    }
  }

  ngOnInit() {
    if (this.selectedGenreId != null) {
      this.getRandomVideoAndMarkAsViewed();
      this.getSeenVideosForGenre(this.selectedGenreId);
    } else {
      this.updateDisplayNoVideos();
    }

    this.videoService.getAllGenres()
      .subscribe( data => {
        this.allGenres = data;
      });
  }

  onClickNextVideoButton() {
    this.getRandomVideoAndMarkAsViewed();
    this.getSeenVideosForGenre(this.selectedGenreId);
  }

  getRandomVideoAndMarkAsViewed() {
    const genreId = this.selectedGenreId;
    if (genreId === undefined) {
      return;
    }

    const seenVideoIds = this.getSeenVideoIdsFromGenreCookie(genreId);
    this.videoService.getRandomVideoForGenre(genreId, seenVideoIds)
      .subscribe( data => {
        this.randomVideo = data;
        if (this.randomVideo == undefined) {
          this.updateDisplayNoVideos();
          return;
        }
        this.isNextButtonEnabled = true;
        this.randomVideo.viewed = Date.now();
        this.updateGenreCookie(genreId, this.randomVideo);
      });
  }

  updateDisplayNoVideos() {
    console.log('display no videos');
    if (this.selectedGenreId == undefined) {
      this.noVideoMessage = 'Select a genre to play a random video';
    } else {
      this.noVideoMessage = 'No more videos in genre';
    }

    this.isDisplayNoVideoMessage = true;
    this.isNextButtonEnabled = false;
  }

  updateGenreCookie(genreId, video: Video) {
    const seenVideosCookie = this.getCookie(genreId);
    // Create a new cookie for this genre if none exists.
    if (seenVideosCookie == undefined) {
      this.putCookie(genreId, JSON.stringify([ video ]));
    } else { // Otherwise, add the video id to the existing cookie.
      const genreArray = JSON.parse(seenVideosCookie);
      genreArray.push(this.randomVideo);
      this.putCookie(genreId, JSON.stringify(genreArray));
    }
  }

  onGenreSelect(genreId) {
    // record current genre to reload next time the user visits the site
    if (genreId == null) {
      this.putCookie(this.COOKIE_CURRENT_GENRE_ID, null);
      this.seenVideosForGenre = null;
      this.randomVideo = null;
      this.updateDisplayNoVideos();
    } else {
      this.putCookie(this.COOKIE_CURRENT_GENRE_ID, genreId.toString());
      this.getRandomVideoAndMarkAsViewed();
      this.getSeenVideosForGenre(genreId);
    }
  }

  getSeenVideosForGenre(genreId) {
    let seenVideos = [];
    const seenVideosCookie = this.getCookie(genreId.toString());
    if (seenVideosCookie != undefined) {
      seenVideos = JSON.parse(seenVideosCookie);
    }
    this.seenVideosForGenre = seenVideos;
  }

  getSeenVideoIdsFromGenreCookie(genreId) {
    let seenVideoIds = [''];
    const seenVideosCookie = this.getCookie(genreId.toString());

    if (seenVideosCookie !== undefined) {
      const seenVideosArray = JSON.parse(seenVideosCookie);
      seenVideoIds = seenVideosArray.map(video => video.id);
    }

    return seenVideoIds;
  }

  getCookie(key: string) {
    return this._cookieService.get(key);
  }

  putCookie(key: string, value: string) {
    return this._cookieService.put(key, value);
  }

  generateRandomUserId() {
    return Math.floor((Math.random() * 6) + 1).toString();
  }

}
