import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    createWishlistItem,
    deleteWishlist,
    deleteWishlistItem,
    fetchWishlist,
    fetchWishlistItems,
    updateWishlist,
    updateWishlistItem
} from "../api/wishlist";

export default function WishlistDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState(null);
    const [items, setItems] = useState([]);
    const [newName, setNewName] = useState('');
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formWishlist, setFormWishlist] = useState({
        title: '',
        description: '',
        is_public: false,
    });
    const [formItem, setFormItem] = useState({
        name: '',
        url: '',
        image: '',
        notes: '',
        is_purchased: false,
    });

    const [editingItemId, setEditingItemId] = useState(null);

    useEffect(() => {
        const loadWishlistData = async () => {
            try {
                const wishlistResponse = await fetchWishlist(id);
                setWishlist(wishlistResponse.data);

                const itemsResponse = await fetchWishlistItems(id);
                setItems(itemsResponse.data);
            } catch (err) {
                console.error("Error loading wishlist:", err);
            } finally {
                setLoading(false);
            }
        };

        loadWishlistData();
    }, [id]);

    const resetFormWishlist = () => {
        setFormWishlist({
            title: '',
            description: '',
            is_public: false,
        });
    };
    const resetFormItem = () => {
        setFormItem({
            name: '',
            url: '',
            image: '',
            notes: '',
            is_purchased: false,
        });
        setEditingItemId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItemId) {
                console.log(`id is: ${editingItemId}`);
                const response = await updateWishlistItem(editingItemId, {
                    ...formItem,
                    wishlist: id,
                });
                setItems((prev) => 
                    prev.map((item) => (item.id === editingItemId ? response.data : item))
                );
            } else {
                const response = await createWishlistItem(id, { ...formItem, wishlist: id });
                setItems((prev) => [...prev, response.data]);
            }
            resetFormItem();
        } catch (err) {
            console.log('Form:', formItem);
            console.error('Failed to submit item:', err);
        }
    };

    const handleEditWishlist = async () => {
        try {
            const response = await updateWishlist(id, formWishlist);
            setWishlist(response.data);
            setEditing(false);
        } catch (err) {
            console.error('Failed to update wishlist:', err);
        }
    };

    const handleDeleteWishlist = async () => {
        if (!window.confirm('Are you sure you want to delete this wishlist?')) return;
        try {
            await deleteWishlist(id);
            navigate('/')
        } catch (err) {
            console.error('Failed to delete wishlist:', err);
        }
    };

    const handleEditItem = async (item) => {
        setEditingItemId(item.id);
        setFormItem({
            name: item.name,
            url: item.url || '',
            image: item.image || '',
            notes: item.notes || '',
            is_purchased: item.is_purchased,
        });
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await deleteWishlistItem(itemId);
            setItems((prev) => prev.filter((item) => item.id != itemId));
        } catch (err) {
            console.error('Failed to delete item:', err);
        }
    };

    if (loading) return <p>Loading wishlist...</p>
    if (!wishlist) return <p>Wishlist not found.</p>

    return (
        <div style={{ padding: '2rem' }}>
            <button onClick={() => navigate(-1)}>⬅ Back</button>
            <h1>Wishlist: {wishlist.title}</h1>

            {editing ? (
                <div style={{ marginBottom: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={formWishlist.title}
                        onChange={(e) => setFormWishlist({ ...formWishlist, title: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={formWishlist.description}
                        onChange={(e) => setFormWishlist({ ...formWishlist, description: e.target.value })}
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={formWishlist.is_public}
                            onChange={(e) => setFormWishlist({ ...formWishlist, is_public: e.target.checked })}
                        />
                        Public
                    </label>
                    <br />
                    <button onClick={handleEditWishlist}>Save</button>
                    <button onClick={() => setEditing(false)}>Cancel</button>
                </div>
            ) : (
                <div style={{ marginBottom: '1rem' }}>
                    <p><strong>Description:</strong> {wishlist.description || 'None'}</p>
                    <p><strong>Public:</strong> {wishlist.is_public ? 'Yes' : 'No'}</p>
                    <button onClick={() => {
                        setFormWishlist({
                            title: wishlist.title,
                            description: wishlist.description || '',
                            is_public: wishlist.is_public,
                        });
                        setEditing(true);
                    }}>
                        Edit Wishlist
                    </button>
                    <button onClick={handleDeleteWishlist} style={{ marginLeft: '1rem', color: 'red' }}>
                        Delete Wishlist
                    </button>
                </div>
            )}

            <h2>{editingItemId ? 'Edit Item' : 'Add New Item '}</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <input
                    type="text"
                    placeholder='Item name'
                    value={formItem.name}
                    onChange={(e) => setFormItem({ ...formItem, name: e.target.value })}
                />
                <input
                    type="url"
                    placeholder='Item URL'
                    value={formItem.url}
                    onChange={(e) => setFormItem({ ...formItem, url: e.target.value })}
                />
                <input
                    type="url"
                    placeholder='Image URL'
                    value={formItem.image}
                    onChange={(e) => setFormItem({ ...formItem, image: e.target.value })}
                />
                <textarea 
                    placeholder='Notes'
                    value={formItem.notes}
                    onChange={(e) => setFormItem({ ...formItem, notes: e.target.value })}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={formItem.is_purchased}
                        onChange={(e) => setFormItem({ ...formItem, is_purchased: e.target.checked })}
                    />
                    Purchased
                </label>
                <br />
                <button type='submit'>
                    {editingItemId ? 'Update Item' : 'Add Item'}
                </button>
                {editingItemId && (
                    <button type='button' onClick={resetFormItem}>
                        Cancel Edit
                    </button>
                )}
            </form>

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
                            <button onClick={() => handleEditItem(item)}>Edit</button>
                            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};