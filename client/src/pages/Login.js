import React, { useState } from "react";
import API from "../utils/api";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
// import Home from "../spline/bot";
import Spline from "@splinetool/react-spline";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    // <div className="h-screen flex items-center justify-center bg-gray-50">
    //         <Spline
    //     scene="https://prod.spline.design/evMxhqOlgg5dbpUZ/scene.splinecode"
    //     style={{ width: "600px", height: "400px" }}
    //   />
    //   <form
    //     onSubmit={handleLogin}
    //     className="bg-white p-8 rounded-2xl shadow-lg w-96 space-y-4 mr-24"
    //   >
    //     <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

    //     <select
    //       className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
    //       value={role}
    //       onChange={(e) => setRole(e.target.value)}
    //     >
    //       <option value="student">Student</option>
    //       <option value="alumni">Alumni</option>
    //       <option value="admin">Admin</option>
    //     </select>

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

    //     <Button type="submit" className="w-full">
    //       Login
    //     </Button>
    //     <p className="text-sm text-center text-gray-600">
    //       No account?{" "}
    //       <Link to="/register" className="text-blue-600">
    //         Register
    //       </Link>
    //     </p>
    //   </form>

    // </div>

<div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
  <div className="flex flex-col lg:flex-row items-center justify-center gap-12 p-6 w-full max-w-6xl">
    
    {/* Left: Spline Animation */}
    <div className="flex-1 flex items-center justify-center">
      <Spline
        scene="https://prod.spline.design/evMxhqOlgg5dbpUZ/scene.splinecode"
        style={{ width: "100%", height: "500px" }}
      />
    </div>

    {/* Right: Login Form with Floating Card Effect */}
    <form
      onSubmit={handleLogin}
      className="flex-1 bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6 border border-gray-200
                 transform transition duration-500 hover:-translate-y-2 hover:shadow-3xl"
    >
      <h2 className="text-3xl font-extrabold text-center text-gray-800">
        Welcome
      </h2>
      <p className="text-center text-gray-500 mb-4">
        Login to continue to your account
      </p>

      {/* Role Selection */}
      <select
        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="student">Student</option>
        <option value="alumni">Alumni</option>
        <option value="admin">Admin</option>
      </select>

      {/* Email Input */}
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {/* Password Input */}
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* Login Button */}
      <Button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-200"
      >
        Login
      </Button>

      {/* Register Link */}
      <p className="text-sm text-center text-gray-600">
        No account?{" "}
        <Link to="/register" className="text-indigo-600 hover:underline">
          Register
        </Link>
      </p>
    </form>
  </div>
</div>
  );
}
