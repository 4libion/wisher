import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWishlistBySlug } from '../api/wishlist';

export default function PublicWishlistDetail() {
    const { slug } = useParams();
    const [wishlist, setWishlist] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadWishlist = async () => {
            try {
                const response = await fetchWishlistBySlug(slug);
                setWishlist(response.data);
                setItems(response.data.items);
            } catch (err) {
                console.error('Failed to fetch wishlist:', err);
                setError('This wishlist is private or does not exist.');
            } finally {
                setLoading(false);
            }
        };

        loadWishlist();
    }, [slug]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!wishlist) return null;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Wishlist: {wishlist.title}</h1>

            <h2>Items</h2>
            {items.length === 0 ? (
                <p>No items yet.</p>
            ) : (
                <ul>
                    {items.map((item) => (
                        <li key={item.id} style={{ marginBottom: '1rem' }}>
                            <strong>{item.name}</strong> {item.is_purchased && '(✔ purchased)'}
                            <br />
                            {item.url && (
                                <a href={item.url} target='_blank' rel='noopener noreferrer'>
                                    {item.url}
                                </a>
                            )}
                            {item.image && (
                                <div>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{ maxWidth: '150px', marginTop: '0.5rem' }}
                                    />
                                </div>
                            )}
                            <p>{item.notes}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};