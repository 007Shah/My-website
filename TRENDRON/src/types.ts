export type ActivePage =
  | 'HOME'
  | 'PRODUCT_DETAILS'
  | 'CHECKOUT'
  | 'UPSELL'
  | 'DOWNSELL'
  | 'ORDER_CONFIRMED'
  | 'TRACK_ORDER'
  | 'DASHBOARD'
  | 'CONTACT';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  rating: number;
  reviewsCount: number;
  tags?: string[];
  description?: string;
  color?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface OrderDetails {
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    zip: string;
  };
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  avatarBg: string;
}
