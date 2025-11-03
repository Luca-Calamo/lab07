function Book({ book, onSelect, onViewDetails }) {
    const handleDetailsClick = (e) => {
        e.stopPropagation(); // Prevent triggering the card selection
        onViewDetails();
    };

    return (
        <div
            className={`container ${book.selected ? 'selected' : ''}`}
            onClick={onSelect}
        >
            {book.isLoaned && <div className='loan-badge'>On loan</div>}
            {book.image && (
                <div className='image'>
                    <img src={book.image} alt={book.title} />
                </div>
            )}
            <div className='info'>
                <h3>{book.title}</h3>
                <p className='author'>by {book.author}</p>
                <button
                    className='view-details-btn'
                    onClick={handleDetailsClick}
                >
                    View Details
                </button>
            </div>
        </div>
    );
}

export default Book;
