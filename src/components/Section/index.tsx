import { useRouter } from "next/navigation";
import { Container, Button } from "./styles";

interface Props {
  title: string;
}

export function Section({ title }: Props) {
  const router = useRouter();
  return (
    <Container>
      <h2>{title}</h2>
      <Button onClick={() => router.push("/catalog")}>
        Ver todos os bonés
      </Button>
    </Container>
  );
}
