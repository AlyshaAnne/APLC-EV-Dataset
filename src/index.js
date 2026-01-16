/*

 Phase 1 – Imperative Programming
 Task (a): Count total vehicles by manufacturer.
 Task (b): Search and display the list of models available from a specific manufacturing company.
 Task (c): Identify the model with the longest driving range for each manufacturer.
 Task (d): Average charging time by charging type.
 Task (e): Top 5 safest vehicles in 2025

 */

// fs = File System module (lets Node read files from disk)
// path = helps build file paths safely (works on Windows/Mac/Linux)
const fs = require("fs");
const path = require("path");

// Build path to JSON file
const dataPath = path.join(__dirname, "../data/electric_vehicles_dataset.json");

// Read and parse JSON
const rawData = fs.readFileSync(dataPath, "utf-8");
const vehicles = JSON.parse(rawData);

// Quick verification: show how many records were loaded
console.log("Total records:", vehicles.length);


/*Task (a): Total number of vehicles by manufacturer
  ==========================================================
Goal:
- For each Manufacturer, count how many records belong to it.

   Imperative approach:
  - Create an object(dictionary) to store counts
  - Loop through all vehicles
  - Increase the count one - by - one
  */

// This object will look like:
// { "Mini": 72, "Tesla": 69, ... }
const manufacturerCount = {};


// Loop through all vehicle records
for (let i = 0; i < vehicles.length; i++) {
  // Read the Manufacturer field from the current vehicle
  const manufacturer = vehicles[i].Manufacturer;


  // If manufacturer already exists in the object, increment the count
  if (manufacturerCount[manufacturer]) {
    manufacturerCount[manufacturer]++;
  } else {
    // Otherwise, create the key and set count to 1
    manufacturerCount[manufacturer] = 1;
  }
}

// Display results
console.log("\nTotal vehicles by manufacturer:");
for (const manufacturer in manufacturerCount) {
  console.log(manufacturer + ":", manufacturerCount[manufacturer]);
}



/* Task (b): List UNIQUE models by a specific manufacturer
   ==========================================================
   Goal:
   - Given a Manufacturer name (e.g., "Mini"),
     print a list of models WITHOUT duplicates.

   Imperative approach:
   - Loop through all vehicles
   - If the manufacturer matches:
       check if model is already inside uniqueModels array
       if not found -> push it
*/

// Change this to test different manufacturers:
const targetManufacturer = "Mini";
// Array to store unique model names
const uniqueModels = [];


// Loop through all vehicles
for (let i = 0; i < vehicles.length; i++) {
  const v = vehicles[i];


  // Only consider vehicles from the target manufacturer
  if (v.Manufacturer === targetManufacturer) {
    // check if model already exists in uniqueModels
    let found = false;
    for (let j = 0; j < uniqueModels.length; j++) {
      if (uniqueModels[j] === v.Model) {
        found = true;
        break;
      }
    }
    // If not found, add it to the list
    if (!found) {
      uniqueModels.push(v.Model);
    }
  }
}
// Display results
console.log(`\nModels available from ${targetManufacturer}:`);
for (let i = 0; i < uniqueModels.length; i++) {
  console.log(`${i + 1}. ${uniqueModels[i]}`);
}


/*Task (c): Identify the model with the longest driving range for each manufacturer
  ==========================================================
  Goal:
  - For every Manufacturer, find the vehicle with the highest Range_km
    - Output: Manufacturer: Model(Range km)

   Imperative approach:
- Create an object that stores the current "best"(max range) per manufacturer
  - Loop through all vehicles:
if manufacturer not seen -> store it
       else if range is bigger -> replace stored record
  */

// Example structure:
// {
//   "Mini": { model: "Mini Cooper SE", range: 594 },
//   "Tesla": { model: "Model S", range: 600 }
// }


const bestByManufacturer = {};
// structure: { "Mini": { model: "...", range: 594 }, ... }


// Loop through all vehicles
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



/* 
   Task (d): Determine average charging time by charging type
   ==========================================================
   Goal:
   - For each Charging_Type, compute the average Charge_Time_hr

   Imperative approach:
   - Use 2 objects:
     1) sumByChargingType[type]   = total charge time
     2) countByChargingType[type] = how many vehicles contributed
   - Average = sum / count
*/



const sumByChargingType = {};
const countByChargingType = {};


// Loop through all vehicles
for (let i = 0; i < vehicles.length; i++) {
  const v = vehicles[i];
  const type = v.Charging_Type;
  const time = v.Charge_Time_hr;



  // Skip missing/invalid charge time
  if (time === null || time === undefined || typeof time !== "number") continue;


  // First time seeing this charging type: create keys
  if (!sumByChargingType[type]) {
    sumByChargingType[type] = time;
    countByChargingType[type] = 1;
  } else {

    // Add time and increase count
    sumByChargingType[type] += time;
    countByChargingType[type] += 1;
  }
}

// Display average for each charging type
console.log("\nAverage charging time by charging type:");
for (const type in sumByChargingType) {
  const avg = sumByChargingType[type] / countByChargingType[type];
  console.log(`${type}: ${avg.toFixed(3)} hours`);
}



/* 
   Task (e): Top 5 safest vehicles in 2025
   ==========================================================
   Goal:
   - Filter vehicles where Year === 2025 and Safety_Rating is valid
   - Sort them by Safety_Rating descending
   - Print the top 5

   Imperative approach:
   - Step 1: manually build a new array of 2025 vehicles
   - Step 2: manually sort using nested loops (swap technique)
   - Step 3: print first 5 items
*/


console.log("\nTop 5 safest vehicles (2025):");

// Step 1: collect 2025 vehicles with valid safety rating
let vehicles2025 = [];

for (let i = 0; i < vehicles.length; i++) {
  let v = vehicles[i];

  // Only keep records from 2025 where safety rating exists
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


/* 
   Task (f): Best-selling electronic vehicle in 2024 
   ==========================================================
   Goal:
   - Find the single vehicle record with the highest Units_Sold_2024
   - Output: Manufacturer : Model (Units sold: X)

   Imperative approach:
   - Keep a variable bestSeller
   - Loop through all records:
       if current units sold is higher, replace bestSeller
*/


console.log("\nBest-selling EV in 2024:");

// Start with null (meaning: we haven't found any candidate yet)
let bestSeller = null;

// Loop through all vehicles
for (let i = 0; i < vehicles.length; i++) {
  let v = vehicles[i];

  // Only consider records where Units_Sold_2024 exists
  if (v.Units_Sold_2024 !== null) {
    // If bestSeller not set yet OR current record has higher sales -> update bestSeller
    if (bestSeller === null || v.Units_Sold_2024 > bestSeller.Units_Sold_2024) {
      bestSeller = v;
    }
  }
}
// Print result if we found a best seller
if (bestSeller !== null) {
  console.log(
    `${bestSeller.Manufacturer} : ${bestSeller.Model} (Units sold: ${bestSeller.Units_Sold_2024})`
  );
}
