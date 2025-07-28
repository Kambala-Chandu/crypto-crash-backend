import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

let socket;

function App() {
  const [btcPrice, setBtcPrice] = useState(null);
  const [multiplier, setMultiplier] = useState(null);
  const [crashAt, setCrashAt] = useState(null);
  const [status, setStatus] = useState('🟢 Waiting');

  useEffect(() => {
    // Connect socket only once
    socket = io('http://localhost:5002', {
      transports: ['websocket'], // Force websocket transport
      reconnection: true,
    });

    socket.on('connect', () => {
      console.log('🟢 Connected to backend:', socket.id);
    });

    socket.on('btcPrice', (price) => {
      console.log('BTC PRICE:', price);
      setBtcPrice(price);
    });

    socket.on('roundStarted', ({ crashAt }) => {
      console.log('New round started, will crash at:', crashAt);
      setCrashAt(crashAt);
      setMultiplier(1.0); // Reset multiplier
      setStatus('🟢 Running');
    });

    socket.on('multiplierUpdate', (mult) => {
      console.log('Multiplier:', mult);
      setMultiplier(mult);
    });

    socket.on('roundEnded', (finalMultiplier) => {
      console.log('Crashed at:', finalMultiplier);
      setStatus(`💥 Crashed at ${finalMultiplier}x`);
    });

    // Cleanup when component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <div style={{ padding: 30, fontFamily: 'Arial, sans-serif' }}>
      <h1>💣 Crypto Crash Game</h1>
      <p><strong>BTC Price:</strong> {btcPrice ? `$${btcPrice}` : 'Loading...'}</p>
      <p><strong>Crash At:</strong> {crashAt ? `${crashAt}x` : '—'}</p>
      <p><strong>Multiplier:</strong> {multiplier ? `${multiplier}x` : '—'}</p>
      <p><strong>Status:</strong> {status}</p>
    </div>
  );
}

export default App;
