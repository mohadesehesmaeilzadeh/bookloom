import WishlistBookCard from './WishlistBookCard'

function WishlistBookList({ books, onDelete, onEdit, onPurchase }) {
  return (
    <div className="book-list wishlist-list">
      {books.map((book) => (
        <WishlistBookCard
          book={book}
          key={book.id}
          layout="list"
          onDelete={onDelete}
          onEdit={onEdit}
          onPurchase={onPurchase}
        />
      ))}
    </div>
  )
}

export default WishlistBookList
