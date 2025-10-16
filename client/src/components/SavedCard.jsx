export default function SavedCard({ item, onDelete }) {
  return (
    <div className="flex items-center justify-between bg-white shadow p-3 rounded-lg">
      <div className="flex items-center gap-3">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-20 rounded-md"
        />
        <span className="font-medium text-gray-800">{item.title}</span>
      </div>
      <button
        onClick={() => onDelete(item.id)}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition"
      >
        Hapus
      </button>
    </div>
  );
}
