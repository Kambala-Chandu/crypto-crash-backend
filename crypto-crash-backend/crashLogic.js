let currentMultiplier = 1;
let crashPoint = 1;

function startCrashGame(io) {
  setInterval(() => {
    crashPoint = parseFloat((Math.random() * 10 + 1).toFixed(2)); // Random crash point between 1 and 11
    currentMultiplier = 1;

    console.log(`🚀 New round started, crashing at ${crashPoint}x`);
    io.emit('round_start', { crashPoint });

    const interval = setInterval(() => {
      currentMultiplier = parseFloat((currentMultiplier + 0.01).toFixed(2));
      io.emit('multiplier_update', { multiplier: currentMultiplier });

      if (currentMultiplier >= crashPoint) {
        io.emit('round_end', { finalMultiplier: crashPoint });
        clearInterval(interval);
      }
    }, 100);
  }, 10000); // New round every 10 seconds
}

module.exports = { startCrashGame };
