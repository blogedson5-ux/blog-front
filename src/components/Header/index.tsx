"use client";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Container } from "./styles";

import { CgProfile } from "react-icons/cg";
import { IoHomeSharp } from "react-icons/io5";

export function Header() {
  const router = useRouter();

  const [credentialVerifier, setCredentialVerifier] = useState(false);

  const { "nextauth.token": tokenParse } = parseCookies();
  const { "nextauth.userId": tokenUserId } = parseCookies();

  useEffect(() => {
    setCredentialVerifier(Boolean(tokenParse && tokenUserId));
  }, [tokenParse, tokenUserId]);

  console.log(credentialVerifier);

  return (
    <Container>
      <h1>Simões Boné</h1>

      {credentialVerifier ? (
        <button onClick={() => router.push(`/dashboard/admin/${tokenUserId}`)}>
          <IoHomeSharp />
        </button>
      ) : (
        <button onClick={() => router.push("/auth")}>
          <CgProfile />
        </button>
      )}
    </Container>
  );
}
