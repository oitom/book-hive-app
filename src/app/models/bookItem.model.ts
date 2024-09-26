export interface BookItem {
  volumeInfo: {
    title: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    description: string;
    pageCount: number;
    categories: string[];
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
    };
    infoLink: string;
  },
  saleInfo: {
    listPrice: {
      amount: number
    }
  };
}
