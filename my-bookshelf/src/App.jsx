import BookCard from './components/BookCard';

const books = [
  {
    id: 1,
    title: "JavaScript入門",
    author: "田中 太郎",
    rating: "★★★★☆",
    comment: "基礎からていねいで、最初の1冊によかった。",
  },
  {
    id: 2,
    title: "Reactの教科書",
    author: "山田 花子",
    rating: "★★★★★",
    comment: "コンポーネント設計の考え方が勉強になった。",
  },
  {
    id: 3,
    title: "CSS設計完全ガイド",
    author: "鈴木 一郎",
    rating: "★★★☆☆",
    comment: "分厚いが、辞書として手元に置きたい。",
  },
];

function App() {
  return (
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">わたしの本棚</h1>
      
      
      {books.map((book) => (
        <BookCard 
          key={book.id} 
          title={book.title} 
          author={book.author} 
          rating={book.rating} 
          comment={book.comment} 
        />
      ))}
    </main>
  );
}

export default App;