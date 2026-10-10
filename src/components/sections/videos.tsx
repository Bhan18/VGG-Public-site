"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Pause, Play, Video, Volume2, VolumeX } from "lucide-react";
import { useVideos } from "@/hooks/use-vgg-data";
import { Skeleton } from "@/components/ui/skeleton";
import { toEmbedUrl } from "@/lib/utils";
import type { VideoItem } from "@/lib/types";

function buildSrc(url: string) {
  const embed = toEmbedUrl(url);
  const sep = embed.includes("?") ? "&" : "?";
  return `${embed}${sep}autoplay=1&mute=0&controls=0&enablejsapi=1&rel=0&playsinline=1&modestbranding=1`;
}

function VideoCard({
  video,
  index,
  onActivate,
  registerPause,
}: {
  video: VideoItem;
  index: number;
  onActivate: () => void;
  registerPause: (fn: (() => void) | null) => void;
}) {
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(70);
  const [showControls, setShowControls] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const send = useCallback((func: string, args: (number | string)[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*"
    );
  }, []);

  const revealControls = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 2500);
  }, []);

  const keepControlsVisible = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setShowControls(true);
  }, []);

  const pause = useCallback(() => {
    send("pauseVideo");
    setPlaying(false);
    keepControlsVisible();
  }, [send, keepControlsVisible]);

  useEffect(() => {
    registerPause(pause);
    return () => registerPause(null);
  }, [pause, registerPause]);

  useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  const start = () => {
    onActivate();
    setStarted(true);
    setPlaying(true);
    revealControls();
  };

  const togglePlay = () => {
    if (playing) {
      send("pauseVideo");
      setPlaying(false);
      keepControlsVisible();
    } else {
      onActivate();
      send("playVideo");
      setPlaying(true);
      revealControls();
    }
  };

  const changeVolume = (v: number) => {
    setVolume(v);
    send("setVolume", [v]);
    if (v === 0) {
      send("mute");
      setMuted(true);
    } else {
      send("unMute");
      setMuted(false);
    }
    revealControls();
  };

  const toggleMute = () => {
    if (muted || volume === 0) {
      send("unMute");
      if (volume > 0) send("setVolume", [volume]);
      setMuted(false);
    } else {
      send("mute");
      setMuted(true);
    }
    revealControls();
  };

  const isMuted = muted || volume === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative w-[75vw] sm:w-96 shrink-0 snap-start md:w-auto h-48 md:h-56 rounded-3xl overflow-hidden glass-card gradient-border"
    >
      {started ? (
        <>
          <iframe
            ref={iframeRef}
            src={buildSrc(video.url)}
            title={video.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => {
              send("unMute");
              send("setVolume", [volume]);
              send("playVideo");
              setPlaying(true);
            }}
          />
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={togglePlay}
            onMouseMove={revealControls}
            onMouseEnter={revealControls}
            onTouchStart={revealControls}
            aria-hidden
          />
        </>
      ) : (
        <>
          {video.thumbnail && (
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              sizes="(min-width: 1024px) 33vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
          <button
            type="button"
            onClick={start}
            className="absolute inset-0 flex items-center justify-center"
            aria-label={`Play ${video.title}`}
          >
            <span className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 transition-all">
              <Play className="h-7 w-7 text-white fill-white ml-1" />
            </span>
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
            <p className="text-white font-semibold text-sm line-clamp-2">{video.title}</p>
          </div>
        </>
      )}

      {started && (
        <div
          className={`absolute bottom-0 left-0 right-0 flex items-center gap-2 sm:gap-3 p-2.5 bg-gradient-to-t from-black/85 to-transparent transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onMouseMove={revealControls}
          onTouchStart={revealControls}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={togglePlay}
            className="w-9 h-9 shrink-0 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white ml-0.5" />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className="w-9 h-9 shrink-0 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={isMuted ? 0 : volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            aria-label="Volume"
            className="w-24 sm:w-28 accent-white cursor-pointer"
          />
          <p className="ml-auto text-white/90 text-xs font-medium truncate hidden sm:block max-w-[40%]">
            {video.title}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export function Videos() {
  const { data: videos, loading } = useVideos();
  const pauseFns = useRef<Record<string, (() => void) | null>>({});
  const activeIdRef = useRef<string | null>(null);

  const registerPause = useCallback((id: string, fn: (() => void) | null) => {
    pauseFns.current[id] = fn;
  }, []);

  const activate = useCallback((id: string) => {
    const prev = activeIdRef.current;
    if (prev && prev !== id) pauseFns.current[prev]?.();
    activeIdRef.current = id;
  }, []);

  if (!loading && (!videos || videos.length === 0)) return null;

  return (
    <section id="videos" className="py-12 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-xs font-semibold uppercase tracking-widest mb-4">
            <Video className="h-3.5 w-3.5" /> Video Tours
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Watch Our <span className="text-gradient-gold">Project Walkthroughs</span>
          </h2>
          <p className="mt-4 text-sm md:text-lg text-muted-foreground leading-relaxed">
            Take a virtual tour of our projects from the comfort of your home. See the layouts, infrastructure, and natural
            beauty that make VGG farmlands special.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 md:snap-none md:overflow-visible">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-[75vw] sm:w-96 shrink-0 snap-start md:w-auto h-48 md:h-56 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 md:snap-none md:overflow-visible">
            {(videos ?? []).map((v, i) => (
              <VideoCard
                key={v.id}
                video={v}
                index={i}
                onActivate={() => activate(v.id)}
                registerPause={(fn) => registerPause(v.id, fn)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
