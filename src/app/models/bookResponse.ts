import { BookItem } from "./bookItem.model";

export interface BookResponse {
  message: string;
  data: {
    kind: string;
    totalItems: number;
    items: BookItem[];
  };
}
