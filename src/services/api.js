const BASE_URL = 'https://gercep-laundry-backend.up.railway.app/'; // Port backend yang benar

// Fungsi untuk login
export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", // Agar session tersimpan
  });
  return response.json();
};

// Fungsi untuk fetch data karyawan
export const fetchKaryawan = async () => {
  const response = await fetch(`${BASE_URL}/api/karyawan`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Agar session dikirim
  });
  return response.json();
};
