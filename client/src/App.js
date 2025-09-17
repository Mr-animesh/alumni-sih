import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Navigation from "./components/Navigation";
import { Toaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "./components/ui/sonner";
import Chat from "./components/Chat";
import VideoCall from "./components/VideoCall";
import ResumeUpload from "./components/ResumeUpload";
import UsersList from "./components/UsersList";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Events from "./pages/Events";
import Notifications from "./pages/Notifications";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import Guidance from "./pages/Guidance";
import Fundraising from "./pages/Fundraising";
import { Button } from "./components/ui/button";

function App() {
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <BrowserRouter>
        {!user ? (
          <div className="w-full mx-auto">
            <Toaster />
            <SonnerToaster />
            <Navigation />
            <Routes>
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register />} />
              {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
              <Route path="*" element={<Landing />} />
            </Routes>
          </div>
        ) : (
          <>
            <nav className="h-full bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center">
              <div className="flex gap-4">
                <span className="font-semibold">
                  Hello, {user.name}{" "}
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full capitalize bg-gray-100 text-gray-700">
                    {user.role}
                  </span>
                </span>
                <Link to="/" className="text-blue-600">
                  Home
                </Link>
                {user.role !== "admin" && (
                  <>
                    <Link to="/profile" className="text-blue-600">
                      Profile
                    </Link>
                  </>
                )}
                {user.role === "admin" && (
                  <>
                    <Link to="/Udirectory" className="text-blue-600">
                      Users-Directory
                    </Link>
                  </>
                )}
                <Link to="/chat" className="text-blue-600">
                  Chat
                </Link>
                <Link to="/video" className="text-blue-600">
                  Video
                </Link>
                <Link to="/events" className="text-blue-600">
                  Events
                </Link>
                {user?.role !== "admin" && (
                  <>
                    <Link to="/notification" className="text-blue-600">
                      Notifications
                    </Link>
                    <Link to="/guidance" className="text-blue-600">
                      Guidance
                    </Link>
                  </>
                )}
                <Link to="/fundraising" className="text-blue-600">
                  Fundraising
                </Link>
              </div>
              <Button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Logout
              </Button>
            </nav>
            <div className="p-6 space-y-6">
              <Routes>
                <Route path="/" element={<Home user={user} />} />
                {user.role !== "admin" && (
                  <Route
                    path="/profile"
                    element={
                      <Profile
                        user={user}
                        selectedUser={selectedUser}
                        onSelectUser={setSelectedUser}
                        onLogout={handleLogout}
                      />
                    }
                  />
                )}
                <Route
                  path="/chat"
                  element={
                    <>
                      <UsersList
                        currentUser={user}
                        onSelect={setSelectedUser}
                        selectedUser={selectedUser}
                      />
                      <Chat user={user} otherUser={selectedUser} />
                    </>
                  }
                />
                <Route
                  path="/video"
                  element={
                    <>
                      <UsersList
                        currentUser={user}
                        onSelect={setSelectedUser}
                        selectedUser={selectedUser}
                      />
                      <VideoCall user={user} otherUser={selectedUser} />
                    </>
                  }
                />
                <Route path="/users/:id" element={<UserProfile />} />
                <Route path="/events" element={<Events user={user} />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/guidance" element={<Guidance user={user} />} />
                <Route path="/Udirectory" element={<UsersList/>} />
                <Route path="/notification" element={<Notifications/>} />
                <Route
                  path="/fundraising"
                  element={<Fundraising user={user} />}
                />
                {/* Redirect all unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
