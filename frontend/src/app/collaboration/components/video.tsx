import React, { useEffect, useRef, useState } from "react";
import { WebrtcProvider } from "y-webrtc";
import {
  CiMicrophoneOn,
  CiMicrophoneOff,
  CiVideoOn,
  CiVideoOff,
} from "react-icons/ci";
import { Button } from "@/components/ui/button";
type VideoCallProps = {
  provider: WebrtcProvider;
};
import "./video.css";

const VideoCall = ({ provider }: VideoCallProps) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);
  const [videoStart, setVideoStart] = useState<boolean>(false);
  const [isLocalMuted, setIsLocalMuted] = useState<boolean>(false);
  const [isLocalVideoOn, setIsLocalVideoOn] = useState<boolean>(true);
  const [isRemoteMuted, setIsRemoteMuted] = useState<boolean>(true);
  const [isRemoteVideoOn, setIsRemoteVideoOn] = useState<boolean>(true);
  const [remoteVideoSourceObject, setRemoteVideoSourceObject] =
    useState<boolean>(false);
  const [localVideoSourceObject, setLocalVideoSourceObject] =
    useState<boolean>(false);

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:global.relay.metered.ca:80",
          username: "2b012e1176eda910d0c8a755",
          credential: "6KjvgYahJZ21gdAp",
        },
        {
          urls: "turn:global.relay.metered.ca:80?transport=tcp",
          username: "2b012e1176eda910d0c8a755",
          credential: "6KjvgYahJZ21gdAp",
        },
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        provider.awareness.setLocalStateField("webrtc", {
          type: "candidate",
          candidate: event.candidate,
        });
        console.log("Sent ICE candidate:", event.candidate);
      }
    };

    pc.ontrack = (event) => {
      console.log("Received remote track:", event.track);
      if (remoteStreamRef.current) {
        remoteStreamRef.current.addTrack(event.track);
      } else {
        remoteStreamRef.current = new MediaStream([event.track]);
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
        setRemoteVideoSourceObject(true);
      }
    };

    peerConnectionRef.current = pc;
    return () => {
      if (pc) {
        pc.close();
      }
    };
  }, [provider]);

  const startPC = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:global.relay.metered.ca:80",
          username: "2b012e1176eda910d0c8a755",
          credential: "6KjvgYahJZ21gdAp",
        },
        {
          urls: "turn:global.relay.metered.ca:80?transport=tcp",
          username: "2b012e1176eda910d0c8a755",
          credential: "6KjvgYahJZ21gdAp",
        },
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        provider.awareness.setLocalStateField("webrtc", {
          type: "candidate",
          candidate: event.candidate,
        });
        console.log("Sent ICE candidate:", event.candidate);
      }
    };

    pc.ontrack = (event) => {
      console.log("Received remote track:", event.track);
      if (remoteStreamRef.current) {
        remoteStreamRef.current.addTrack(event.track);
      } else {
        remoteStreamRef.current = new MediaStream([event.track]);
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
        setRemoteVideoSourceObject(true);
      }
    };

    peerConnectionRef.current = pc;
    console.log("new connection done");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSignalingMessage = async (message: any) => {
    try {
      if (peerConnectionRef.current) {
        switch (message.type) {
          case "offer": {
            console.log("Received offer:", message.offer);
            console.log(peerConnectionRef.current.signalingState);
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(message.offer)
            );
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            provider.awareness.setLocalStateField("webrtc", {
              type: "answer",
              answer: answer,
            });
            await processIceCandidatesQueue();
            console.log("Sent answer:", answer);
            break;
          }
          case "answer": {
            console.log("Received answer:", message.answer);
            console.log(peerConnectionRef.current.signalingState);
            if (peerConnectionRef.current.signalingState !== "stable") {
              await peerConnectionRef.current.setRemoteDescription(
                new RTCSessionDescription(message.answer)
              );
              await processIceCandidatesQueue();
            }

            break;
          }
          case "candidate": {
            console.log("Received ICE candidate:", message.candidate);
            if (peerConnectionRef.current?.remoteDescription) {
              await peerConnectionRef.current?.addIceCandidate(
                new RTCIceCandidate(message.candidate)
              );
            } else {
              iceCandidatesQueue.current.push(
                new RTCIceCandidate(message.candidate)
              );
            }
            break;
          }
          default:
            break;
        }
      }
    } catch {}
  };

  const startCall = async () => {
    console.log("starting call");
    setVideoStart(true);
    console.log(peerConnectionRef.current);
    if (peerConnectionRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      stream.getTracks().forEach((track) => {
        if (peerConnectionRef.current) {
          peerConnectionRef.current.addTrack(track, stream);
        }
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        setLocalVideoSourceObject(true);
      }

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      provider.awareness.setLocalStateField("webrtc", {
        type: "offer",
        offer: offer,
      });
      console.log("Sent offer:", offer);
    }
  };

  const callButton = async () => {
    console.log("button pressed");
    await startCall();
  };

  useEffect(() => {
    const awarenessListener = ({
      added,
      updated,
      removed,
    }: {
      added: number[];
      updated: number[];
      removed: number[];
    }) => {
      added.concat(updated).forEach((clientId) => {
        if (clientId !== provider.awareness.clientID) {
          const state = provider.awareness.getStates().get(clientId);
          console.log(state);
          if (state?.webrtc) {
            handleSignalingMessage(state.webrtc);
          }
        }
      });

      removed.forEach((clientId) => {
        console.log("Client disconnected:", clientId);
        if (remoteVideoRef.current) {
          console.log("remote video exists");
          if (clientId !== provider.awareness.clientID) {
            remoteVideoRef.current.srcObject = null;
            remoteStreamRef.current = null;
            setRemoteVideoSourceObject(false);
            iceCandidatesQueue.current = [];
            startPC();
            console.log(`Video start ${videoStart}`);
            if (videoStart) {
              console.log("restarting call");
              startCall();
            }
          } else {
            setVideoStart(false);
          }
          console.log("Remote video stopped");
        }
      });
    };

    provider.awareness.on("change", awarenessListener);

    return () => {
      provider.awareness.off("change", awarenessListener);
    };
  }, [provider, handleSignalingMessage, startCall, startPC]);

  const processIceCandidatesQueue = async () => {
    while (iceCandidatesQueue.current.length > 0) {
      const candidate = iceCandidatesQueue.current.shift();
      await peerConnectionRef.current?.addIceCandidate(candidate);
    }
  };

  const toggleLocalMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current?.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsLocalMuted((prev) => !prev);
    }
  };

  const toggleLocalVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current?.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsLocalVideoOn((prev) => !prev);
    }
  };

  const toggleRemoteMute = () => {
    setIsRemoteMuted((prev) => !prev);
  };

  const toggleRemoteVideo = () => {
    if (remoteStreamRef.current) {
      remoteStreamRef.current?.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsRemoteVideoOn((prev) => !prev);
    }
  };

  return (
    <div className="absolute bottom-0 right-0 mb-2 mr-8 flex">
      <div className="flex flex-row gap-2">
        <div>
          <video
            className="rounded-xl"
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "180px" }}
          />
          {localVideoSourceObject && (
            <div className="mt-1">
              <button onClick={toggleLocalMute}>
                {isLocalMuted ? (
                  <CiMicrophoneOff className="text-lg" />
                ) : (
                  <CiMicrophoneOn className="text-lg" />
                )}
              </button>
              <button onClick={toggleLocalVideo}>
                {isLocalVideoOn ? (
                  <CiVideoOn className="text-lg" />
                ) : (
                  <CiVideoOff className="text-lg" />
                )}
              </button>
            </div>
          )}
        </div>

        <div>
          <video
            className="rounded-xl"
            ref={remoteVideoRef}
            autoPlay
            muted={isRemoteMuted}
            style={{ width: "180px" }}
          >
            <track kind="captions" />
          </video>
          {remoteVideoSourceObject && (
            <div className="mt-1">
              <button onClick={toggleRemoteMute}>
                {isRemoteMuted ? (
                  <CiMicrophoneOff className="text-lg" />
                ) : (
                  <CiMicrophoneOn className="text-lg" />
                )}
              </button>
              <button onClick={toggleRemoteVideo}>
                {isRemoteVideoOn ? (
                  <CiVideoOn className="text-lg" />
                ) : (
                  <CiVideoOff className="text-lg" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      {!videoStart && (
        <Button onClick={callButton} className="self-end ml-4">
          Start Video Call
        </Button>
      )}
    </div>
  );
};

export default VideoCall;
