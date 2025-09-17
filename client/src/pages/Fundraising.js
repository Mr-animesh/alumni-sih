import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { Button } from "../components/ui/button";

export default function Fundraising({ user }) {
	const [campaigns, setCampaigns] = useState([]);
	const [fundRequests, setFundRequests] = useState([]);
	const [alumniList, setAlumniList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [creating, setCreating] = useState(false);
	const [donatingId, setDonatingId] = useState("");
	const [donationAmount, setDonationAmount] = useState("");
	const [donationMsg, setDonationMsg] = useState("");
	const [form, setForm] = useState({ title: "", category: "Student Aid", targetAmount: "", description: "" });
	
	// Fund request form
	const [requestForm, setRequestForm] = useState({
		alumniId: "",
		amount: "",
		purpose: "",
		description: ""
	});
	const [creatingRequest, setCreatingRequest] = useState(false);
	const [activeTab, setActiveTab] = useState("campaigns"); // "campaigns" or "requests"

	const canCreate = user?.role === "alumni"; // Only alumni can create campaigns
	const canDonate = user?.role === "student" || user?.role === "alumni"; // Students and alumni can donate

	const load = async () => {
		try {
			setLoading(true);
			const { data } = await API.get("/donation");
			setCampaigns(data);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const loadFundRequests = async () => {
		try {
			const { data } = await API.get("/fund-request/requests?type=outgoing");
			setFundRequests(data);
		} catch (e) {
			console.error(e);
		}
	};

	const loadAlumniList = async () => {
		try {
			const { data } = await API.get("/fund-request/alumni");
			setAlumniList(data);
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => { 
		load(); 
		if (user?.role === "student") {
			loadFundRequests();
			loadAlumniList();
		}
	}, [user]);

	const create = async (e) => {
		e.preventDefault();
		try {
			setCreating(true);
			await API.post("/donation", {
				title: form.title,
				category: form.category,
				description: form.description,
				targetAmount: Number(form.targetAmount || 0),
			});
			setForm({ title: "", category: "Student Aid", targetAmount: "", description: "" });
			await load();
		} catch {
			alert("Failed to create campaign");
		} finally {
			setCreating(false);
		}
	};

	const createFundRequest = async (e) => {
		e.preventDefault();
		try {
			setCreatingRequest(true);
			await API.post("/fund-request/request", requestForm);
			setRequestForm({ alumniId: "", amount: "", purpose: "", description: "" });
			await loadFundRequests();
			alert("Fund request sent successfully!");
		} catch (err) {
			alert(err?.response?.data?.msg || "Failed to create fund request");
		} finally {
			setCreatingRequest(false);
		}
	};

	const donate = async (id) => {
		try {
			const amount = Number(donationAmount || 0);
			if (!amount || amount <= 0) { 
				alert("Enter a valid amount"); 
				return; 
			}
			
			const { data } = await API.post(`/donation/${id}/donate`, { 
				amount, 
				message: donationMsg 
			});
			
			alert("Thank you for your donation!");
			setDonatingId(""); 
			setDonationAmount(""); 
			setDonationMsg("");
			await load();
		} catch (err) {
			alert(err?.response?.data?.msg || "Failed to process donation");
		}
	};

	return (
		<div className="max-w-5xl mx-auto space-y-6">
			<div className="bg-white rounded-2xl shadow p-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-2xl font-bold">Fundraising</h2>
					{user?.role === "student" && (
						<div className="flex gap-2">
							<Button 
								onClick={() => setActiveTab("campaigns")}
								variant={activeTab === "campaigns" ? "default" : "outline"}
							>
								Campaigns
							</Button>
							<Button 
								onClick={() => setActiveTab("requests")}
								variant={activeTab === "requests" ? "default" : "outline"}
							>
								My Requests
							</Button>
						</div>
					)}
				</div>

				{activeTab === "campaigns" && (
					<>
						{canCreate && (
							<form onSubmit={create} className="grid md:grid-cols-2 gap-3 mb-4">
								<input className="px-4 py-2 border rounded-xl" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
								<select className="px-4 py-2 border rounded-xl" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
									<option>Student Aid</option>
									<option>University</option>
									<option>Event</option>
									<option>Other</option>
								</select>
								<input className="px-4 py-2 border rounded-xl" type="number" min="1" placeholder="Target Amount" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} required />
								<textarea className="md:col-span-2 px-4 py-2 border rounded-xl" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
								<Button type="submit" disabled={creating} className="md:col-span-2">{creating ? "Creating..." : "Create Campaign"}</Button>
							</form>
						)}

						{user?.role === "student" && (
							<div className="mb-6 p-4 bg-blue-50 rounded-xl">
								<h3 className="font-semibold mb-3">Request Funds from Alumni</h3>
								<form onSubmit={createFundRequest} className="grid md:grid-cols-2 gap-3">
									<select 
										className="px-4 py-2 border rounded-xl" 
										value={requestForm.alumniId} 
										onChange={(e) => setRequestForm({ ...requestForm, alumniId: e.target.value })}
										required
									>
										<option value="">Select Alumni</option>
										{alumniList.map(alumni => (
											<option key={alumni._id} value={alumni._id}>
												{alumni.name} - {alumni.currentJob || "Alumni"}
											</option>
										))}
									</select>
									<input 
										className="px-4 py-2 border rounded-xl" 
										type="number" 
										min="1" 
										placeholder="Amount (₹)" 
										value={requestForm.amount} 
										onChange={(e) => setRequestForm({ ...requestForm, amount: e.target.value })}
										required 
									/>
									<input 
										className="px-4 py-2 border rounded-xl" 
										placeholder="Purpose" 
										value={requestForm.purpose} 
										onChange={(e) => setRequestForm({ ...requestForm, purpose: e.target.value })}
										required 
									/>
									<textarea 
										className="md:col-span-2 px-4 py-2 border rounded-xl" 
										placeholder="Description" 
										value={requestForm.description} 
										onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
										required 
									/>
									<Button type="submit" disabled={creatingRequest} className="md:col-span-2">
										{creatingRequest ? "Sending..." : "Send Request"}
									</Button>
								</form>
							</div>
						)}

						{loading ? <p>Loading...</p> : (
							<div className="space-y-3">
								{campaigns.map(c => (
									<div key={c._id} className="border rounded-xl p-4">
										<div className="flex items-center justify-between">
											<div>
												<h3 className="font-semibold">{c.title} <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100">{c.category}</span></h3>
												<p className="text-sm text-gray-600">Raised ₹{c.currentAmount} / ₹{c.targetAmount}</p>
											</div>
										</div>
										{c.description && <p className="mt-2">{c.description}</p>}
										{canDonate && (
											<div className="mt-3 grid md:grid-cols-3 gap-2 items-center">
												<input className="px-3 py-2 border rounded-xl" type="number" min="1" placeholder="Amount" value={donatingId === c._id ? donationAmount : ""} onChange={(e) => { setDonatingId(c._id); setDonationAmount(e.target.value); }} />
												<input className="px-3 py-2 border rounded-xl md:col-span-2" placeholder="Message (optional)" value={donatingId === c._id ? donationMsg : ""} onChange={(e) => { setDonatingId(c._id); setDonationMsg(e.target.value); }} />
												<Button onClick={() => donate(c._id)} variant="outline">Donate</Button>
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</>
				)}

				{activeTab === "requests" && user?.role === "student" && (
					<div className="space-y-3">
						{fundRequests.length === 0 ? (
							<p className="text-gray-500 text-center py-8">No fund requests sent yet.</p>
						) : (
							fundRequests.map(request => (
								<div key={request._id} className="border rounded-xl p-4">
									<div className="flex justify-between items-start">
										<div>
											<h3 className="font-semibold">
												Request to {request.alumni?.name || "Unknown Alumni"}
											</h3>
											<p className="text-sm text-gray-600">Amount: ₹{request.amount}</p>
											<p className="text-sm text-gray-600">Purpose: {request.purpose}</p>
											<p className="text-sm text-gray-600">Description: {request.description}</p>
										</div>
										<div className="text-right">
											<span className={`px-2 py-1 rounded-full text-xs ${
												request.status === "pending" ? "bg-yellow-100 text-yellow-800" :
												request.status === "approved" ? "bg-green-100 text-green-800" :
												request.status === "rejected" ? "bg-red-100 text-red-800" :
												"bg-blue-100 text-blue-800"
											}`}>
												{request.status}
											</span>
											<p className="text-xs text-gray-500 mt-1">
												{new Date(request.createdAt).toLocaleDateString()}
											</p>
										</div>
									</div>
									{request.responseMessage && (
										<div className="mt-2 p-2 bg-gray-50 rounded">
											<p className="text-sm"><strong>Response:</strong> {request.responseMessage}</p>
										</div>
									)}
								</div>
							))
						)}
					</div>
				)}
			</div>
		</div>
	);
}
