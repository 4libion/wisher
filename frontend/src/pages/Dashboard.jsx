import { useEffect, useState } from 'react';
import { useUser } from '../auth/UserContext';
import { useNavigate } from 'react-router-dom';
import { fetchWishlists } from '../api/wishlist';
import api from '../auth/axiosConfig';

export default function Dashboard() {
    const { user, logout, loading } = useUser();
    const [wishlists, setWishlists] = useState([]);
    const [isLoadingWishlists, setIsLoadingWishlists] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadWishlists = async () => {
            try {
                const res = await fetchWishlists();
                setWishlists(res.data);
            } catch (err) {
                console.error('Failed to fetch wishlists:', err);
            } finally {
                setIsLoadingWishlists(false);
            }
        };

        if (user) loadWishlists();
    }, [user]);

    if (loading || isLoadingWishlists) return <p>Loading...</p>;
    if (!user) return <p>You must be logged in to view this page.</p>;

    // const goToWishlist = (id) => navigate(`/wishlist/${id}`);
    // const goToCreateWishlist = () => navigate('/wishlist/create');

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Welcome, {user.name || user.username || user.email}!</h1>
            <p>Email: {user.email}</p>
            <button onClick={logout} style={{ marginBottom: '1rem' }}>Logout</button>

            <hr style={{ margin: '1rem 0' }} />

            <h2>Your Wishlists</h2>
            {wishlists.length === 0 ? (
                <p>No wishlists yet.</p>
            ) : (
                <ul>
                    {wishlists.map(wishlist => (
                        <li
                            key={wishlist.id}
                            style={{ cursor: 'pointer', marginBottom: '1rem' }}
                        >
                            <strong>{wishlist.title}</strong> ({wishlist.is_public ? 'Public' : 'Private'})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}