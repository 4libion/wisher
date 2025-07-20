import { useEffect, useState } from 'react';
import { useUser } from '../auth/UserContext';
import { Link } from 'react-router-dom';

import { fetchWishlists } from '../api/wishlist';

import NewWishlistForm from '../components/NewWishlistForm';

export default function Dashboard() {
    const { user, logout, loading } = useUser();
    const [wishlists, setWishlists] = useState([]);
    const [loadingWishlists, setLoadingWishlists] = useState(true);

    const [shareUrl, setShareUrl] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const loadWishlists = async () => {
            try {
                const res = await fetchWishlists();
                setWishlists(res.data);
            } catch (err) {
                console.error('Failed to fetch wishlists:', err);
            } finally {
                setLoadingWishlists(false);
            }
        };

        if (user) loadWishlists();
    }, [user]);

    const handleWishlistCreated = (newWishlist) => {
        setWishlists((prev) => [...prev, newWishlist]);
    };

    const handleShare = (wishlist) => {
        const url = `${window.location.origin}/wishlist/public/${wishlist.slug}/`;
        setShareUrl(url);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setShareUrl('');
    }

    if (loading || loadingWishlists) return <p>Loading...</p>;
    if (!user) return <p>You must be logged in to view this page.</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Welcome, {user.name || user.username || user.email}!</h1>
            <p>Email: {user.email}</p>
            <button onClick={logout} style={{ marginBottom: '1rem' }}>Logout</button>

            <NewWishlistForm onCreated={handleWishlistCreated} />

            <hr style={{ margin: '1rem 0' }} />

            <h2>Your Wishlists</h2>
            {wishlists.length === 0 ? (
                <p>No wishlists yet.</p>
            ) : (
                <ul>
                    {wishlists.map(wishlist => (
                        <li key={wishlist.id} style={{ marginBottom: '1rem' }}>
                            <div>
                                <Link to={`/wishlist/${wishlist.id}`} style={{ textDecoration: 'none', color: 'white' }}>
                                    <strong>{wishlist.title}</strong> - {wishlist.description || 'No description'}
                                </Link>
                                {wishlist.is_public && (
                                    <>
                                        <span style={{ marginLeft: '0.5rem' }}>(Public)</span>
                                        <button onClick={() => handleShare(wishlist)} style={{ marginLeft: '1rem' }}>
                                            Share
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '10px',
                        maxWidth: '400px',
                        width: '100%'
                    }}>
                        <h3>Share this Wishlist</h3>
                        <input
                            type="text"
                            value={shareUrl}
                            readOnly
                            style={{ width: '100%', marginBottom: '1rem' }}
                        />
                        <button onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy</button>
                        <button onClick={closeModal} style={{ marginLeft: '1rem' }}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}