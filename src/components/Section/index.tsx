import { Container, Button } from './styles';

interface Props {
  title: string;
}

export function Section({ title }: Props) {
  return (
    <Container>
      <h2>{title}</h2>
      <Button>Ver todos os bonés</Button>
    </Container>
  );
}
