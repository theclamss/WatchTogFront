import React, { useEffect, useRef } from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "./LoginPage.tsx";
import HomePage from "./HomePage.tsx";


function App() {


    return (
        <BrowserRouter>
            <Routes>
                <Route  path="/" element={<HomePage/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/video" element={<VideoComponent/>} />

            </Routes>
        </BrowserRouter>
    );
}
const  VideoComponent:React.FC = () =>{
    const connRef = useRef<WebSocket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const dataChannelRef = useRef<RTCDataChannel | null>(null);
    type MessageType = {
        event: string;
        data: any;
    };
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    useEffect(() => {
        // Connect to signaling server
        connRef.current = new WebSocket('ws://localhost:8080/socket');

        connRef.current.onopen = () => {
            console.log("Connected to the signaling server");
        };

        connRef.current.onerror = (err) => {
            console.log("Eroorrr")
            console.error(err);
        };

        connRef.current.onmessage = (msg) => {
            const content = JSON.parse(msg.data);
            console.log(content);
            switch (content.event) {
                case "offer":
                    handleOffer(content.data);
                    break;
                case "answer":
                    handleAnswer(content.data);
                    break;
                case "candidate":
                    handleCandidate(content.data);
                    break;
                default:
                    console.log("Unhandled message type:", content.event);
            }
            // Handle different types of messages here (like 'offer', 'answer', 'candidate')
            // ...
        };

        // Set up WebRTC
        //const configuration = null;
        peerConnectionRef.current = new RTCPeerConnection(undefined);

        const handleOffer = (offer) => {
            const remoteOffer = new RTCSessionDescription(offer);
            peerConnectionRef.current?.setRemoteDescription(remoteOffer);
            peerConnectionRef.current?.createAnswer().then(answer => {
                peerConnectionRef.current?.setLocalDescription(answer);
                send({ event: "answer", data: answer });
            }).catch(error => {
                console.error("Error when creating an answer:", error);
            });
        };







        peerConnectionRef.current.ontrack = (event) => {
            if (remoteVideoRef.current && event.streams[0]) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };
        const handleAnswer = (answer) => {
            const remoteAnswer = new RTCSessionDescription(answer);
            peerConnectionRef.current?.setRemoteDescription(remoteAnswer);
        };

        const handleCandidate = (candidate) => {
            peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
        };

        dataChannelRef.current = peerConnectionRef.current.createDataChannel("dataChannel", { ordered: true  });

        const constraints = {
            video: true,
            audio: true
        };


        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                const tracks = stream.getTracks();
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                tracks.forEach(track => {
                    peerConnectionRef.current?.addTrack(track, stream);
                });
            })
            .catch(function(err) {
                // handle the error
            });

        dataChannelRef.current.onerror = (error) => {
            console.log("Error:", error);
        };

        dataChannelRef.current.onclose = () => {
            console.log("Data channel is closed");
        };

        dataChannelRef.current.onmessage =(message)=> {
            console.log("message",message);
        };
        peerConnectionRef.current.onicecandidate = (event) => {
            if (event.candidate) {
                send({ event: "candidate", data: event.candidate });
            }
        };

        // Cleanup connections on component unmount
        return () => {
            connRef.current?.close();
            if (peerConnectionRef.current) peerConnectionRef.current.close();
        };

    }, []);

    const send = (message :MessageType) => {
        console.log("Sending message:", message);
        connRef.current?.send(JSON.stringify(message));
    };
    /*
        function filterCodecs(sdp) {
            const codecsToRemove = ['vp8', 'vp9'];

            let lines = sdp.split('\n');
            const newSdp = [];
            let isVideoMLine = false;
            const payloadTypesToRemove = [];

            for (let line of lines) {
                if (line.startsWith('m=video')) {
                    isVideoMLine = true;
                }

                if (isVideoMLine && line.startsWith('a=rtpmap')) {
                    const codec = line.split(' ')[1].toLowerCase();
                    for (const codecToRemove of codecsToRemove) {
                        if (codec.includes(codecToRemove)) {
                            payloadTypesToRemove.push(line.split(' ')[0].split(':')[1]);
                            continue;
                        }
                    }
                }

                if (!payloadTypesToRemove.includes(line.split(' ')[0])) {
                    newSdp.push(line);
                }
            }

            return newSdp.join('\n');
        }
    */
    const createOffer = () => {
        peerConnectionRef.current?.createOffer((offer) => {
            //offer.sdp.
            send({ event: "offer", data: offer });
            peerConnectionRef.current?.setLocalDescription(offer);
        }, (error) => {
            console.error(error);
        });
    };

    const sendmessage = () => {
        console.log(dataChannelRef.current?.readyState);
        dataChannelRef.current?.send("hello");
    };
    return (<div className="App">
        <video ref={localVideoRef} autoPlay playsInline muted></video>
        <button onClick={createOffer}>Create Offer</button>
        <button onClick={sendmessage}>send message</button>

    </div>)
}

export default App;
