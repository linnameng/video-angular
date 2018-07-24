import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Video, Genre } from '../models/app.models';


const httpOptions = {
headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class VideoService {

  constructor(private http:HttpClient) {}

  public getVideos() {
    return this.http.get<Video[]>("/api/videos");
  }

  public getRandomVideo() {
    return this.http.get<Video>("/api/videos/random");
  }

  public getAllGenres() {
    return this.http.get<Genre[]>("/api/genres");
  }

}
