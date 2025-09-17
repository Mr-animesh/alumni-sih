import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { Button } from "../components/ui/button";

export default function Guidance({ user }) {
	const [education, setEducation] = useState("");
	const [skills, setSkills] = useState("");
	const [interests, setInterests] = useState("");
	const [goal, setGoal] = useState("");
	const [advice, setAdvice] = useState("");
	const [loading, setLoading] = useState(false);
	const [missing, setMissing] = useState([]);

	useEffect(() => {
		if (Array.isArray(user?.education) && user.education.length > 0) {
			setEducation(user.education.join("\n"));
		}
		if (Array.isArray(user?.skills) && user.skills.length > 0) {
			setSkills(user.skills.join(", "));
		}
		if (user?.currentJob) setGoal(user.currentJob);
	}, [user]);

	const requestGuidance = async () => {
		try {
			setLoading(true);
			setAdvice("");
			const { data } = await API.post("/guidance", {
				education,
				skills,
				interests,
				goal,
			});
			setAdvice(data?.advice || "");
			setMissing(data?.missing || []);
		} catch (e) {
			setAdvice("Could not generate guidance. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto space-y-4">
			<div className="bg-white rounded-2xl shadow p-6 space-y-3">
				<h2 className="text-2xl font-bold">Guidance</h2>
				<p className="text-sm text-gray-600">We use your profile to suggest a tailored roadmap. Provide missing info if prompted.</p>
				<div className="grid md:grid-cols-2 gap-3">
					<textarea className="px-4 py-2 border rounded-xl min-h-24" placeholder="Education (one per line)" value={education} onChange={(e) => setEducation(e.target.value)} />
					<input className="px-4 py-2 border rounded-xl" placeholder="Skills (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} />
					<input className="px-4 py-2 border rounded-xl" placeholder="Interests (comma separated)" value={interests} onChange={(e) => setInterests(e.target.value)} />
					<input className="px-4 py-2 border rounded-xl" placeholder="Goal (role or target)" value={goal} onChange={(e) => setGoal(e.target.value)} />
				</div>
				{missing.length > 0 && (
					<p className="text-sm text-orange-700 bg-orange-50 border border-orange-200 rounded-lg p-2">Missing info: {missing.join(", ")}. Please fill above for better results.</p>
				)}
				<Button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:from-pink-500 hover:to-indigo-500 hover:scale-105 transition-transform duration-300 ease-in-out" onClick={requestGuidance} disabled={loading}>{loading ? "Generating..." : "Get Guidance"}</Button>
			</div>

			{advice && (
				<div className="bg-white rounded-2xl shadow p-6 whitespace-pre-wrap">
					{advice}
				</div>
			)}
		</div>
	);
}
