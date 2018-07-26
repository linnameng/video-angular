export class Genre {
  id: string;
  name: string;
}

export class Video {
  id: string;
  name: string;
  genre: Genre;
  color: string;
}

export class User {
  id: string;
}

export class UserVideo {
  id: string;
  user: User;
  video: Video;
  viewed: number;
}


