export type News = {
  _id: string;
  titulo: string;
  textOne: string;
  textTwo: string;
  image: {
    url: string;
    public_id: string;
  };
  createdAt: Date;
  updatedAt: Date;
};
