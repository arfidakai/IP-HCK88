import React from "react";

export default function TrendingCard({ video, onSave }) {
  const videoId = video?.videoId || video?.id || (video?.url && new URL(video.url).searchParams.get("v"));
  const youtubeUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : video.url || "#";

  return (
  <article className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">

      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full"
        aria-label={`Buka video ${video.title} di YouTube`}
      >
        <div className="w-full aspect-w-16 aspect-h-9 bg-gray-100">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </a>

      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-[#5C3A3A] line-clamp-2">{video.title}</h3>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => onSave?.(video)}
            className="bg-[#FFC3A1] hover:bg-[#A75D5D] text-[#5C3A3A] px-3 py-2 rounded-md w-full sm:w-auto transition"
            aria-label={`Simpan ${video.title} ke daftar belajar`}
            type="button"
          >
            Simpan
          </button>

          {/* <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-[#5C3A3A] underline hidden sm:inline-block"
          >
            Buka di YouTube
          </a> */}
        </div>
      </div>
    </article>
  );
}
