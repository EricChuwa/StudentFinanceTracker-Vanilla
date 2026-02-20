const KEY = "finance:data";

export function loadData() {
  const data = localStorage.getItem(KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch(e) {
      console.error("Failed to parse data from localStorage", e);
    }
  }
  return null;
}

export function saveData(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch(e) {
    console.error("Failed to save data", e);
  }
}

export async function loadSeed() {
  try {
    const res = await fetch('/seed.json');
    if (res.ok) {
      const seedData = await res.json();
      saveData(seedData);
      return seedData;
    }
  } catch (e) {
    console.error("Failed to load seed.json", e);
  }
  return { transactions: [], budgets: [] };
}
