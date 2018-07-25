export class Genre {
  id: string;
  name: string;
}

export class Video {
  id: string;
  name: string;
  genre: Genre;
  colour: string;
  viewed: number;
}

