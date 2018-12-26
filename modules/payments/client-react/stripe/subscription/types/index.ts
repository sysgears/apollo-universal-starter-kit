export interface CreditCardInput {
  name: string;
  values?: {
    number: string;
    expiry: string;
    cvc: string;
  };
}
