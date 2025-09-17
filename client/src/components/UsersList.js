import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { Button } from "./ui/button";

export default function UsersList({ currentUser, onSelect, selectedUser }) {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
  const navigate = useNavigate();

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				setLoading(true);
				const { data } = await API.get("/alumni");
				if (!mounted) return;
				setUsers(data.filter(u => u._id !== currentUser?._id));
			} catch (e) {
				setError("Failed to load users");
			} finally {
				setLoading(false);
			}
		})();
		return () => { mounted = false; };
	}, [currentUser]);

	return (
		// <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-4">
		// 	<h3 className="text-lg font-bold mb-3">Users</h3>
		// 	{loading && <p>Loading...</p>}
		// 	{error && <p className="text-red-600">{error}</p>}
		// 	<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
		// 		{users.map(u => (
		// 			<div
		// 				key={u._id}
		// 				className={`border rounded-xl p-3 ${selectedUser?._id === u._id ? "border-blue-600" : "border-gray-200"}`}
		// 				onContextMenu={(e) => { e.preventDefault(); navigate(`/users/${u._id}`); }}
		// 				onClick={() => onSelect && onSelect(u)}
		// 				role="button"
		// 			>
		// 				<div className="flex items-center justify-between">
		// 					<p className="font-semibold">{u.name}</p>
		// 					<span className={`text-xs px-2 py-0.5 rounded-full capitalize ${u.role === "admin" ? "bg-red-100 text-red-700" : u.role === "alumni" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
		// 						{u.role}
		// 					</span>
		// 				</div>
		// 				<p className="text-sm text-gray-600">{u.email}</p>
		// 				{u.currentJob && <p className="text-sm">{u.currentJob}</p>}
		// 				<div className="mt-2 flex items-center justify-between">
		// 					<p className="text-xs text-gray-500">Right-click to open profile</p>
		// 					<Button
		// 						variant="outline"
		// 						onClick={async (e) => {
		// 							e.stopPropagation();
		// 							try {
		// 								await API.post(`/alumni/${u._id}/follow`);
		// 								setUsers(prev => prev.map(x => x._id === u._id ? {
		// 									...x,
		// 									followers: (x.followers || []).some(id => id === currentUser?._id) ? (x.followers || []).filter(id => id !== currentUser?._id) : [ ...(x.followers || []), currentUser?._id ]
		// 								} : x));
		// 							} catch (err) {
		// 								alert("Failed to update follow status");
		// 							}
		// 						}}
		// 					>
		// 						{(u.followers || []).some(id => id === currentUser?._id) ? "Unfollow" : "Follow"}
		// 					</Button>
		// 				</div>
		// 			</div>
		// 		))}
		// 	</div>
		// </div>

		<div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
  <h3 className="text-xl font-bold mb-6">Users</h3>
  {loading && <p>Loading...</p>}
  {error && <p className="text-red-600">{error}</p>}
  
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {users.map(u => (
      <div
        key={u._id}
        className={`rounded-2xl border shadow-sm p-5 hover:shadow-md transition cursor-pointer ${
          selectedUser?._id === u._id ? "border-blue-600" : "border-gray-200"
        }`}
        onContextMenu={(e) => { e.preventDefault(); navigate(`/users/${u._id}`); }}
        onClick={() => onSelect && onSelect(u)}
      >
        {/* Top Section: Avatar + Name + Role */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
              {u.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{u.name}</p>
              <p className="text-sm text-gray-600">{u.email}</p>
            </div>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full capitalize ${
              u.role === "admin"
                ? "bg-red-100 text-red-700"
                : u.role === "alumni"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {u.role}
          </span>
        </div>

        {/* Job Info */}
        {u.currentJob && (
          <p className="text-sm font-medium text-gray-800 mb-2">
            {u.currentJob}
          </p>
        )}

        {/* Specializations */}
        {Array.isArray(u.skills) && u.skills.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {u.skills.slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Footer: Follow Button + hint */}
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">Right-click to open profile</p>
          <Button
            variant="outline"
            size="sm"
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await API.post(`/alumni/${u._id}/follow`);
                setUsers(prev =>
                  prev.map(x =>
                    x._id === u._id
                      ? {
                          ...x,
                          followers: (x.followers || []).some(id => id === currentUser?._id)
                            ? (x.followers || []).filter(id => id !== currentUser?._id)
                            : [ ...(x.followers || []), currentUser?._id ]
                        }
                      : x
                  )
                );
              } catch (err) {
                alert("Failed to update follow status");
              }
            }}
          >
            {(u.followers || []).some(id => id === currentUser?._id)
              ? "Unfollow"
              : "Follow"}
          </Button>
        </div>
      </div>
    ))}
  </div>
</div>

	);
}
