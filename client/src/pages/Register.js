import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import { Button } from "../components/ui/button";
import Spline from "@splinetool/react-spline";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("alumni");
  const [education, setEducation] = useState("");
  const [currentJob, setCurrentJob] = useState("");
  const [skills, setSkills] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [message, setMessage] = useState(""); // Add this line

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { name, email, password, role };
      if (role === "alumni") {
        payload.education = education ? education.split(/\n+/).map(s => s.trim()).filter(Boolean) : [];
        payload.currentJob = currentJob;
        payload.skills = skills ? skills.split(/,\s*/).map(s => s.trim()).filter(Boolean) : [];
      } else if (role === "student") {
        payload.education = education ? education.split(/\n+/).map(s => s.trim()).filter(Boolean) : [];
      }
      const res = await API.post("/auth/register", payload);
      setMessage(res.data.msg); // Show backend message
      if (role !== "alumni") {
        navigate("/login");
      }
      // For alumni, do not redirect immediately. Let them see the message.
    } catch (err) {
      setMessage(err?.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="h-screen flex items-center justify-center bg-gray-50">
    //         <Spline
    //     scene="https://prod.spline.design/evMxhqOlgg5dbpUZ/scene.splinecode"
    //     style={{ width: "100%", height: "500px" }}
    //   />
    //   <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-lg w-96 space-y-4">
    //     <h2 className="text-2xl font-bold text-center text-gray-800">Create account</h2>

    //     <input
    //       type="text"
    //       placeholder="Full name"
    //       className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    //       value={name}
    //       onChange={(e) => setName(e.target.value)}
    //       required
    //     />

    //     <input
    //       type="email"
    //       placeholder="Email"
    //       className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //       required
    //     />

    //     <input
    //       type="password"
    //       placeholder="Password"
    //       className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //       required
    //     />

    //     <select
    //       className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
    //       value={role}
    //       onChange={(e) => setRole(e.target.value)}
    //     >
    //       <option value="student">student</option>
    //       <option value="alumni">alumni</option>
    //     </select>

    //     {(role === "alumni" || role === "student") && (
    //       <div className="space-y-3">
    //         <textarea
    //           placeholder="Education (one per line)"
    //           className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
    //           value={education}
    //           onChange={(e) => setEducation(e.target.value)}
    //         />
    //         {role === "alumni" && (
    //           <>
    //             <input
    //               type="text"
    //               placeholder="Current Job"
    //               className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    //               value={currentJob}
    //               onChange={(e) => setCurrentJob(e.target.value)}
    //             />
    //             <input
    //               type="text"
    //               placeholder="Skills (comma separated)"
    //               className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    //               value={skills}
    //               onChange={(e) => setSkills(e.target.value)}
    //             />
    //           </>
    //         )}
    //         <div className="space-y-2">
    //           <input type="file" accept=".pdf" onChange={(e) => { const f = e.target.files?.[0] || null; setResumeFile(f); console.log("Selected resume file:", f?.name, f?.type, f?.size); }} />
    //           <Button
    //             type="button"
    //             variant="outline"
    //             className="w-full"
    //             disabled={!resumeFile || parsing}
    //             onClick={async () => {
    //               if (!resumeFile) return;
    //               if (resumeFile.type && resumeFile.type !== "application/pdf") {
    //                 alert("Please select a PDF file");
    //                 return;
    //               }
    //               try {
    //                 setParsing(true);
    //                 const fd = new FormData();
    //                 fd.append("resume", resumeFile);
    //                 console.log("Sending resume to parse endpoint...");
    //                 const { data } = await API.post("/alumni/parse-resume", fd);
    //                 console.log("Parse response:", data);
    //                 const p = data?.parsed || {};
    //                 if (!data?.success) {
    //                   alert(data?.msg || "Parsing failed");
    //                   return;
    //                 }
    //                 if (p.name) setName(p.name);
    //                 if (p.email) setEmail(p.email);
    //                 if (p.currentJob) setCurrentJob(p.currentJob);
    //                 if (Array.isArray(p.education)) setEducation(p.education.join("\n"));
    //                 if (Array.isArray(p.skills)) setSkills(p.skills.join(", "));
    //               } catch (e) {
    //                 console.error(e);
    //                 alert("Failed to parse resume");
    //               } finally {
    //                 setParsing(false);
    //               }
    //             }}
    //           >{parsing ? "Parsing..." : "Fill from Resume"}</Button>
    //         </div>
    //       </div>
    //     )}

    //     <Button type="submit" className="w-full" disabled={loading}>
    //       {loading ? "Creating..." : "Register"}
    //     </Button>
    //     {message && (
    //       <div className="text-center text-blue-600 font-medium mt-2">{message}</div>
    //     )}
    //     <p className="text-sm text-center text-gray-600">
    //       Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
    //     </p>
    //   </form>
    // </div>

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
  <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-7xl">
    
    {/* Left: Spline */}
    <div className="flex-1 flex items-center justify-center">
      <Spline
        scene="https://prod.spline.design/evMxhqOlgg5dbpUZ/scene.splinecode"
        style={{ width: "100%", height: "500px" }}
      />
    </div>

    {/* Right: Register Form */}
    <form
      onSubmit={handleRegister}
      className="flex-1 bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6 border border-gray-200
                 transform transition duration-500 hover:-translate-y-2 hover:shadow-3xl
                 max-h-[85vh] overflow-y-auto"
    >
      <h2 className="text-3xl font-extrabold text-center text-gray-800">
        Create Account
      </h2>
      <p className="text-center text-gray-500 mb-4">
        Join our alumni & student community
      </p>

      {/* Full Name */}
      <input
        type="text"
        placeholder="Full name"
        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* Role Select */}
      <select
        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="student">Student</option>
        <option value="alumni">Alumni</option>
      </select>

      {/* Extra Fields */}
      {(role === "alumni" || role === "student") && (
        <div className="space-y-4">
          <textarea
            placeholder="Education (one per line)"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-20"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          />

          {role === "alumni" && (
            <>
              <input
                type="text"
                placeholder="Current Job"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={currentJob}
                onChange={(e) => setCurrentJob(e.target.value)}
              />
              <input
                type="text"
                placeholder="Skills (comma separated)"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </>
          )}

          {/* Resume Upload */}
          <div className="space-y-3">
            <input
              type="file"
              accept=".pdf"
              className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 
                         file:rounded-lg file:border-0 file:text-sm file:font-semibold
                         file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setResumeFile(f);
                console.log("Selected resume file:", f?.name, f?.type, f?.size);
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={!resumeFile || parsing}
              onClick={async () => {
                if (!resumeFile) return;
                if (resumeFile.type && resumeFile.type !== "application/pdf") {
                  alert("Please select a PDF file");
                  return;
                }
                try {
                  setParsing(true);
                  const fd = new FormData();
                  fd.append("resume", resumeFile);
                  const { data } = await API.post("/alumni/parse-resume", fd);
                  const p = data?.parsed || {};
                  if (!data?.success) {
                    alert(data?.msg || "Parsing failed");
                    return;
                  }
                  if (p.name) setName(p.name);
                  if (p.email) setEmail(p.email);
                  if (p.currentJob) setCurrentJob(p.currentJob);
                  if (Array.isArray(p.education)) setEducation(p.education.join("\n"));
                  if (Array.isArray(p.skills)) setSkills(p.skills.join(", "));
                } catch (e) {
                  console.error(e);
                  alert("Failed to parse resume");
                } finally {
                  setParsing(false);
                }
              }}
            >
              {parsing ? "Parsing..." : "Fill from Resume"}
            </Button>
          </div>
        </div>
      )}

      {/* Register Button */}
      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-200" disabled={loading}>
        {loading ? "Creating..." : "Register"}
      </Button>

      {/* Message */}
      {message && (
        <div className="text-center text-indigo-600 font-medium mt-2">{message}</div>
      )}

      {/* Login Link */}
      <p className="text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Login
        </Link>
      </p>
    </form>
  </div>
</div>


  );
}
