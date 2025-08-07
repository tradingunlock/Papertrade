const stockList = [
   { name: "SBI", price: "596.30" },
    { name: "ETH", price: "596.30" },
  { name: "HDFC", price: "1635.20" },
  { name: "Nifty", price: "19584.75" },
  { name: "Bank Nifty", price: "44652.10" },
  { name: "Infosys", price: "1460.40" },
  { name: "harpreet", price: "999.30" },
  { name: "harsimrat", price: "199.30" },
  { name: "ashok layland", price: "296.30" },
  { name: "geojit", price: "196.30" },
  { name: "arvind fashion", price: "566.30" },
  { name: "Bharti Airtel", price: "1914.30" },
  { name: "Hindustan Unilev", price: "2500.30" },
  { name: "Bajaj Finance", price: "719.30" },
  { name: "ITC", price: "419.30" },
  { name: "LARSAN", price: "819.30" },
  { name: "HCL TECH", price: "1719.30" },
  { name: "KOTAAK MAHIND", price: "1919.30" },
  { name: "ULTRA TECH", price: "12219.30" },
  { name: "AXIS BANK", price: "1019.30" },
  { name: "NTPC", price: "319.30" },
  { name: "BAJAJ FIN", price: "1919.30" },
  { name: "ADANI PORT", price: "1319.30" },
  { name: "TITAN", price: "3319.30" },
  { name: "BHARAT ELE", price: "319.30" },
  { name: "ADANI ENT", price: "2319.30" },
  { name: "POWER GRID", price: "319.30" },
  { name: "JSW STEEL", price: "1059.30" },
  { name: "WIPRO", price: "249.30" },
  { name: "TATA MOTORS", price: "653.30" },
  { name: "ASIAN PAINT", price: "2449.30" },
  { name: "COAL INDIA", price: "374.30" },
  { name: "BAJAJ AUTO", price: "8119.30" },
  { name: "ADANI POWER", price: "584.30" },
  { name: "NESTLE INDIA", price: "2277.30" },
  { name: "INTERGLOVE AV", price: "5780.30" },
  { name: "JIO FINANCE", price: "333.30" },
  { name: "INDAIN OIL ", price: "142.30" },
  { name: "DLF", price: "792.30" },
  { name: "GRASIM INDU", price: "2719.30" },
  { name: "TRIENT", price: "5249.30" },
  { name: "HINDUSTAN ZINC", price: "419.30" },
  { name: "SESAX", price: "50000.30" },
  { name: "BTC", price: "101300.30" },
];

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("stockInput");
  const suggestionBox = document.createElement("div");
  suggestionBox.className = "suggestion-box";
  input.parentElement.appendChild(suggestionBox);

  let activeWatchlist = "A";
  const watchlists = ["A", "B", "C", "D", "E", "F"];

  // Set default selection
  setSelected(activeWatchlist);
  showList(activeWatchlist);
  loadSavedData();

  // 🎯 Button click listeners
  watchlists.forEach(id => {
    document.getElementById(`select${id}`).addEventListener("click", () => {
      activeWatchlist = id;
      setSelected(id);
      showList(id);
    });
  });

  // 🔍 Live stock search
  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    suggestionBox.innerHTML = "";
    if (!query) return;

    const matched = stockList.filter(stock =>
      stock.name.toLowerCase().startsWith(query)
    );

    matched.forEach(stock => {
      const item = document.createElement("div");
      item.className = "suggestion";
      item.textContent = stock.name;
      item.addEventListener("click", () => {
        addStockToList(activeWatchlist, stock.name, stock.price, true);
        input.value = "";
        suggestionBox.innerHTML = "";
      });
      suggestionBox.appendChild(item);
    });
  });

  // 🔄 Load from localStorage
  function loadSavedData() {
    const saved = JSON.parse(localStorage.getItem("watchlistData")) || {};
    Object.entries(saved).forEach(([listId, stocks]) => {
      stocks.forEach(stock => addStockToList(listId, stock.name, stock.price, false));
    });
  }

  function setSelected(selectedId) {
    watchlists.forEach(id => {
      const btn = document.getElementById(`select${id}`);
      btn.classList.toggle("selected", id === selectedId);
    });
  }

  function showList(id) {
    watchlists.forEach(wid => {
      const ul = document.getElementById(`list${wid}`);
      ul.style.display = wid === id ? "block" : "none";
    });
  }

  // ➕ Stock creator
  function addStockToList(listId, name, price, saveToStorage) {
    const list = document.getElementById(`list${listId}`);
    if (!list) return;

    // Avoid duplicate
    const exists = [...list.children].some(
      item => item.querySelector("span")?.textContent.toLowerCase() === name.toLowerCase()
    );
    if (exists) return;

    const li = document.createElement("li");
    li.className = "stock-row";

    const label = document.createElement("span");
    label.textContent = name;

    const priceDiv = document.createElement("div");
    priceDiv.className = "price";
    priceDiv.textContent = price;

    const actionButtons = document.createElement("div");
    actionButtons.className = "bs-button";

    ["chrt", "B", "S"].forEach(text => {
      const btn = document.createElement("button");
      btn.id = text.toLowerCase();
      btn.textContent = text;
      actionButtons.appendChild(btn);
    });

    const closeBtn = document.createElement("span");
    closeBtn.className = "material-symbols-outlined close-icon";
    closeBtn.textContent = "close";
    closeBtn.addEventListener("click", () => {
      li.remove();
      const data = JSON.parse(localStorage.getItem("watchlistData")) || {};
      data[listId] = (data[listId] || []).filter(s => s.name !== name);
      localStorage.setItem("watchlistData", JSON.stringify(data));
    });

    actionButtons.appendChild(closeBtn);

    li.appendChild(label);
    li.appendChild(priceDiv);
    li.appendChild(actionButtons);
    list.insertBefore(li, list.firstChild);

    if (saveToStorage) {
      const data = JSON.parse(localStorage.getItem("watchlistData")) || {};
      if (!data[listId]) data[listId] = [];
      const exists = data[listId].some(s => s.name === name);
      if (!exists) {
        data[listId].push({ name, price });
        localStorage.setItem("watchlistData", JSON.stringify(data));
      }
    }
  }
});
