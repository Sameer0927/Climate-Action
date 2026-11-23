// ----- Emission factors (kg CO2 per unit) -----
const FACTORS = {
  electricity: 0.727,   // per kWh
  petrol: 2.2428,       // per litre
  water: 0.0004,        // per litre (approximate)
  waste: 0.5            // per kg (approximate)
};

// Approximate benchmarks, kg CO2 per person per month
const BENCHMARKS = [
  { name: "Indian average", value: 160 },
  { name: "World average", value: 400 }
];

let latestResult = null;

// Helper: read a number from an input box
function getNumber(id) {
  const value = parseFloat(document.getElementById(id).value);
  return isNaN(value) || value < 0 ? 0 : value;
}

// Helper: draw one bar
function makeBar(label, value, max, colorClass) {
  const percent = Math.min((value / max) * 100, 100);
  return `
    <div class="bar-row">
      <span class="bar-label">${label}</span>
      <div class="bar-track">
        <div class="bar-fill ${colorClass}" style="width:${percent}%"></div>
      </div>
      <span class="bar-value">${value.toFixed(1)} kg</span>
    </div>`;
}

function calculate() {
  const people = Math.max(getNumber("people"), 1);

  // Monthly emissions for each source
  const electricity = getNumber("electricity") * FACTORS.electricity;
  const petrol = getNumber("petrol") * FACTORS.petrol;
  const water = getNumber("water") * 30 * FACTORS.water;
  const waste = getNumber("waste") * 4 * FACTORS.waste;

  const total = electricity + petrol + water + waste;
  const perPerson = total / people;

  latestResult = {
    date: new Date().toLocaleDateString(),
    total: Number(total.toFixed(1)),
    perPerson: Number(perPerson.toFixed(1)),
    electricity: Number(electricity.toFixed(1)),
    petrol: Number(petrol.toFixed(1)),
    water: Number(water.toFixed(1)),
    waste: Number(waste.toFixed(1))
  };

  // Show results
  document.getElementById("resultBox").style.display = "block";
  document.getElementById("totalValue").textContent = total.toFixed(1);
  document.getElementById("perPerson").textContent =
    "That is " + perPerson.toFixed(1) + " kg per person.";

  // Breakdown bars
  const biggest = Math.max(electricity, petrol, water, waste, 1);
  document.getElementById("breakdown").innerHTML =
    makeBar("Electricity", electricity, biggest, "green") +
    makeBar("Petrol", petrol, biggest, "orange") +
    makeBar("Water", water, biggest, "blue") +
    makeBar("Waste", waste, biggest, "grey");

  // Comparison bars
  const maxCompare = Math.max(perPerson, ...BENCHMARKS.map(b => b.value));
  let compareHtml = makeBar("You", perPerson, maxCompare, "green");
  BENCHMARKS.forEach(function (b) {
    compareHtml += makeBar(b.name, b.value, maxCompare, "grey");
  });
  document.getElementById("comparison").innerHTML = compareHtml;

  // Impact message: what if 100 students cut 10 percent
  const saved = perPerson * 0.10 * 100;
  document.getElementById("impactMessage").textContent =
    "If 100 students each cut their footprint by just 10%, we would save about " +
    saved.toFixed(0) + " kg CO₂ every month.";

  document.getElementById("saveMessage").textContent = "";
}

// Save the latest result in the browser
function saveResult() {
  if (!latestResult) return;
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem("footprints")) || [];
  } catch (e) {
    history = [];
  }
  history.push(latestResult);
  localStorage.setItem("footprints", JSON.stringify(history));
  document.getElementById("saveMessage").textContent = "Saved! You can see it on your dashboard.";
}

document.getElementById("calcBtn").addEventListener("click", calculate);
document.getElementById("saveBtn").addEventListener("click", saveResult);