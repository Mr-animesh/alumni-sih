import React, { useRef, useState } from "react";
import { io } from "socket.io-client";
import { Button } from "./ui/button";

const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:3000");

export default function VideoCall({ user, otherUser }) {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const [inCall, setInCall] = useState(false);
  const pcRef = useRef(null);

  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.current.srcObject = stream;

    // Basic WebRTC peer connection
    const pc = new RTCPeerConnection();
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.ontrack = (event) => {
      remoteVideo.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && user?._id && otherUser?._id) {
        const roomId = [user._id, otherUser._id].sort().join("-");
        socket.emit("signal", { roomId, signalData: { candidate: event.candidate } });
      }
    };

    pcRef.current = pc;

    setInCall(true);
  };

  const endCall = () => {
    if (localVideo.current?.srcObject) {
      localVideo.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    if (remoteVideo.current?.srcObject) {
      remoteVideo.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    pcRef.current?.close();
    pcRef.current = null;
    setInCall(false);
  };

  // Join signaling room and handle remote signals
  React.useEffect(() => {
    if (!user?._id || !otherUser?._id) return;
    const roomId = [user._id, otherUser._id].sort().join("-");
    socket.emit("joinVideoRoom", roomId);

    const onSignal = async ({ socketId, signalData }) => {
      if (!pcRef.current) return;
      if (signalData?.candidate) {
        try { await pcRef.current.addIceCandidate(signalData.candidate); } catch {}
      }
    };
    socket.on("signal", onSignal);
    return () => {
      socket.off("signal", onSignal);
    };
  }, [user, otherUser]);

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white rounded-2xl shadow-md p-4">
      <h3 className="text-lg font-bold mb-4">Video Call</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <video
          ref={localVideo}
          autoPlay
          muted
          playsInline
          className="w-full rounded-xl bg-black"
        ></video>
        <video
          ref={remoteVideo}
          autoPlay
          playsInline
          className="w-full rounded-xl bg-black"
        ></video>
      </div>

      <div className="flex gap-3 justify-center">
        {!inCall ? (
          <Button onClick={startCall} className="bg-green-600 hover:bg-green-700">
            Start Call
          </Button>
        ) : (
          <Button onClick={endCall} className="bg-red-600 hover:bg-red-700">
            End Call
          </Button>
        )}
      </div>
    </div>
  );
}
