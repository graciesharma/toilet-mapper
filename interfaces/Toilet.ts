export interface Toilet {
  name: string;
  address: string;
  tags: string[];
  description: string;
  coords: {
    latitude: number;
    longitude: number;
  };
  images: string[];
  reviews: string[];
  openingTime: string;
  closingTime: string;
}
