import { useState } from "react";

import { createWishlist } from "../api/wishlist";

export default function NewWishlistForm({ onCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { title, description, is_public: isPublic };
            const response = await createWishlist(data)
            setTitle("");
            setDescription("");
            setIsPublic(false);
            onCreated(response.data);
        } catch (err) {
            console.error("Failed to create wishlist:", err);
            setError(err.response?.data?.message || "Failed to create wishlist. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
            <h3>Create New Wishlist</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div>
                <label>Title:</label><br />
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label>Description:</label><br />
                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        value={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    Public
                </label>
            </div>
            <button type="submit">Create Wishlist</button>
        </form>
    )
}