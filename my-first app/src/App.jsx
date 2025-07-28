import React, { useEffect, useState } from 'react';
// socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5002", {
  transports: ["websocket"],
  reconnection: true
});




function App() {
  const [btcPrice, setBtcPrice] = useState(null);

  useEffect(() => {
    // Listen for BTC price updates from backend
    socket.on('btcPrice', (price) => {
      setBtcPrice(price);
    });

    // Clean up socket on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💸 Live BTC Price</h1>
      {btcPrice !== null ? (
        <div style={styles.price}>${btcPrice.toLocaleString()}</div>
      ) : (
        <div style={styles.loading}>Fetching BTC Price...</div>
      )}
    </div>
  );
}

// Inline styles (you can replace with Tailwind, CSS or Styled Components)
const styles = {
  container: {
    textAlign: 'center',
    marginTop: '100px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '36px',
    color: '#333',
  },
  price: {
    fontSize: '48px',
    color: '#0f9d58',
    marginTop: '20px',
  },
  loading: {
    fontSize: '24px',
    color: '#999',
    marginTop: '20px',
  },
};

export default socket;
