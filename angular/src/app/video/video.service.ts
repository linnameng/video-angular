import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Video, Genre } from '../models/app.models';


const httpOptions = {
headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class VideoService {

  constructor(private http: HttpClient) {}

  public getSeenVideosForGenre(genreId: string, includeIds: string[]) {
    return this.http.get<Video[]>('/api/videos/seen', {
      params: {
        genreId: genreId,
        includeIds: includeIds
      },
    });
  }

  public getRandomVideoForGenre(genreId: string, excludeIds: string[]) {
    return this.http.get<Video>('/api/videos/random', {
      params: {
        genreId: genreId,
        excludeIds: excludeIds
      },
    });
  }

  public getAllGenres() {
    return this.http.get<Genre[]>('/api/genres');
  }

}
