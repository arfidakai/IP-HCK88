export default function TrendingCard({ video, onSave }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="rounded-lg mb-3 w-full"
      />
      <h3 className="text-gray-800 font-medium line-clamp-2 mb-2 flex-1">
        {video.title}
      </h3>

      <div className="flex justify-between items-center mt-auto">
        <a
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline text-sm"
        >
          Lihat di YouTube →
        </a>

        {/* Tampilkan tombol "Simpan" kalau prop onSave dikirim */}
        {onSave && (
          <button
            onClick={() => onSave(video)}
            className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded-md shadow transition"
          >
            💾 Simpan
          </button>
        )}
      </div>
    </div>
  );
}
