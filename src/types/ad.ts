export interface AdImage {
  _id: string;
  url: string;
  public_id: string;
}

export interface Ad {
  _id: string;
  titulo: string;
  descricao: string;
  link: string;
  images: AdImage[];
  createdAt: string;
  updatedAt: string;
}
