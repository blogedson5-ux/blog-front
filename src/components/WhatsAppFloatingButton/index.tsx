"use client";

import { FaWhatsapp } from "react-icons/fa";
import { Container } from "./styles";

interface WhatsAppFloatingButtonProps {
  phone: string; // Ex: "5599999999999"
  message?: string;
}

export function WhatsAppFloatingButton({
  phone,
  message = "Olá! Gostaria de mais informações 😊",
}: WhatsAppFloatingButtonProps) {
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <Container href={whatsappUrl} target="_blank" aria-label="WhatsApp">
      <FaWhatsapp size={32} />
    </Container>
  );
}
