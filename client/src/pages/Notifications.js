import React, { useEffect, useState } from "react";
import API from "../utils/api";

export default function Notifications() {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(false);

	const load = async () => {
		try {
			setLoading(true);
			const { data } = await API.get("/notification/notification");
			setItems(data);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { load(); }, []);

	const markRead = async (id) => {
		try {
			await API.put(`/notification/${id}/read`);
			setItems(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
		} catch {}
	};

	return (
		<div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
			<h2 className="text-2xl font-bold mb-3">Notifications</h2>
			{loading ? (
				<div>
				<p>Loading...</p>
				<h1>Hello</h1>
				</div>
			) : (
				<div className="space-y-2">
					{items.map(n => (
						<div key={n._id} className={`border rounded-xl p-3 ${n.read ? "opacity-70" : ""}`}>
							<p>{n.message}</p>
							<div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
							{!n.read && <button className="text-blue-600 text-sm" onClick={() => markRead(n._id)}>Mark as read</button>}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
