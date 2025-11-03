import { useState, useEffect } from 'react';

function BookDetails({ book, onClose }) {
    const [similarBooks, setSimilarBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSimilarBooks = async () => {
            setLoading(true);
            setError(null);

            try {
                // Extract a keyword from the title (first meaningful word)
                let searchQuery = book.title;

                // Try to get a meaningful keyword from the title
                const words = book.title
                    .split(' ')
                    .filter(
                        (word) =>
                            word.length > 3 &&
                            ![
                                'The',
                                'A',
                                'An',
                                'and',
                                'or',
                                'but',
                                'for',
                            ].includes(word)
                    );

                if (words.length > 0) {
                    searchQuery = words[0];
                }

                console.log('Searching for:', searchQuery);

                const response = await fetch(
                    `https://api.itbook.store/1.0/search/${encodeURIComponent(
                        searchQuery
                    )}`
                );

                if (!response.ok) {
                    throw new Error(`API returned status ${response.status}`);
                }

                const data = await response.json();
                console.log('API Response:', data);

                // Filter out the current book from similar books
                const filtered = data.books
                    ? data.books.filter((b) => b.isbn13 !== book.isbn13)
                    : [];

                setSimilarBooks(filtered.slice(0, 6)); // Limit to 6 similar books
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSimilarBooks();
    }, [book]);

    return (
        <div className='book-details-overlay'>
            <div className='book-details-container'>
                <button className='close-details-btn' onClick={onClose}>
                    ✕ Close
                </button>

                <div className='book-details-header'>
                    <div className='book-details-image'>
                        <img src={book.image} alt={book.title} />
                    </div>

                    <div className='book-details-info'>
                        <h2>{book.title}</h2>
                        {book.subtitle && (
                            <p className='subtitle'>{book.subtitle}</p>
                        )}
                        <div className='details-grid'>
                            <div className='detail-item'>
                                <strong>Author:</strong> {book.author || ''}
                            </div>
                            <div className='detail-item'>
                                <strong>Publisher:</strong>{' '}
                                {book.publisher || ''}
                            </div>
                            <div className='detail-item'>
                                <strong>Published:</strong> {book.year || ''}
                            </div>
                            <div className='detail-item'>
                                <strong>Language:</strong> {book.language || ''}
                            </div>
                            <div className='detail-item'>
                                <strong>Pages:</strong> {book.pages || ''}
                            </div>
                        </div>
                        {book.desc && (
                            <div className='book-description'>
                                <strong>Description:</strong>
                                <p>{book.desc}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className='similar-books-section'>
                    <h3>Similar Books</h3>

                    {loading && (
                        <p className='loading-text'>Loading similar books...</p>
                    )}

                    {error && (
                        <p className='error-text'>
                            Error loading similar books: {error}
                        </p>
                    )}

                    {!loading && !error && similarBooks.length > 0 && (
                        <div className='similar-books-grid'>
                            {similarBooks.map((similarBook) => (
                                <a
                                    key={similarBook.isbn13}
                                    href={similarBook.url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='similar-book-card'
                                >
                                    <div className='similar-book-image'>
                                        <img
                                            src={similarBook.image}
                                            alt={similarBook.title}
                                        />
                                    </div>
                                    <div className='similar-book-info'>
                                        <h4>{similarBook.title}</h4>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}

                    {!loading && !error && similarBooks.length === 0 && (
                        <p className='no-results-text'>
                            No similar books found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BookDetails;
