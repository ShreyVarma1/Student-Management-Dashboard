export interface Trainer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  status: "Active" | "Inactive";
}