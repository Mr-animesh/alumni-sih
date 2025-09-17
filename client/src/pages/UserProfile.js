import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";

export default function UserProfile() {
	const { id } = useParams();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const { data } = await API.get(`/alumni/${id}`);
				setUser(data);
			} catch (e) {
				setError("Failed to load user");
			} finally {
				setLoading(false);
			}
		})();
	}, [id]);

	if (loading) return <div className="p-6">Loading...</div>;
	if (error) return <div className="p-6 text-red-600">{error}</div>;
	if (!user) return null;

	return (
		// <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 space-y-3">
		// 	<h2 className="text-2xl font-bold">{user.name} <span className="ml-2 text-xs px-2 py-0.5 rounded-full capitalize bg-gray-100 text-gray-700">{user.role}</span></h2>
		// 	<p><span className="font-semibold">Email:</span> {user.email}</p>
		// 	{user.phone && <p><span className="font-semibold">Phone:</span> {user.phone}</p>}
		// 	{user.address && <p><span className="font-semibold">Address:</span> {user.address}</p>}
		// 	{user.description && <p><span className="font-semibold">About:</span> {user.description}</p>}
		// 	{user.currentJob && <p><span className="font-semibold">Current Job:</span> {user.currentJob}</p>}
		// 	{Array.isArray(user.skills) && user.skills.length > 0 && (
		// 		<p><span className="font-semibold">Skills:</span> {user.skills.join(", ")}</p>
		// 	)}
		// 	{Array.isArray(user.education) && user.education.length > 0 && (
		// 		<p><span className="font-semibold">Education:</span> {user.education.join(", ")}</p>
		// 	)}
		// 	{Array.isArray(user.experience) && user.experience.length > 0 && (
		// 		<p><span className="font-semibold">Experience:</span> {user.experience.join(", ")}</p>
		// 	)}
		// </div>


		<div className="max-w-5xl mx-auto mt-8 grid md:grid-cols-2 gap-6">
  {/* Profile Header */}
  <div className="col-span-2 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl shadow p-6 flex items-center justify-between">
    <div>
      <h2 className="text-2xl font-bold">{user.name}</h2>
      <p className="mt-1 text-sm text-gray-600">{user.role}</p>
    </div>
    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-200 text-blue-800 font-bold text-xl">
      {user.name?.charAt(0).toUpperCase()}
    </div>
  </div>

  {/* Contact Info */}
  <div className="bg-white rounded-2xl shadow p-6 space-y-3">
    <h3 className="text-lg font-semibold mb-2">Contact Info</h3>
    <p><span className="font-semibold">Email:</span> {user.email}</p>
    {user.phone && <p><span className="font-semibold">Phone:</span> {user.phone}</p>}
    {user.address && <p><span className="font-semibold">Address:</span> {user.address}</p>}
  </div>

  {/* About */}
  <div className="bg-white rounded-2xl shadow p-6">
    <h3 className="text-lg font-semibold mb-2">About</h3>
    <p className="text-gray-700">{user.description || "No description available."}</p>
  </div>

  {/* Job */}
  {user.currentJob && (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold mb-2">Current Job</h3>
      <p>{user.currentJob}</p>
    </div>
  )}

  {/* Skills */}
  {Array.isArray(user.skills) && user.skills.length > 0 && (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold mb-2">Skills</h3>
      <div className="flex flex-wrap gap-2">
        {user.skills.map((skill, idx) => (
          <span
            key={idx}
            className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )}

  {/* Education */}
  {Array.isArray(user.education) && user.education.length > 0 && (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold mb-2">Education</h3>
      <ul className="list-disc pl-4 space-y-1 text-gray-700">
        {user.education.map((edu, idx) => (
          <li key={idx}>{edu}</li>
        ))}
      </ul>
    </div>
  )}

  {/* Experience */}
  {Array.isArray(user.experience) && user.experience.length > 0 && (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold mb-2">Experience</h3>
      <ul className="list-disc pl-4 space-y-1 text-gray-700">
        {user.experience.map((exp, idx) => (
          <li key={idx}>{exp}</li>
        ))}
      </ul>
    </div>
  )}
</div>

	);
}
