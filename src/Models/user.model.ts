export interface Student {
  id: number;
  user_type_id: 1;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  address: {
    city: string;
    street: string;
    number: number;
  };
  age: number;
  family_status: string;
  major_id: number;
  major_name: string;
  study_year: string;
}

export interface Instructor {
  id: number;
  user_type_id: 2;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  address: {
    city: string;
    street: string;
    number: number;
  };
  age: number;
  major_id: number;
  major_name: string;
  courses: string[];
  family_status?: string;  
}

export type User = Student | Instructor;