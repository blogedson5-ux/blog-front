"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

import { FiArrowLeft } from "react-icons/fi";

import { Container, BackButton, Form, Field, Button } from "./styles";

export default function LoginForm() {
  const { signIn, alert, loading } = useAuth();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmitAdm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn({ email, password });
    } catch (error) {
      console.log("Error efetuar login:", error);
    }
  };

  return (
    <Container>
      <BackButton onClick={() => router.push("/")}>
        <FiArrowLeft size={20} />
        Voltar
      </BackButton>

      <h2>Login</h2>

      <Form>
        <Field>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>

        <Field>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>

        <Button onClick={handleSubmitAdm} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        <div>{alert?.message}</div>
      </Form>
    </Container>
  );
}
