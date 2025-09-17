import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { Button } from "../components/ui/button";

export default function Events({ user }) {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(false);
	const [creating, setCreating] = useState(false);
	const [form, setForm] = useState({ title: "", description: "", category: "Hackathon", date: "", location: "" });

	const canCreate = user?.role === "admin" || user?.role === "alumni";

	const load = async () => {
		try {
			setLoading(true);
			const { data } = await API.get("/events");
			setEvents(data);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { load(); }, []);

	const createEvent = async (e) => {
		e.preventDefault();
		try {
			setCreating(true);
			await API.post("/events", { ...form });
			setForm({ title: "", description: "", category: "Hackathon", date: "", location: "" });
			await load();
		} catch (e) {
			alert("Failed to create event");
		} finally {
			setCreating(false);
		}
	};

	const register = async (id) => {
		try {
			await API.post(`/events/${id}/register`);
			await load();
		} catch (e) {
			alert("Failed to register for event");
		}
	};

	return (
		<div className="max-w-5xl mx-auto space-y-6">
			<div className="bg-white rounded-2xl shadow p-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-2xl font-bold">Events</h2>
				</div>
				{canCreate && (
					<form onSubmit={createEvent} className="grid md:grid-cols-2 gap-3 mb-4">
						<input className="px-4 py-2 border rounded-xl" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
						<select className="px-4 py-2 border rounded-xl" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
							<option>Hackathon</option>
							<option>Seminar</option>
							<option>TED Talk</option>
							<option>Workshop</option>
							<option>Other</option>
						</select>
						<input className="px-4 py-2 border rounded-xl" type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
						<input className="px-4 py-2 border rounded-xl" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
						<textarea className="md:col-span-2 px-4 py-2 border rounded-xl" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
						<Button type="submit" disabled={creating} className="md:col-span-2">{creating ? "Creating..." : "Create Event"}</Button>
					</form>
				)}

				{loading ? <p>Loading...</p> : (
					<div className="space-y-3">
						{events.map(ev => (
							<div key={ev._id} className="border rounded-xl p-4">
								<div className="flex items-center justify-between">
									<div>
										<h3 className="font-semibold">{ev.title} <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100">{ev.category}</span></h3>
										<p className="text-sm text-gray-600">{new Date(ev.date).toLocaleString()} • {ev.location}</p>
									</div>
									<Button onClick={() => register(ev._id)} variant="outline">Register</Button>
								</div>
								{ev.description && <p className="mt-2">{ev.description}</p>}
								{Array.isArray(ev.attendees) && ev.attendees.length > 0 && (
									<p className="text-xs text-gray-500 mt-1">Attendees: {ev.attendees.length}</p>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
