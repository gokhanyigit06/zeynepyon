"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { tracks as defaultTracks, AudioTrack } from "@/data/tracks";
import Image from "next/image";

interface AudioListProps {
    tracks?: AudioTrack[];
}

export default function AudioList({ tracks = defaultTracks }: AudioListProps) {
    const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    useEffect(() => {
        if (currentTrack && audioRef.current) {
            audioRef.current.src = currentTrack.audioUrl;
            if (isPlaying) {
                audioRef.current.play().catch((error) => console.error("Playback error:", error));
            }
        }
    }, [currentTrack]);

    const handlePlayPause = (track: AudioTrack) => {
        if (currentTrack?.id === track.id) {
            if (isPlaying) {
                audioRef.current?.pause();
                setIsPlaying(false);
            } else {
                audioRef.current?.play().catch((error) => console.error("Playback error:", error));
                setIsPlaying(true);
            }
        } else {
            setCurrentTrack(track);
            setIsPlaying(true);
        }
    };

    const onAudioEnded = () => {
        setIsPlaying(false);
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Hidden Audio Player */}
            <audio
                ref={audioRef}
                onEnded={onAudioEnded}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
            />

            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden divide-y divide-stone-100">
                {tracks.map((track) => (
                    <div
                        key={track.id}
                        className={`flex items-center p-4 hover:bg-stone-50 transition-colors group ${currentTrack?.id === track.id ? "bg-stone-50" : ""
                            }`}
                    >
                        {/* Left Image */}
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm mr-6">
                            <Image
                                src={track.imageUrl}
                                alt={track.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {/* Overlay for active track */}
                            {currentTrack?.id === track.id && isPlaying && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full bg-[#EAB308] animate-pulse"></div>
                                </div>
                            )}
                        </div>

                        {/* Middle Info */}
                        <div className="flex-1 min-w-0 mr-4">
                            <h3 className={`text-lg font-serif font-semibold truncate ${currentTrack?.id === track.id ? "text-[#EAB308]" : "text-gray-900"
                                }`}>
                                {track.title}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">{track.description}</p>
                        </div>

                        {/* Duration (hidden on small mobile) */}
                        <div className="hidden sm:block text-xs font-mono text-gray-400 mr-8">
                            {track.duration}
                        </div>

                        {/* Right Action */}
                        <button
                            onClick={() => handlePlayPause(track)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-md flex-shrink-0 ${currentTrack?.id === track.id && isPlaying
                                ? "bg-black text-white hover:bg-stone-800"
                                : "bg-[#EAB308] text-black hover:bg-[#D9A507]"
                                }`}
                        >
                            {currentTrack?.id === track.id && isPlaying ? (
                                <Pause size={20} fill="currentColor" />
                            ) : (
                                <Play size={20} fill="currentColor" className="ml-1" />
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* Sticky Player Control Bar (Visible when a track is selected) */}
            {currentTrack && (
                <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 shadow-2xl z-40 animate-slide-up">
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded overflow-hidden hidden sm:block">
                                <Image src={currentTrack.imageUrl} alt={currentTrack.title} fill className="object-cover" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">{currentTrack.title}</h4>
                                <p className="text-xs text-gray-500 line-clamp-1">{currentTrack.description}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
                                className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-stone-800"
                            >
                                {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
