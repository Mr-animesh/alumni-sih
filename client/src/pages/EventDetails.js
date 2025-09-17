import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { Button } from "../components/ui/button";

export default function EventDetails() {
	const { id } = useParams();
	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const { data } = await API.get(`/events/${id}`);
				setEvent(data);
			} catch (e) {
				// ignore
			} finally {
				setLoading(false);
			}
		})();
	}, [id]);

	const register = async () => {
		try { await API.post(`/events/${id}/register`); alert("Registered"); } catch { alert("Failed"); }
	};

	if (loading) return <div className="p-6">Loading...</div>;
	if (!event) return <div className="p-6">Not found</div>;

	return (
		<div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 space-y-2">
			<h2 className="text-2xl font-bold">{event.title} <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100">{event.category}</span></h2>
			<p className="text-sm text-gray-600">{new Date(event.date).toLocaleString()} • {event.location}</p>
			{event.description && <p>{event.description}</p>}
			<div className="text-sm text-gray-600">Created by: {event.createdBy?.name}</div>
			<Button variant="outline" onClick={register}>Register</Button>
		</div>
	);
}
