export type Category = 'sealed' | 'singles' | 'graded';
export type GradeCompany = 'PSA' | 'BGS' | 'CGC';
export type OrderStatus = 'pending' | 'paid' | 'fulfilled';
export type EmailSource = 'homepage' | 'live_drop' | 'order_success' | 'giveaway';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category: Category;
  set_name: string | null;
  condition: string | null;
  grade: string | null;
  grade_company: GradeCompany | null;
  image_url: string | null;
  stock: number;
  featured: boolean;
  is_live_drop: boolean;
  created_at: string;
}

export interface LiveDrop {
  id: string;
  is_active: boolean;
  next_drop_at: string;
  stream_url: string | null;
  created_at: string;
}

export interface GiveawayEntry {
  id: string;
  first_name: string;
  email: string;
  marketing_opt_in: boolean;
  week_of: string;
  created_at: string;
}

export interface EmailSignup {
  id: string;
  email: string;
  source: EmailSource;
  marketing_opt_in: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: number | null;
  stripe_session_id: string;
  customer_email: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  shipping_address: { street: string; city: string; state: string; zip: string } | null;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
  slug: string;
}
