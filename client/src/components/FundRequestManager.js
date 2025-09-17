import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { Button } from "./ui/button";

export default function FundRequestManager({ user }) {
	const [incomingRequests, setIncomingRequests] = useState([]);
	const [loading, setLoading] = useState(false);
	const [respondingTo, setRespondingTo] = useState("");
	const [responseMessage, setResponseMessage] = useState("");

	const loadIncomingRequests = async () => {
		try {
			setLoading(true);
			const { data } = await API.get("/fund-request/requests?type=incoming");
			setIncomingRequests(data);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user?.role === "alumni") {
			loadIncomingRequests();
		}
	}, [user]);

	const respondToRequest = async (requestId, status) => {
		try {
			await API.put(`/fund-request/request/${requestId}/respond`, {
				status,
				responseMessage
			});
			setResponseMessage("");
			setRespondingTo("");
			await loadIncomingRequests();
			alert(`Request ${status} successfully!`);
		} catch (err) {
			alert(err?.response?.data?.msg || "Failed to respond to request");
		}
	};

	const processTransfer = async (requestId) => {
		try {
			await API.post(`/fund-request/request/${requestId}/transfer`, {
				transferMethod: "razorpay",
				notes: "Fund transfer completed"
			});
			await loadIncomingRequests();
			alert("Fund transfer processed successfully!");
		} catch (err) {
			alert(err?.response?.data?.msg || "Failed to process transfer");
		}
	};

	if (user?.role !== "alumni") {
		return null;
	}

	return (
		<div className="bg-white rounded-2xl shadow p-6">
			<h3 className="text-xl font-bold mb-4">Incoming Fund Requests</h3>
			
			{loading ? (
				<p>Loading...</p>
			) : incomingRequests.length === 0 ? (
				<p className="text-gray-500 text-center py-8">No fund requests received yet.</p>
			) : (
				<div className="space-y-4">
					{incomingRequests.map(request => (
						<div key={request._id} className="border rounded-xl p-4">
							<div className="flex justify-between items-start">
								<div className="flex-1">
									<h4 className="font-semibold">Request from {request.student.name}</h4>
									<p className="text-sm text-gray-600">Amount: ₹{request.amount}</p>
									<p className="text-sm text-gray-600">Purpose: {request.purpose}</p>
									<p className="text-sm text-gray-600">Description: {request.description}</p>
									<p className="text-xs text-gray-500 mt-2">
										Requested on: {new Date(request.createdAt).toLocaleDateString()}
									</p>
								</div>
								<div className="text-right ml-4">
									<span className={`px-2 py-1 rounded-full text-xs ${
										request.status === "pending" ? "bg-yellow-100 text-yellow-800" :
										request.status === "approved" ? "bg-green-100 text-green-800" :
										request.status === "rejected" ? "bg-red-100 text-red-800" :
										"bg-blue-100 text-blue-800"
									}`}>
										{request.status}
									</span>
								</div>
							</div>

							{request.status === "pending" && (
								<div className="mt-4 space-y-3">
									<textarea
										className="w-full px-3 py-2 border rounded-xl"
										placeholder="Response message (optional)"
										value={responseMessage}
										onChange={(e) => setResponseMessage(e.target.value)}
									/>
									<div className="flex gap-2">
										<Button 
											onClick={() => respondToRequest(request._id, "approved")}
											className="bg-green-600 hover:bg-green-700 text-white"
										>
											Approve
										</Button>
										<Button 
											onClick={() => respondToRequest(request._id, "rejected")}
											variant="outline"
											className="border-red-500 text-red-500 hover:bg-red-50"
										>
											Reject
										</Button>
									</div>
								</div>
							)}

							{request.status === "approved" && (
								<div className="mt-4">
									<Button 
										onClick={() => processTransfer(request._id)}
										className="bg-blue-600 hover:bg-blue-700 text-white"
									>
										Process Transfer
									</Button>
								</div>
							)}

							{request.responseMessage && (
								<div className="mt-3 p-2 bg-gray-50 rounded">
									<p className="text-sm"><strong>Your Response:</strong> {request.responseMessage}</p>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
} 