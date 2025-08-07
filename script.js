// Load or start data
  let storedData = JSON.parse(localStorage.getItem("candleData")) || [];
  let currentIndex = 0;

  const pricePath = [5, 1, 4, 3, 6, 4, 8, 5, 10,4,8,5,8,6,12,9,11,9,10,7,8,7,8,7,8,7,10,8,14,18,22,27,25,30,35]; 

  let currentPrice = storedData.length > 0 ? storedData[storedData.length - 1].close : pricePath[0];
  let nextPrice = pricePath[1] || currentPrice;

   

  // Chart setup
  const charts = LightweightCharts.createChart(document.getElementById('chart'), {
    layout: { background: { color: '#ffffff' }, textColor: '#000000' },
    grid: { vertLines: { color: '#fff' }, horzLines: { color: '#fff' } },
    timeScale: { timeVisible: true, secondsVisible: true }
  });

  const candleSeries = charts.addCandlestickSeries();

  // Load old candles
  if (storedData.length > 0) {
    candleSeries.setData(storedData);
  }

  let time = storedData.length > 0 ? storedData[storedData.length - 1].time + 60 : Math.floor(Date.now() / 1000);

  let open = currentPrice;
  let high = currentPrice;
  let low = currentPrice;
  let close = currentPrice;

  let tickInCandle = 0;
  const totalTicks = 60;
  const dropPhaseTicks = 10;
  let dropTarget = open * 0.9;

  function getControlledStep(current, target, remainingTicks) {
    const diff = target - current;
    const step = diff / remainingTicks;
    return parseFloat(step.toFixed(2));
  }

  function getRandomFluctuation() {
    return parseFloat((Math.random() * 0.05 - 0.025).toFixed(2)); // ±0.025
  }

  function updateCandle() {
    // Update price
    if (tickInCandle < dropPhaseTicks) {
      const step = getControlledStep(currentPrice, dropTarget, dropPhaseTicks - tickInCandle);
      currentPrice += step;
    } else {
      const step = getControlledStep(currentPrice, nextPrice, totalTicks - tickInCandle);
      currentPrice += step + getRandomFluctuation();
    }

    currentPrice = parseFloat(currentPrice.toFixed(2));
    low = Math.min(low, currentPrice);

    if (tickInCandle >= dropPhaseTicks && nextPrice > open) {
      let bump = parseFloat((Math.random() * 0.20).toFixed(2));
      high = Math.max(high, currentPrice + bump);
    } else {
      high = Math.max(high, currentPrice);
    }

    close = currentPrice;

    candleSeries.update({ time, open, high, low, close });

    tickInCandle++;

    if (tickInCandle >= totalTicks) {
      tickInCandle = 0;

      // Save complete candle
      const newCandle = { time, open, high, low, close };
      storedData.push(newCandle);
      localStorage.setItem("candleData", JSON.stringify(storedData));

      // Prepare for next
      currentIndex++;
      time += 60;

      open = close;
      high = close;
      low = close;
      currentPrice = close;
      nextPrice = pricePath[currentIndex + 1] || close;
      dropTarget = open * 0.8;
    }
  }

  function clearChart() {
  localStorage.removeItem("candleData");
  location.reload(); // refresh page to restart clean
}


  const timer = setInterval(updateCandle, 1000);
