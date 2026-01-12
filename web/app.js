let vehicles = [];

const output = document.getElementById("output");
const manufacturerInput = document.getElementById("manufacturerInput");

function print(text) {
    output.textContent = text;
}

// Load JSON via fetch (works when served by Live Server / Node server)
fetch("../data/electric_vehicles_dataset.json")
    .then(res => res.json())
    .then(data => {
        vehicles = data;
        print(`Dataset loaded.\nTotal records: ${vehicles.length}\n\nChoose a task.`);
    })
    .catch(err => {
        print("Failed to load JSON. Are you running Live Server?\n\n" + err);
    });

// Task (a)
document.getElementById("btnA").onclick = () => {
    const counts = {};
    for (let i = 0; i < vehicles.length; i++) {
        const m = vehicles[i].Manufacturer;
        if (counts[m]) counts[m]++; else counts[m] = 1;
    }

    let text = "Total vehicles by manufacturer:\n";
    for (const m in counts) text += `${m}: ${counts[m]}\n`;
    print(text);
};

// Task (b) unique models
document.getElementById("btnB").onclick = () => {
    const target = manufacturerInput.value.trim();
    if (!target) return print("Please type a manufacturer first (e.g., Mini).");

    const uniqueModels = [];
    for (let i = 0; i < vehicles.length; i++) {
        const v = vehicles[i];
        if (v.Manufacturer === target) {
            let found = false;
            for (let j = 0; j < uniqueModels.length; j++) {
                if (uniqueModels[j] === v.Model) { found = true; break; }
            }
            if (!found) uniqueModels.push(v.Model);
        }
    }

    if (uniqueModels.length === 0) return print(`No models found for: ${target}`);

    let text = `Models available from ${target}:\n`;
    for (let i = 0; i < uniqueModels.length; i++) text += `${i + 1}. ${uniqueModels[i]}\n`;
    print(text);
};

document.getElementById("btnC").onclick = () => {
    const best = {}; // { Manufacturer: { model, range } }

    for (let i = 0; i < vehicles.length; i++) {
        const v = vehicles[i];
        const m = v.Manufacturer;
        const range = v.Range_km;

        if (range === null || range === undefined || typeof range !== "number") continue;

        if (!best[m] || range > best[m].range) {
            best[m] = { model: v.Model, range: range };
        }
    }

    let text = "Longest driving range by manufacturer:\n";
    for (const m in best) {
        text += `${m}: ${best[m].model} (${best[m].range} km)\n`;
    }
    print(text);
};


//Task (c) — Longest range by manufacturer (all)

document.getElementById("btnC").onclick = () => {
    const best = {}; // { Manufacturer: { model, range } }

    for (let i = 0; i < vehicles.length; i++) {
        const v = vehicles[i];
        const m = v.Manufacturer;
        const range = v.Range_km;

        if (range === null || range === undefined || typeof range !== "number") continue;

        if (!best[m] || range > best[m].range) {
            best[m] = { model: v.Model, range: range };
        }
    }

    let text = "Longest driving range by manufacturer:\n";
    for (const m in best) {
        text += `${m}: ${best[m].model} (${best[m].range} km)\n`;
    }
    print(text);
};


document.getElementById("btnC").onclick = () => {
    const best = {}; // { Manufacturer: { model, range } }

    for (let i = 0; i < vehicles.length; i++) {
        const v = vehicles[i];
        const m = v.Manufacturer;
        const range = v.Range_km;

        if (range === null || range === undefined || typeof range !== "number") continue;

        if (!best[m] || range > best[m].range) {
            best[m] = { model: v.Model, range: range };
        }
    }

    let text = "Longest driving range by manufacturer:\n";
    for (const m in best) {
        text += `${m}: ${best[m].model} (${best[m].range} km)\n`;
    }
    print(text);
};


//Task (d) — Average charging time by charging type

document.getElementById("btnD").onclick = () => {
    const sum = {};
    const count = {};

    for (let i = 0; i < vehicles.length; i++) {
        const v = vehicles[i];
        const type = v.Charging_Type;
        const time = v.Charge_Time_hr;

        if (time === null || time === undefined || typeof time !== "number") continue;

        if (!sum[type]) {
            sum[type] = time;
            count[type] = 1;
        } else {
            sum[type] += time;
            count[type] += 1;
        }
    }

    let text = "Average charging time by charging type:\n";
    for (const type in sum) {
        const avg = sum[type] / count[type];
        text += `${type}: ${avg.toFixed(3)} hours\n`;
    }
    print(text);
};


//Task (e) — Top 5 safest vehicles in 2025

document.getElementById("btnE").onclick = () => {
    const list2025 = [];

    for (let i = 0; i < vehicles.length; i++) {
        const v = vehicles[i];
        if (v.Year === 2025 && typeof v.Safety_Rating === "number") {
            list2025.push(v);
        }
    }

    // Sort descending by Safety_Rating
    list2025.sort((a, b) => b.Safety_Rating - a.Safety_Rating);

    let text = "Top 5 safest vehicles in 2025:\n";
    for (let i = 0; i < 5 && i < list2025.length; i++) {
        const v = list2025[i];
        text += `${i + 1}. ${v.Manufacturer} : ${v.Model} (Safety: ${v.Safety_Rating})\n`;
    }

    if (list2025.length === 0) text += "No 2025 vehicles found.\n";
    print(text);
};


//Task(f) — Best - selling EV in 2024

document.getElementById("btnF").onclick = () => {
    let bestVehicle = null;
    let bestUnits = -1;

    for (let i = 0; i < vehicles.length; i++) {
        const v = vehicles[i];
        const units = v.Units_Sold_2024;

        if (units === null || units === undefined || typeof units !== "number") continue;

        if (units > bestUnits) {
            bestUnits = units;
            bestVehicle = v;
        }
    }

    if (!bestVehicle) {
        return print("No Units_Sold_2024 data found.");
    }

    print(
        `Best-selling EV in 2024:\n` +
        `${bestVehicle.Manufacturer} : ${bestVehicle.Model}\n` +
        `Units sold in 2024: ${bestUnits}`
    );
};
