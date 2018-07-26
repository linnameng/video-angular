import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Video, Genre, UserVideo, User } from '../models/app.models';

const httpOptions = {
headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class VideoService {

  constructor(private http: HttpClient) {}

  public createUser() {
    return this.http.post<User>('/api/users/add', {});
  }

  public getUser(userId: string) {
    return this.http.get<User>('/api/users/' + userId);
  }

  public createUserVideo(video: Video, user: User) {
    const newUserVideo: UserVideo = new UserVideo;
    newUserVideo.video = video;
    newUserVideo.user = user;
    newUserVideo.viewed = Date.now();
    return this.http.post<UserVideo>('/api/userVideos/add', newUserVideo);
  }

  public getUserVideosForGenre(genreId: string, userId: string) {
    return this.http.get<UserVideo[]>('/api/userVideos/user/' + userId, {
      params: {
        genreId: genreId
      },
    });
  }

  public getRandomVideoForGenre(genreId: string, userId: string) {
    return this.http.get<Video>('/api/videos/random', {
      params: {
        genreId: genreId,
        userId: userId
      },
    });
  }

  public getAllGenres() {
    return this.http.get<Genre[]>('/api/genres');
  }

}
