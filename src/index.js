/*

 Phase 1 – Imperative Programming
 Task (a): Count total vehicles by manufacturer.
 Task (b): Search and display the list of models available from a specific manufacturing company.
 Task (c): Identify the model with the longest driving range for each manufacturer.
 Task (d): Average charging time by charging type.
 Task (e): Top 5 safest vehicles in 2025

 */


const fs = require("fs");
const path = require("path");

// Build path to JSON file
const dataPath = path.join(__dirname, "../data/electric_vehicles_dataset.json");

// Read and parse JSON
const rawData = fs.readFileSync(dataPath, "utf-8");
const vehicles = JSON.parse(rawData);

console.log("Total records:", vehicles.length);


// Task (a): Total number of vehicles by manufacturer
const manufacturerCount = {};

for (let i = 0; i < vehicles.length; i++) {
  const manufacturer = vehicles[i].Manufacturer;

  if (manufacturerCount[manufacturer]) {
    manufacturerCount[manufacturer]++;
  } else {
    manufacturerCount[manufacturer] = 1;
  }
}

// Display results
console.log("\nTotal vehicles by manufacturer:");
for (const manufacturer in manufacturerCount) {
  console.log(manufacturer + ":", manufacturerCount[manufacturer]);
}



// Task (b): List UNIQUE models by a specific manufacturer
const targetManufacturer = "Mini";
const uniqueModels = [];

for (let i = 0; i < vehicles.length; i++) {
  const v = vehicles[i];

  if (v.Manufacturer === targetManufacturer) {
    // check if model already exists in uniqueModels
    let found = false;
    for (let j = 0; j < uniqueModels.length; j++) {
      if (uniqueModels[j] === v.Model) {
        found = true;
        break;
      }
    }

    if (!found) {
      uniqueModels.push(v.Model);
    }
  }
}

console.log(`\nModels available from ${targetManufacturer}:`);
for (let i = 0; i < uniqueModels.length; i++) {
  console.log(`${i + 1}. ${uniqueModels[i]}`);
}


// Task (c): Identify the model with the longest driving range for each manufacturer
const bestByManufacturer = {};
// structure: { "Mini": { model: "...", range: 594 }, ... }

for (let i = 0; i < vehicles.length; i++) {
  const v = vehicles[i];
  const m = v.Manufacturer;
  const model = v.Model;
  const range = v.Range_km;

  // Skip missing/invalid range values
  if (range === null || range === undefined || typeof range !== "number") continue;

  // If manufacturer not seen yet, store first record
  if (!bestByManufacturer[m]) {
    bestByManufacturer[m] = { model: model, range: range };
  } else {
    // Update if this vehicle has a longer range
    if (range > bestByManufacturer[m].range) {
      bestByManufacturer[m] = { model: model, range: range };
    }
  }
}

// Display results
console.log("\nLongest driving range by manufacturer:");
for (const m in bestByManufacturer) {
  console.log(`${m}: ${bestByManufacturer[m].model} (${bestByManufacturer[m].range} km)`);
}



// Task (d): Determine average charging time by charging type
const sumByChargingType = {};
const countByChargingType = {};

for (let i = 0; i < vehicles.length; i++) {
  const v = vehicles[i];
  const type = v.Charging_Type;
  const time = v.Charge_Time_hr;

  if (time === null || time === undefined || typeof time !== "number") continue;

  if (!sumByChargingType[type]) {
    sumByChargingType[type] = time;
    countByChargingType[type] = 1;
  } else {
    sumByChargingType[type] += time;
    countByChargingType[type] += 1;
  }
}

console.log("\nAverage charging time by charging type:");
for (const type in sumByChargingType) {
  const avg = sumByChargingType[type] / countByChargingType[type];
  console.log(`${type}: ${avg.toFixed(3)} hours`);
}


// Task (e): Top 5 safest vehicles in 2025 (imperative)

console.log("\nTop 5 safest vehicles (2025):");

// Step 1: collect 2025 vehicles with valid safety rating
let vehicles2025 = [];

for (let i = 0; i < vehicles.length; i++) {
  let v = vehicles[i];

  if (v.Year === 2025 && v.Safety_Rating !== null) {
    vehicles2025.push(v);
  }
}

// Step 2: sort by safety rating (descending)
for (let i = 0; i < vehicles2025.length - 1; i++) {
  for (let j = i + 1; j < vehicles2025.length; j++) {
    if (vehicles2025[j].Safety_Rating > vehicles2025[i].Safety_Rating) {
      let temp = vehicles2025[i];
      vehicles2025[i] = vehicles2025[j];
      vehicles2025[j] = temp;
    }
  }
}

// Step 3: display top 5
for (let i = 0; i < 5 && i < vehicles2025.length; i++) {
  let v = vehicles2025[i];
  console.log(
    `${i + 1}. ${v.Manufacturer} : ${v.Model} (Safety: ${v.Safety_Rating})`
  );

  if (
    vehicles2025[j].Safety_Rating > vehicles2025[i].Safety_Rating ||
    (
      vehicles2025[j].Safety_Rating === vehicles2025[i].Safety_Rating &&
      vehicles2025[j].Range_km > vehicles2025[i].Range_km
    )
  ) {
    let temp = vehicles2025[i];
    vehicles2025[i] = vehicles2025[j];
    vehicles2025[j] = temp;
  }


}


// Task (f): Best-selling electronic vehicle in 2024 (imperative)

console.log("\nBest-selling EV in 2024:");

let bestSeller = null;

for (let i = 0; i < vehicles.length; i++) {
  let v = vehicles[i];

  if (v.Units_Sold_2024 !== null) {
    if (bestSeller === null || v.Units_Sold_2024 > bestSeller.Units_Sold_2024) {
      bestSeller = v;
    }
  }
}

if (bestSeller !== null) {
  console.log(
    `${bestSeller.Manufacturer} : ${bestSeller.Model} (Units sold: ${bestSeller.Units_Sold_2024})`
  );
}
