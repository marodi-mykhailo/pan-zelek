// Mock email service
// TODO: Integrate with SMTP (Gmail, SendGrid, etc.)

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // Mock email sending
  console.log('Mock email sending:', {
    to: options.to,
    subject: options.subject,
    // Don't log full HTML in console
    htmlLength: options.html.length,
  });

  // Simulate email sending delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock: always succeed
  return true;
}

export async function sendOrderConfirmation(
  email: string,
  orderId: string,
  orderTotal: number
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ec4899;">Dziękujemy za zamówienie!</h2>
      <p>Twoje zamówienie <strong>#${orderId}</strong> zostało przyjęte.</p>
      <p>Łączna kwota: <strong>${orderTotal.toFixed(2)} zł</strong></p>
      <p>Wkótce otrzymasz informacje o statusie zamówienia.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">Pan Żelek - Najlepsze żelki w Polsce</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Potwierdzenie zamówienia #${orderId}`,
    html,
  });
}

export async function sendOrderStatusUpdate(
  email: string,
  orderId: string,
  status: string
): Promise<boolean> {
  const statusMessages: Record<string, string> = {
    CONFIRMED: 'Twoje zamówienie zostało potwierdzone',
    PROCESSING: 'Twoje zamówienie jest w trakcie przygotowania',
    SHIPPED: 'Twoje zamówienie zostało wysłane',
    DELIVERED: 'Twoje zamówienie zostało dostarczone',
    CANCELLED: 'Twoje zamówienie zostało anulowane',
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ec4899;">Aktualizacja zamówienia</h2>
      <p>Status zamówienia <strong>#${orderId}</strong> został zmieniony.</p>
      <p><strong>${statusMessages[status] || status}</strong></p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">Pan Żelek - Najlepsze żelki w Polsce</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Aktualizacja zamówienia #${orderId}`,
    html,
  });
}
