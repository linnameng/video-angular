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
  unseenVideosForGenre: Video[];
  randomVideo: Video;
  allGenres: Genre[];
  selectedGenreId: Number;

  userId: String;

  constructor(private router: Router, private videoService: VideoService, private _cookieService:CookieService) {
    this.userId = this.getCookie('userId');

    if (this.userId != null) {
      console.log('Found existing userId cookie: ' + this.userId);
      // set up stuff for existing user
      this.selectedGenreId = this.getCookie('currentGenreId');
      console.log('Found existing currentGenreId cookie: ' + this.selectedGenreId);
    } else {
      this.putCookie('userId', this.getRandomId());
      console.log('Created new userId cookie: ' + this.getCookie('userId');
      this.selectedGenreId = null;
    }
  }

  ngOnInit() {
    let includeIds = [2,3];

    if (this.selectedGenreId != null) {
      this.videoService.getSeenVideosForGenre(this.selectedGenreId,includeIds)
        .subscribe( data => {
          this.seenVideosForGenre = data;
        });
    }

    this.videoService.getRandomVideoForGenre()
      .subscribe( data => {
        this.randomVideo = data;
      });

    this.videoService.getAllGenres()
      .subscribe( data => {
        this.allGenres = data;
      });
  }

  onGenreSelect(genreId){
    // record current genre to reload next time the user visits the site
    this.putCookie('currentGenreId',genreId.toString());

    let includeIds = [2,3];
    this.videoService.getSeenVideosForGenre(this.selectedGenreId,includeIds)
      .subscribe( data => {
        this.seenVideosForGenre = data;
      });
  }

  getCookie(key: string){
    return this._cookieService.get(key);
  }

  putCookie(key: string, value: string){
    return this._cookieService.put(key, value);
  }

  getRandomId() {
    return Math.floor((Math.random()*6)+1).toString();
  }

}
