import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Video, Genre } from '../models/app.models';


const httpOptions = {
headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class VideoService {

  constructor(private http:HttpClient) {}

  public getUnseenVideosForGenre(genreId: number, excludeIds: number[]) {
    return this.http.get<Video[]>("/api/videos/exclude/" + excludeIds, {
      params: {
        genreId: genreId
      },
    );
  }

  public getSeenVideosForGenre(genreId: number, includeIds: number[]) {
    return this.http.get<Video[]>("/api/videos/include/" + includeIds, {
      params: {
        genreId: genreId
      },
    );
  }

  public getRandomVideoForGenre() {
    return this.http.get<Video>("/api/videos/random");
  }

  public getAllGenres() {
    return this.http.get<Genre[]>("/api/genres");
  }

}
