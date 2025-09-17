import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { Button } from "./ui/button";

export default function AdminDashboard({ user }) {
    const [fundTransfers, setFundTransfers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [pendingAlumni, setPendingAlumni] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalFunds, setTotalFunds] = useState(0);
    const [totalEvents, setTotalEvents] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadFundTransfers = async () => {
        try {
            const { data } = await API.get("/fund-request/transfers");
            setFundTransfers(data);
        } catch (e) {
            console.error(e);
        }
    };

    const loadDonations = async () => {
        try {
            const { data } = await API.get("/donation/admin/all");
            setDonations(data);
        } catch (e) {
            console.error(e);
        }
    };

    const loadPendingAlumni = async () => {
        try {
            const { data } = await API.get("/alumni/pending-verification");
            setPendingAlumni(data);
        } catch (e) {}
    };

    const loadStats = async () => {
        try {
            const usersRes = await API.get("/alumni?all=true");
            setTotalUsers(usersRes.data.length);

            const fundsRes = await API.get("/donation/admin/all");
            const total = fundsRes.data.reduce((sum, d) => sum + (d.amount || 0), 0);
            setTotalFunds(total);

            const eventsRes = await API.get("/events");
            setTotalEvents(eventsRes.data.length);
        } catch (e) {}
    };

    const verifyAlumni = async (id) => {
        await API.put(`/alumni/${id}/verify`);
        await loadPendingAlumni();
        alert("Alumni verified!");
    };

    const loadData = async () => {
        setLoading(true);
        await Promise.all([
            loadFundTransfers(),
            loadDonations(),
            loadPendingAlumni(),
            loadStats()
        ]);
        setLoading(false);
    };

    useEffect(() => {
        if (user?.role === "admin") {
            loadData();
        }
    }, [user]);

    if (user?.role !== "admin") {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold mb-6">Admin Dashboard</h3>
            {/* Stat Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-100 rounded-xl p-5 text-center shadow">
                    <p className="text-3xl font-bold text-blue-700">{totalUsers}</p>
                    <p className="text-gray-700 mt-2">Total Users</p>
                </div>
                <div className="bg-green-100 rounded-xl p-5 text-center shadow">
                    <p className="text-3xl font-bold text-green-700">₹{totalFunds}</p>
                    <p className="text-gray-700 mt-2">Total Funds Raised</p>
                </div>
                <div className="bg-yellow-100 rounded-xl p-5 text-center shadow">
                    <p className="text-3xl font-bold text-yellow-700">{totalEvents}</p>
                    <p className="text-gray-700 mt-2">Total Events</p>
                </div>
                <div className="bg-purple-100 rounded-xl p-5 text-center shadow">
                    <p className="text-3xl font-bold text-purple-700">{pendingAlumni.length}</p>
                    <p className="text-gray-700 mt-2">Pending Alumni Verifications</p>
                </div>
            </div>

            {/* Pending Alumni Verification */}
            <h4 className="text-lg font-semibold mb-3 mt-6">Pending Alumni Verification</h4>
            {pendingAlumni.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No pending alumni.</p>
            ) : (
                <div className="space-y-2">
                    {pendingAlumni.map(a => (
                        <div key={a._id} className="flex items-center justify-between border rounded-xl p-3">
                            <div>
                                <p className="font-semibold">{a.name}</p>
                                <p className="text-sm text-gray-600">{a.email}</p>
                            </div>
                            <Button onClick={() => verifyAlumni(a._id)} className="bg-green-600 hover:bg-green-700 text-white">Verify</Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Fund Transfers Table */}
            <h4 className="text-lg font-semibold mb-3 mt-8">Peer-to-Peer Fund Transfers</h4>
            {fundTransfers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No fund transfers recorded yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2">From Alumni</th>
                                <th className="text-left p-2">To Student</th>
                                <th className="text-left p-2">Amount</th>
                                <th className="text-left p-2">Purpose</th>
                                <th className="text-left p-2">Status</th>
                                <th className="text-left p-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fundTransfers.map(transfer => (
                                <tr key={transfer._id} className="border-b">
                                    <td className="p-2">
                                        <div>
                                            <p className="font-medium">{transfer.fromAlumni?.name || "Unknown"}</p>
                                            <p className="text-sm text-gray-600">{transfer.fromAlumni?.email || ""}</p>
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <div>
                                            <p className="font-medium">{transfer.toStudent?.name || "Unknown"}</p>
                                            <p className="text-sm text-gray-600">{transfer.toStudent?.email || ""}</p>
                                        </div>
                                    </td>
                                    <td className="p-2 font-semibold">₹{transfer.amount}</td>
                                    <td className="p-2">
                                        <p className="text-sm">{transfer.fundRequest?.purpose || ""}</p>
                                        <p className="text-xs text-gray-500">{transfer.fundRequest?.description || ""}</p>
                                    </td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            transfer.status === "completed" ? "bg-green-100 text-green-800" :
                                            transfer.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                            "bg-red-100 text-red-800"
                                        }`}>
                                            {transfer.status}
                                        </span>
                                    </td>
                                    <td className="p-2 text-sm text-gray-600">
                                        {transfer.createdAt ? new Date(transfer.createdAt).toLocaleDateString() : ""}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Campaign Donations Table */}
            <h4 className="text-lg font-semibold mb-3 mt-8">Campaign Donations</h4>
            {donations.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No donations recorded yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2">Donor</th>
                                <th className="text-left p-2">Campaign</th>
                                <th className="text-left p-2">Amount</th>
                                <th className="text-left p-2">Message</th>
                                <th className="text-left p-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map(donation => (
                                <tr key={donation._id} className="border-b">
                                    <td className="p-2">
                                        <div>
                                            <p className="font-medium">{donation.donor?.name || "Unknown"}</p>
                                            <p className="text-sm text-gray-600">{donation.donor?.email || ""}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                donation.donor?.role === "admin" ? "bg-red-100 text-red-700" :
                                                donation.donor?.role === "alumni" ? "bg-green-100 text-green-700" :
                                                "bg-blue-100 text-blue-700"
                                            }`}>
                                                {donation.donor?.role || ""}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <div>
                                            <p className="font-medium">{donation.campaign?.title || "Unknown"}</p>
                                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                                                {donation.campaign?.category || ""}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-2 font-semibold">₹{donation.amount}</td>
                                    <td className="p-2 text-sm text-gray-600">
                                        {donation.message || "No message"}
                                    </td>
                                    <td className="p-2 text-sm text-gray-600">
                                        {donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : ""}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}