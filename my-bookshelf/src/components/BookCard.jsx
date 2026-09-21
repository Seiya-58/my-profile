function BookCard ({title, author, rating, comment}){
    return(
        <div className="bg-gray-100 rounded shadow hover:translate-y-2 transition duration-300 p-4">
            <p className="text-xl font-bold text-center mb-3">{title}</p>
            <p className="text-lg font-semibold mb-3">{author}</p>
            <p className="font-bold">{rating}</p>
            <p className="text-sm">{comment}</p>
        </div>
    );
}
export default BookCard;