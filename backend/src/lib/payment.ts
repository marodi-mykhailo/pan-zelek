// Mock payment service
// TODO: Integrate with Przelewy24 or Stripe

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  description: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  redirectUrl?: string;
  error?: string;
}

export async function processPayment(
  request: PaymentRequest
): Promise<PaymentResponse> {
  // Mock payment processing
  console.log('Mock payment processing:', request);

  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock: 90% success rate
  const success = Math.random() > 0.1;

  if (success) {
    const paymentId = `mock_payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      paymentId,
      redirectUrl: `/payment/success?paymentId=${paymentId}`,
    };
  }

  return {
    success: false,
    error: 'Mock payment failed (simulated)',
  };
}

export async function verifyPayment(paymentId: string): Promise<boolean> {
  // Mock payment verification
  console.log('Mock payment verification:', paymentId);

  // Simulate verification delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock: always return true for mock payments
  return paymentId.startsWith('mock_payment_');
}
