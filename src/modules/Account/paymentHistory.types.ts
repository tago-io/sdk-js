import { GenericID } from "../../common/common.types";

interface PaymentInfo {
  status: boolean;
  result: [
    {
      id: GenericID;
      stripe_id: GenericID;
      account: GenericID;
      info: string;
      notes: string;
      invoice_number: number;
      invoice_code: string;
      total: number;
      due_date: string;
      payment_method: string;
      created_at: string;
      updated_at: string;
      paid: true;
      ref_account: {
        name: string;
        email: string;
        id: GenericID;
        send_invoice: boolean;
      };
      ref_payment_method: { last4: string; brand: string };
      account_invoice_items: {
        unit_value: number;
        description: string;
        qty: number;
        value: number;
      }[];
    }
  ];
}

export { PaymentInfo };
