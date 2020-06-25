export default interface Book {
    id: number;
    name: string;
    year: number;
    genre: string
    author: string;
    choosed?: boolean;
}