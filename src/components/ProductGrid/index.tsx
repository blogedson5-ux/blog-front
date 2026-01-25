import { PropsProduct } from "@/types/product";
import { Grid, Card } from "./styles";

import Image from "next/image";

const products = Array.from({ length: 6 });

interface PropsDataProduct {
  dataProduct: PropsProduct[] | undefined;
}

export function ProductGrid({ dataProduct }: PropsDataProduct) {
  const productsRandom = dataProduct
    ? [...dataProduct].sort(() => Math.random() - 0.5).slice(0, 4)
    : [];

  return (
    <Grid>
      {productsRandom.map((item) => (
        <Card key={item._id}>
          <Image
            className="image"
            src={item.image.url}
            alt={item.image.filename}
            width={1000}
            height={1000}
          />
          <h3>{item.name}</h3>
          <span>Consulte disponibilidade</span>
        </Card>
      ))}
    </Grid>
  );
}
