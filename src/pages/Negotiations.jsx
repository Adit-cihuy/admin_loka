import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";

export default function Negotiations({ token }) {
  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch negotiations
  const fetchNegotiations = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/negotiation`, {
        headers: { token },
      });

      console.log(response);

      if (response.data.success) {
        setNegotiations(response.data.data); // Mengambil data negosiasi dari backend
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data negosiasi.");
    } finally {
      setLoading(false);
    }
  };

  // Handle approval/rejection
  const handleAction = async (id, status) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/negotiation/${id}`,
        { status },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(`Negosiasi ${status} berhasil!`);
        fetchNegotiations(); // Refresh list setelah update status
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengupdate negosiasi.");
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchNegotiations();
  }, []);

  if (loading) {
    return <p>Loading negotiations...</p>;
  }

  if (negotiations.length === 0) {
    return <p>Tidak ada negosiasi saat ini.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Daftar Negosiasi</h2>
      <div className="grid gap-4">
        {negotiations.map((negotiation) => (
          <div
            key={negotiation._id}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{negotiation.product.name}</p>
              <p>
                Harga Asli: {currency}
                {negotiation.product.price}
              </p>
              <p>
                Harga Tawaran: {currency}
                {negotiation.offeredPrice}
              </p>
              <p>Status: {negotiation.status}</p>
            </div>
             {/* Tombol aksi hanya muncul untuk status pending */}
            {negotiation.status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(negotiation._id, "accepted")}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Terima
                </button>
                <button
                  onClick={() => handleAction(negotiation._id, "rejected")}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Tolak
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
