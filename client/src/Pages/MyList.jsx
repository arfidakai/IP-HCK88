import { useEffect, useState } from "react";
import SavedCard from "../components/SavedCard";

export default function MyList() {
  const [list, setList] = useState([]);

  const loadList = async () => {
    const res = await fetch("http://localhost:8080/api/list");
    setList(await res.json());
  };

  const removeFromList = async (id) => {
    await fetch(`http://localhost:8080/api/list/${id}`, { method: "DELETE" });
    loadList();
  };

  useEffect(() => {
    loadList();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#000000] mb-4">
        My Learning List
      </h2>

      {list.length === 0 ? (
        <p className="text-[#5C3A3A]">Belum ada video disimpan.</p>
      ) : (
        <div className="space-y-3">
          {list.map((v) => (
            <SavedCard key={v.id} item={v} onDelete={removeFromList} />
          ))}
        </div>
      )}
    </div>
  );
}
