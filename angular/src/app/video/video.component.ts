import { Component, OnInit } from '@angular/core';
import { CookieService, CookieOptions, CookieOptionsProvider } from 'ngx-cookie';
import { Router } from '@angular/router';
import { Video, Genre, UserVideo, User } from '../models/app.models';
import { VideoService } from './video.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})

export class VideoComponent implements OnInit {
  currentUser: User;

  allGenres: Genre[];
  currentGenreId: string;

  currRandomVideo: Video;
  seenVideosForGenre: UserVideo[];

  isNextButtonEnabled = false;
  isDisplayNoVideoMessage = true;
  noVideoMessage: string;

  COOKIE_USER = 'currentUserCookie';
  COOKIE_CURRENT_GENRE_ID = 'currentGenreId';
  COOKIE_OPTIONS: CookieOptions;

  constructor(private router: Router, private videoService: VideoService, private _cookieService: CookieService) {
    this.setupCookieOptions();

    this.currentUser = <User> this.getCookieObject(this.COOKIE_USER);
    // if we have a returning user, load the latest genre they have viewed
    if (this.currentUser != null) {
      console.log('current user exists: ' + this.currentUser + ' id: ' + this.currentUser.id);
      this.currentGenreId = this.getCookie(this.COOKIE_CURRENT_GENRE_ID);
    } else {
      this.createNewUserCookie();
    }
  }

  ngOnInit() {
    if (this.currentGenreId != null) {
      this.getRandomVideo(this.currentGenreId);
      this.loadSeenVideosForGenre(this.currentGenreId);
    } else {
      this.updateDisplayNoVideos();
    }

    this.videoService.getAllGenres()
      .subscribe( data => {
        this.allGenres = data;
      });
  }

  createNewUserCookie() {
    this.videoService.createUser()
      .subscribe( data => {
        this.currentUser = data;
        console.log('created user: ' + this.currentUser);
        this.putCookieObject(this.COOKIE_USER, this.currentUser);
        this.currentGenreId = null;
      });
  }

  getRandomVideo(genreId) {
    this.videoService.getRandomVideoForGenre(genreId, this.currentUser.id)
      .subscribe( data => {
        this.currRandomVideo = data;
        if (this.currRandomVideo == null) {
          this.updateDisplayNoVideos();
          return;
        }
        this.isNextButtonEnabled = true;
      });
  }

  loadSeenVideosForGenre(genreId) {
    this.videoService.getUserVideosForGenre(genreId, this.currentUser.id)
      .subscribe( data => {
        this.seenVideosForGenre = data;
      });
  }

  onClickNextVideoButton() {
    this.getRandomVideo(this.currentGenreId);
    this.markVideoAsViewed(this.currRandomVideo);
  }

  markVideoAsViewed(video) {
    this.videoService.createUserVideo(video, this.currentUser)
      .subscribe( data => {
        this.loadSeenVideosForGenre(this.currentGenreId);
      });
  }

  updateDisplayNoVideos() {
    if (this.currentGenreId == null) {
      this.noVideoMessage = 'Select a genre to play a random video';
    } else {
      this.noVideoMessage = 'No more videos in genre';
    }

    this.isDisplayNoVideoMessage = true;
    this.isNextButtonEnabled = false;
  }

  onGenreSelect(genreId) {
    // record current genre to reload next time the user visits the site
    if (genreId == null) {
      this.putCookie(this.COOKIE_CURRENT_GENRE_ID, null);
      this.seenVideosForGenre = null;
      this.currRandomVideo = null;
      this.updateDisplayNoVideos();
    } else {
      this.putCookie(this.COOKIE_CURRENT_GENRE_ID, genreId.toString());
      this.getRandomVideo(genreId);
      this.loadSeenVideosForGenre(genreId);
    }
  }

  getCookie(key: string) {
    return this._cookieService.get(key);
  }

  putCookie(key: string, value: string) {
    return this._cookieService.put(key, value, this.COOKIE_OPTIONS);
  }

  getCookieObject(key: string) {
    return this._cookieService.getObject(key);
  }

  putCookieObject(key: string, value: Object) {
    return this._cookieService.putObject(key, value, this.COOKIE_OPTIONS);
  }

  setupCookieOptions() {
    const cookieExpiryDate = new Date();
    cookieExpiryDate.setDate((cookieExpiryDate.getDate() + 30));
    this.COOKIE_OPTIONS.expires = cookieExpiryDate;
  }
}
