type NewsImage = {
  url: string;
  public_id: string;
};

type News = {
  _id: string;
  titulo: string;
  textOne: string;
  category: string;
  image: NewsImage;
  videoUrl: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};
