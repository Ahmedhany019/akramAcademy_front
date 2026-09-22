import React from "react";
import Skeleton from "../common/Skeleton";
import { VideoOff } from "lucide-react";

const getYouTubeId = (url) => {
  if (!url) return null;
  try {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]{11}).*/;
    const match = url.match(regExp);
    return match ? match[2] : null;
  } catch {
    return null;
  }
};

export default function LessonVideo({ videoUrl, title = "فيديو الدرس", isLoading = false }) {
  if (isLoading) {
    return (
      <div className="w-full aspect-video rounded-2xl overflow-hidden border border-surface-border">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  const videoId = getYouTubeId(videoUrl);

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-2xl border border-surface-border flex flex-col items-center justify-center text-textSecondary gap-2">
        <VideoOff className="w-12 h-12 text-gray-400" />
        <p className="text-sm font-semibold">لا يوجد فيديو متوفر لهذا الدرس</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;

  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-card border border-surface-border bg-black">
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
        
      />
    </div>
  );
}

