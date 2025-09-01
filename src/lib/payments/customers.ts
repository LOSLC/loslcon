import { Customer } from "fedapay";

export interface FedapayCustomerCreation {
  firstname: string;
  lastname: string;
  email: string;
  phone_number: {
    number: string;
    country: string;
  };
}

export async function createFedapayCustomer(data: FedapayCustomerCreation) {
  const customer = await Customer.create({ ...data });
}

export async function getFedapayCustomer(id: string) {
  const customer = await Customer.retrieve(id);
  
}
