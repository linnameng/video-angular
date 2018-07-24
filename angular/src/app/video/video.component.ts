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

  videos: Video[];
  randomVideo: Video;
  allGenres: Genre[];
  selectedGenre: Number;
  filteredVideos: Video[];

  constructor(private router: Router, private videoService: VideoService, private _cookieService:CookieService) {
    this.selectedGenre = null;
  }

  ngOnInit() {
    this.videoService.getVideos()
      .subscribe( data => {
        this.videos = data;
      });

    this.videoService.getRandomVideo()
      .subscribe( data => {
        this.randomVideo = data;
      });

    this.videoService.getAllGenres()
      .subscribe( data => {
        this.allGenres = data;
      });
  }

  onGenreSelect(genreId){
    this.filteredVideos = this.videos.filter(video => video.genre.id == genreId)
  }

  getCookie(key: string){
    return this._cookieService.get(key);
  }

  putCookie(key: string, value: string){
    return this._cookieService.put(key, value);
  }

}
