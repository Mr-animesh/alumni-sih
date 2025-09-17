import React, { useState } from "react";
import ResumeUpload from "../components/ResumeUpload";
import API from "../utils/api";
import { Button } from "../components/ui/button";

export default function Profile({ user, selectedUser, onSelectUser, onLogout }) {
	const [form, setForm] = useState({
		phone: user.phone || "",
		address: user.address || "",
		description: user.description || "",
	});
	const [saving, setSaving] = useState(false);

	const handleSave = async () => {
		try {
			setSaving(true);
			const { data } = await API.put("/alumni/me", form);
			if (data?.success) {
				alert("Profile updated");
			} else {
				alert("Failed to update profile");
			}
		} catch (e) {
			alert("Error updating profile");
		} finally {
			setSaving(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		onLogout();
	};

	return (
		// <div className="max-w-5xl mx-auto space-y-6">
		// 	<div className="bg-white rounded-2xl shadow p-6">
		// 		<div className="flex justify-between items-center mb-4">
		// 			<h2 className="text-2xl font-bold">My Profile</h2>
		// 			<Button 
		// 				onClick={handleLogout}
		// 				className="bg-red-600 hover:bg-red-700 text-white"
		// 			>
		// 				Logout
		// 			</Button>
		// 		</div>
		// 		<div className="grid md:grid-cols-2 gap-4">
		// 			<div>
		// 				<p><span className="font-semibold">Name:</span> {user.name}</p>
		// 				<p><span className="font-semibold">Role:</span> <span className="capitalize">{user.role}</span></p>
		// 				{user.phone && <p><span className="font-semibold">Phone:</span> {user.phone}</p>}
		// 				{user.address && <p><span className="font-semibold">Address:</span> {user.address}</p>}
		// 				{user.description && <p><span className="font-semibold">About:</span> {user.description}</p>}
		// 				<p><span className="font-semibold">Email:</span> {user.email}</p>
		// 				{user.currentJob && <p><span className="font-semibold">Current Job:</span> {user.currentJob}</p>}
		// 				{Array.isArray(user.skills) && user.skills.length > 0 && (
		// 					<p><span className="font-semibold">Skills:</span> {user.skills.join(", ")}</p>
		// 				)}
		// 				{Array.isArray(user.education) && user.education.length > 0 && (
		// 					<p><span className="font-semibold">Education:</span> {user.education.join(", ")}</p>
		// 				)}
		// 				{Array.isArray(user.experience) && user.experience.length > 0 && (
		// 					<p><span className="font-semibold">Experience:</span> {user.experience.join(", ")}</p>
		// 				)}
		// 			</div>
		// 		</div>
		// 	</div>

		// 	<ResumeUpload />

		// 	<div className="bg-white rounded-2xl shadow p-6 space-y-3">
		// 		<h3 className="text-lg font-semibold">Edit Contact & About</h3>
		// 		<input
		// 			className="w-full px-4 py-2 border rounded-xl"
		// 			placeholder="Phone"
		// 			value={form.phone}
		// 			onChange={(e) => setForm({ ...form, phone: e.target.value })}
		// 		/>
		// 		<input
		// 			className="w-full px-4 py-2 border rounded-xl"
		// 			placeholder="Address"
		// 			value={form.address}
		// 			onChange={(e) => setForm({ ...form, address: e.target.value })}
		// 		/>
		// 		<textarea
		// 			className="w-full px-4 py-2 border rounded-xl min-h-24"
		// 			placeholder="Short description / about"
		// 			value={form.description}
		// 			onChange={(e) => setForm({ ...form, description: e.target.value })}
		// 		/>
		// 		<Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
		// 	</div>
		// </div>
		<div className="max-w-6xl mx-auto space-y-8">
  {/* Top Section - Profile Overview */}
  <div className="grid md:grid-cols-3 gap-6">
    {/* Profile Info Card */}
    <div className="md:col-span-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-gray-100">
      <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
        {user.name?.charAt(0).toUpperCase()}
      </div>
      <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h2>
      <p className="capitalize text-gray-500">{user.role}</p>
      {user.currentJob && (
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium">Current Job:</span> {user.currentJob}
        </p>
      )}
      <Button 
        onClick={handleLogout}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition"
      >
        Logout
      </Button>
    </div>

    {/* Contact Info Card */}
    <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
      <div className="grid md:grid-cols-2 gap-4 text-gray-700">
        <p><span className="font-semibold">Email:</span> {user.email}</p>
        {user.phone && <p><span className="font-semibold">Phone:</span> {user.phone}</p>}
        {user.address && <p><span className="font-semibold">Address:</span> {user.address}</p>}
      </div>
    </div>
  </div>

  {/* About & Skills Section */}
  <div className="grid md:grid-cols-2 gap-6">
    {/* About Card */}
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">About</h3>
      {user.description ? (
        <p className="text-gray-700">{user.description}</p>
      ) : (
        <p className="text-gray-400 italic">No description added yet.</p>
      )}
    </div>

    {/* Skills Card */}
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">Skills</h3>
      {Array.isArray(user.skills) && user.skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {user.skills.map((skill, i) => (
            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 italic">No skills added yet.</p>
      )}
    </div>
  </div>

  {/* Education & Experience Section */}
  <div className="grid md:grid-cols-2 gap-6">
    {/* Education Card */}
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">Education</h3>
      {Array.isArray(user.education) && user.education.length > 0 ? (
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {user.education.map((edu, i) => <li key={i}>{edu}</li>)}
        </ul>
      ) : (
        <p className="text-gray-400 italic">No education details yet.</p>
      )}
    </div>

    {/* Experience Card */}
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">Experience</h3>
      {Array.isArray(user.experience) && user.experience.length > 0 ? (
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {user.experience.map((exp, i) => <li key={i}>{exp}</li>)}
        </ul>
      ) : (
        <p className="text-gray-400 italic">No experience details yet.</p>
      )}
    </div>
  </div>

  {/* Resume Upload */}
  <ResumeUpload />

  {/* Edit Form */}
  <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 space-y-4">
    <h3 className="text-xl font-semibold text-gray-800">Edit Contact & About</h3>
    
    <input
      className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      placeholder="Phone"
      value={form.phone}
      onChange={(e) => setForm({ ...form, phone: e.target.value })}
    />
    <input
      className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      placeholder="Address"
      value={form.address}
      onChange={(e) => setForm({ ...form, address: e.target.value })}
    />
    <textarea
      className="w-full px-4 py-2 border rounded-xl min-h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      placeholder="Short description / about"
      value={form.description}
      onChange={(e) => setForm({ ...form, description: e.target.value })}
    />
    <Button 
      onClick={handleSave} 
      disabled={saving}
      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-300 disabled:opacity-50"
    >
      {saving ? "Saving..." : "Save"}
    </Button>
  </div>
</div>

	);
}
