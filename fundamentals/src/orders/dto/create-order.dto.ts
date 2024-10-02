export class CreateOrderDto {
    userId: number;
    products: {
      id: number;                     // Product ID
      quantity: number;               // Quantity of the product being ordered
      price: number;                  // Unit price of the product
      name: string;            // Name of the product
      description: string;      // Description of the product
      imageUrl: string;               // Image URL of the product
    }[];
  }
  