export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, unknown>;
    authorization?: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
    };
    customer: {
      id: number;
      customer_code: string;
      first_name: string | null;
      last_name: string | null;
      email: string;
      phone: string | null;
      metadata: Record<string, unknown>;
    };
  };
}

export class PaystackClient {
  private secretKey: string;

  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || "sk_test_mock_paystack_secret_key_trendy_ai";
  }

  private isMock(): boolean {
    return this.secretKey.startsWith("sk_test_mock") || !process.env.PAYSTACK_SECRET_KEY;
  }

  async initializeTransaction(params: {
    email: string;
    amountCents: number;
    currency?: string;
    callbackUrl: string;
    metadata: {
      userId: string;
      planId?: string;
      credits: number;
      type: "subscription" | "topup";
    };
  }): Promise<PaystackInitializeResponse> {
    if (this.isMock()) {
      // Simulate API call for local testing / sandbox fallback
      console.log("[Paystack Gateway Mock] Initializing transaction for card checkout:", params);
      const mockReference = `paystack_ref_${Math.random().toString(36).substr(2, 9)}`;
      
      const mockAuthUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/checkout/mock-success?reference=${mockReference}&userId=${params.metadata.userId}&planId=${params.metadata.planId || ""}&credits=${params.metadata.credits}&type=${params.metadata.type}&amountCents=${params.amountCents}`;
      
      return {
        status: true,
        message: "Authorization URL created for Card payment",
        data: {
          authorization_url: mockAuthUrl,
          access_code: `access_code_${mockReference}`,
          reference: mockReference,
        },
      };
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: params.email,
        amount: params.amountCents,
        currency: params.currency || "USD",
        callback_url: params.callbackUrl,
        metadata: params.metadata,
        // Enabling all card payment types: Visa, Mastercard, Amex, Apple Pay, Bank Transfer & Mobile Money
        channels: ["card", "apple_pay", "mobile_money", "bank_transfer"],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to initialize Paystack card checkout transaction");
    }

    return response.json();
  }

  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
    if (this.isMock() || reference.startsWith("paystack_ref_")) {
      // Simulate verify call with card metadata
      return {
        status: true,
        message: "Verification successful",
        data: {
          id: 1234567,
          domain: "test",
          status: "success",
          reference,
          amount: 4900,
          message: "Approved",
          gateway_response: "Successful",
          paid_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          channel: "card",
          currency: "USD",
          ip_address: "127.0.0.1",
          metadata: {},
          authorization: {
            authorization_code: "AUTH_mock_card",
            bin: "408408",
            last4: "4081",
            exp_month: "12",
            exp_year: "2030",
            channel: "card",
            card_type: "visa ",
            bank: "TEST BANK",
            country_code: "US",
            brand: "visa",
            reusable: true,
            signature: "SIG_mock_card",
          },
          customer: {
            id: 98765,
            customer_code: "CUST_mock",
            first_name: "Mock",
            last_name: "User",
            email: "mock@example.com",
            phone: null,
            metadata: {},
          },
        },
      };
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to verify transaction from Paystack");
    }

    return response.json();
  }
}
