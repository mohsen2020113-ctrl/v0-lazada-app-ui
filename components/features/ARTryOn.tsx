'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Video } from 'lucide-react';

const ARTryOn = ({ productId }: { productId: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [arActive, setARActive] = useState(false);
    const [hasCamera, setHasCamera] = useState(true);
    const [useVideo, setUseVideo] = useState(false);

    useEffect(() => {
          if (arActive && !useVideo && videoRef.current) {
                  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
                    .then(stream => {
                                if (videoRef.current) {
                                              videoRef.current.srcObject = stream;
                                }
                    })
                    .catch(() => {
                                setHasCamera(false);
                                setUseVideo(true);
                    });
          }
          return () => {
                  if (videoRef.current && videoRef.current.srcObject) {
                            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                            tracks.forEach(track => track.stop());
                  }
          };
    }, [arActive, useVideo]);

    return (
          <div className="w-full max-w-md mx-auto bg-slate-900 rounded-lg overflow-hidden">
            {!arActive ? (
                    <div className="p-6">
                              <h2 className="text-2xl font-bold text-white mb-4">AR Virtual Try-On</h2>h2>
                              <p className="text-slate-300 mb-6">See how this product looks on you with our augmented reality feature.</p>p>
                              <button
                                            onClick={() => setARActive(true)}
                                            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                                          >
                                          <Camera className="w-5 h-5" />
                                          Start AR Try-On
                              </button>button>
                    </div>div>
                  ) : (
                    <div className="relative">
                              <div className="relative bg-black">
                                {useVideo ? (
                                    <div className="p-8 text-center bg-gradient-to-b from-slate-800 to-slate-900">
                                                    <Video className="w-16 h-16 mx-auto text-pink-400 mb-4" />
                                                    <h3 className="text-xl font-bold text-white mb-2">AR Preview Video</h3>h3>
                                                    <p className="text-slate-300 mb-6">Watch how this product looks in action</p>p>
                                                    <video
                                                                        className="w-full max-h-96 rounded-lg mb-4"
                                                                        controls
                                                                        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23222' width='400' height='300'/%3E%3C/svg%3E"
                                                                      >
                                                                      <source
                                                                                            src={`https://media.example.com/ar-preview-${productId}.mp4`}
                                                                                            type="video/mp4"
                                                                                          />
                                                                      Your browser does not support the video tag.
                                                    </video>video>
                                    </div>div>
                                  ) : (
                                    <video
                                                      ref={videoRef}
                                                      autoPlay
                                                      playsInline
                                                      className="w-full h-96 object-cover"
                                                    />
                                  )}
                              </div>div>
                              <div className="absolute inset-0 border-2 border-pink-500 rounded-lg pointer-events-none"></div>div>
                              <button
                                            onClick={() => setARActive(false)}
                                            className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-white transition"
                                          >
                                          <X className="w-6 h-6" />
                              </button>button>
                              <div className="p-4 bg-slate-800">
                                          <p className="text-slate-300 text-sm">{hasCamera ? 'Camera Feed' : 'AR Preview Video'}</p>p>
                                {!hasCamera && (
                                    <p className="text-pink-400 text-xs mt-2">Camera not available, showing video preview</p>p>
                                          )}
                              </div>div>
                    </div>div>
                )}
          </div>div>
        );
};

export default ARTryOn;</div>
