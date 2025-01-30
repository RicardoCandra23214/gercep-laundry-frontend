import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../services/api";

const TestConnection = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/test`);
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error("Failed to connect to backend:", error);
        setMessage("Failed to connect to backend.");
      }
    };

    testConnection();
  }, []);

  return <div>Backend Message: {message}</div>;
};

export default TestConnection;
