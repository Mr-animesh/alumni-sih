import React, { useEffect, useState, useMemo } from "react";
import API from "../utils/api";
import FundRequestManager from "../components/FundRequestManager";
import AdminDashboard from "../components/AdminDashboard";
import {useNavigate} from "react-router-dom";
import { Button } from "../components/ui/button";

export default function Home({ user }) {
	const [stats, setStats] = useState({ totalUsers: 0, totalEvents: 0, totalDonations: 0 });
	const [events, setEvents] = useState([]);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [query, setQuery] = useState("");
	const [tab, setTab] = useState("events");
  const navigate = useNavigate();

useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const [{ data: ev }, { data: us }] = await Promise.all([
					API.get("/events"),
					API.get("/alumni"),
				]);
			setEvents(ev);
			setUsers(us.filter(u => u._id !== user?._id));
			setLoading(false);
			} catch (e) {
				setLoading(false);
			}
		})();
	}, [user]);

const filteredEvents = useMemo(() => {
		const q = query.toLowerCase();
		return events.filter(e =>
			(e.title || "").toLowerCase().includes(q) ||
			(e.location || "").toLowerCase().includes(q)
		);
	}, [events, query]);

	const filteredUsers = useMemo(() => {
		const q = query.toLowerCase();
		return users.filter(u =>
			(u.name || "").toLowerCase().includes(q) ||
			(u.currentJob || "").toLowerCase().includes(q) ||
			(Array.isArray(u.education) && u.education.join(" ").toLowerCase().includes(q))
		);
	}, [users, query]);

	const loadStats = async () => {
		try {
			const [usersRes, eventsRes, donationsRes] = await Promise.all([
				API.get("/alumni"),
				API.get("/events"),
				API.get("/donation/donations")
			]);
			setStats({
				totalUsers: usersRes.data.length,
				totalEvents: eventsRes.data.length,
				totalDonations: donationsRes.data.reduce((sum, d) => sum + d.amount, 0)
			});
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => { loadStats(); }, []);

	return (
		<>
<div className="max-w-6xl mx-auto space-y-4">
			<div className="bg-white rounded-2xl shadow p-4 flex items-center gap-3">
				<input
					className="flex-1 px-4 py-2 border rounded-xl"
					placeholder="Search events by name/location or users by name/college/course/job"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<div className="flex gap-2">
					<Button variant={tab === "events" ? "default" : "outline"} onClick={() => setTab("events")}>Events</Button>
					<Button variant={tab === "users" ? "default" : "outline"} onClick={() => setTab("users")}>Users</Button>
				</div>
			</div>

			{tab === "events" ? (
				<div className="bg-white rounded-2xl shadow p-4 space-y-3">
					<h3 className="text-lg font-semibold">All Events</h3>
					{loading ? <p>Loading...</p> : (
						<div className="grid md:grid-cols-2 gap-3">
							{filteredEvents.map(ev => (
								<div key={ev._id} className="border rounded-xl p-4 cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/events/${ev._id}`)}>
									<h4 className="font-semibold">{ev.title} <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100">{ev.category}</span></h4>
									<p className="text-sm text-gray-600">{new Date(ev.date).toLocaleString()} • {ev.location}</p>
									{ev.description && <p className="mt-1 text-sm">{ev.description}</p>}
								</div>
							))}
						</div>
					)}
				</div>
			) : (
				<div className="bg-white rounded-2xl shadow p-4 space-y-3">
					<h3 className="text-lg font-semibold">Users</h3>
					{loading ? <p>Loading...</p> : (
						<div className="grid md:grid-cols-3 gap-3">
							{filteredUsers.map(u => (
								<div key={u._id} className="border rounded-xl p-3 cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/users/${u._id}`)}>
									<div className="flex items-center justify-between">
										<p className="font-semibold">{u.name} <span className={`ml-2 text-xs px-2 py-0.5 rounded-full capitalize ${u.role === "admin" ? "bg-red-100 text-red-700" : u.role === "alumni" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{u.role}</span></p>
										<Button
											variant="outline"
											onClick={async (e) => {
												e.stopPropagation();
												try {
													await API.post(`/alumni/${u._id}/follow`);
													setUsers(prev => prev.map(x => x._id === u._id ? {
														...x,
														followers: (x.followers || []).some(id => id === user?._id) ? (x.followers || []).filter(id => id !== user?._id) : [ ...(x.followers || []), user?._id ]
													} : x));
												} catch {}
											}}
										>
											{(u.followers || []).some(id => id === user?._id) ? "Unfollow" : "Follow"}
										</Button>
									</div>
									<p className="text-sm text-gray-600">{u.email}</p>
									{u.currentJob && <p className="text-sm">{u.currentJob}</p>}
									{Array.isArray(u.education) && u.education.length > 0 && (
										<p className="text-xs text-gray-600">{u.education[0]}</p>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>

		<div className="max-w-6xl mx-auto space-y-6">
			<div className="grid md:grid-cols-3 gap-4">
				<div className="bg-white rounded-2xl shadow p-6 text-center">
					<h3 className="text-2xl font-bold text-blue-600">{stats.totalUsers}</h3>
					<p className="text-gray-600">Total Users</p>
				</div>
				<div className="bg-white rounded-2xl shadow p-6 text-center">
					<h3 className="text-2xl font-bold text-green-600">{stats.totalEvents}</h3>
					<p className="text-gray-600">Total Events</p>
				</div>
				<div className="bg-white rounded-2xl shadow p-6 text-center">
					<h3 className="text-2xl font-bold text-purple-600">₹{stats.totalDonations}</h3>
					<p className="text-gray-600">Total Donations</p>
				</div>
			</div>

			{user?.role === "alumni" && <FundRequestManager user={user} />}
			{user?.role === "admin" && <AdminDashboard user={user} />}
		</div>
		</>
	);
}
