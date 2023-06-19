// types
import type React from "preact/compat";
import type { ComponentChildren } from "preact";

export type Products = {
  id: string;
  image: string;
  title: string;
  category: string;
  rating: number;
  price: number;
};

export interface ProductsProps {
  products: Products[];
  handleOnClick?: (event: React.TargetedEvent<HTMLButtonElement>) => void;
}

export interface FilterProps {
  buttonTitle: string;
  filterTitle: string;
  values: string[];
  selectedValues: string[];
  handleFilterChange: (selectedValues: string[]) => void;
}

export interface RatingProps {
  orderId: string;
  initialRating: number;
  updateRating: (orderId: string, newRating: number) => void;
}

export interface SearchProps {
  value: string;
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface AuthContextProps {
  isAuthenticated: boolean;
  user: any;
  token: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface CartItem {
  product: {
    price: number;
  };
  quantity: number;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface LayoutProps {
  children: ComponentChildren;
}
