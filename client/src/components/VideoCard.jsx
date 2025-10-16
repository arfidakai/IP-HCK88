export default function VideoCard({ video, onSave }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="rounded-lg mb-3 w-full"
      />
      <h3 className="text-gray-800 font-medium mb-2 line-clamp-2">
        {video.title}
      </h3>
      {onSave && (
        <button
          onClick={() => onSave(video)}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition"
        >
          + Simpan
        </button>
      )}
    </div>
  );
}
