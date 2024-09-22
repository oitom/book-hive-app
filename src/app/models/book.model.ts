export interface Book {
  id: string;
  titulo: string;
  editora: string;
  edicao: number;
  anoPublicacao: number;
  preco: number;
  autores: string[];
  assuntos: string[];
}
