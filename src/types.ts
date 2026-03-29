export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stlUrl?: string;
  isTemplate?: boolean;
  basePrice?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  customization?: {
    text?: string;
    font?: string;
    color?: string;
    size?: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'designing' | 'printing' | 'shipped' | 'delivered';
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  stlPreviewApproved?: boolean;
}

export interface CustomDesignRequest {
  id: string;
  userId: string;
  description: string;
  imageUrl?: string;
  status: 'pending' | 'reviewing' | 'designing' | 'ready_for_approval' | 'approved';
  stlUrl?: string;
  estimatedPrice?: number;
  createdAt: string;
}
