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

  COOKIE_USER_ID = 'userId';
  COOKIE_CURRENT_GENRE_ID = 'currentGenreId';

  constructor(private router: Router, private videoService: VideoService, private _cookieService:CookieService) {
    this.userId = this.getCookie('userId');

    if (this.userId != null) {
      console.log('Found existing userId cookie: ' + this.userId);
      // set up stuff for existing user
      this.selectedGenreId = this.getCookie('currentGenreId');
      console.log('Found existing currentGenreId cookie: ' + this.selectedGenreId);
    } else {
      this.putCookie('userId', this.getRandomId());
      console.log('Created new userId cookie: ' + this.getCookie('userId'));
      this.selectedGenreId = null;
    }
  }

  ngOnInit() {
    let includeIds = ['2', '3'];

    if (this.selectedGenreId != null) {
      this.getRandomVideoAndMarkAsViewed();

      this.videoService.getSeenVideosForGenre(this.selectedGenreId, includeIds)
        .subscribe( data => {
          this.seenVideosForGenre = data;
        });
    }

    this.videoService.getAllGenres()
      .subscribe( data => {
        this.allGenres = data;
      });
  }

  getRandomVideoAndMarkAsViewed() {
    let excludeIds = [''];

    let initialGenreId = this.selectedGenreId;

    if (initialGenreId === undefined) {
      console.log('no genre');
      return;
    }

    let seenVideosCookie = this.getCookie(initialGenreId);
    console.log('loading random video, selectedGenre: ' + initialGenreId + ' seenVideosCookie: ' + seenVideosCookie);

    if (seenVideosCookie !== undefined) {
      console.log('seenVideosCookie is defined');
      excludeIds = JSON.parse(seenVideosCookie);
    }

    this.videoService.getRandomVideoForGenre(initialGenreId, excludeIds)
      .subscribe( data => {
        this.randomVideo = data;
        if (this.randomVideo == undefined) {
          console.log('random video undefined');
          return;
        }
        if (seenVideosCookie === undefined) {
          this.putCookie(this.selectedGenreId, JSON.stringify([ this.randomVideo.id ]));
          console.log('Creating cookie for genre: ' + this.selectedGenreId + ': ' + this.getCookie(this.selectedGenreId));
        } else {
          let genreArray = JSON.parse(seenVideosCookie);
          console.log('genreArray: ' + genreArray);
          genreArray.push(this.randomVideo.id);
          this.putCookie(this.selectedGenreId, JSON.stringify(genreArray));
          console.log('genre cookie: ' + this.getCookie(this.selectedGenreId));
        }
      });

  }

  onGenreSelect(genreId){
    // record current genre to reload next time the user visits the site
    if (genreId == null) {
      this.putCookie('currentGenreId', null);
      this.seenVideosForGenre = null;
      this.randomVideo = null;
    } else {
      this.putCookie('currentGenreId', genreId.toString());
      this.getRandomVideoAndMarkAsViewed();
      
      let includeIds = [''];
      let seenVideosCookie = this.getCookie(genreId.toString());
  
      if (seenVideosCookie !== undefined) {
        includeIds = JSON.parse(seenVideosCookie);
      }

      this.videoService.getSeenVideosForGenre(this.selectedGenreId, includeIds)
        .subscribe( data => {
          this.seenVideosForGenre = data;
        });
    }
  }

  getCookie(key: string) {
    return this._cookieService.get(key);
  }

  putCookie(key: string, value: string) {
    return this._cookieService.put(key, value);
  }

  deleteCookies(key: string, value: string) {
    return this._cookieService.removeAll();
  }

  getRandomId() {
    return Math.floor((Math.random() * 6) + 1).toString();
  }

}
