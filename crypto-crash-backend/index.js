const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { startCrashGame } = require('./crashLogic');
const { getWalletBalance, updateWallet } = require('./wallet');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());

app.get('/wallet/:address', (req, res) => {
  const balance = getWalletBalance(req.params.address);
  res.json({ balance });
});

app.post('/wallet', (req, res) => {
  const { address, amount } = req.body;
  updateWallet(address, amount);
  res.json({ success: true });
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('place_bet', ({ address, amount }) => {
    console.log(`${address} placed a bet of ${amount}`);
    updateWallet(address, -amount);
  });

  socket.on('cash_out', ({ address, multiplier }) => {
    const profit = multiplier;
    updateWallet(address, profit);
    socket.emit('cashed_out', { address, profit });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

startCrashGame(io);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
