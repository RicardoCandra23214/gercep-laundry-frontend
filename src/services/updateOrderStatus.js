export const updateOrderStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (!response.ok) {
        throw new Error("Gagal mengupdate status pesanan.");
      }
      console.log("Status berhasil diperbarui!");
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };
  