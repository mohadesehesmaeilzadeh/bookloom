import WishlistBookCard from './WishlistBookCard'

function WishlistBookGrid({ books, onDelete, onEdit, onPurchase }) {
  if (books.length === 0) {
    return null
  }

  return (
    <div className="book-grid wishlist-grid">
      {books.map((book) => (
        <WishlistBookCard
          book={book}
          key={book.id}
          onDelete={onDelete}
          onEdit={onEdit}
          onPurchase={onPurchase}
        />
      ))}
    </div>
  )
}

export default WishlistBookGrid
