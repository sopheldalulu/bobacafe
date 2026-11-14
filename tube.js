"use strict";
const menu = {
  tea: [
    { id: "strawberry", name: "🍓 Strawberry", color: "#e99eac" },
    { id: "matcha", name: "🍵 Matcha", color: "#a8c49b" },
    { id: "taro", name: "💜 Taro", color: "#b9a0d3" },
    { id: "classic", name: "🫖 Classic", color: "#cf9e78" },
  ],
  milk: [
    { id: "whole", name: "🥛 Regular milk" },
    { id: "oat", name: "🌾 Oat milk" },
    { id: "coconut", name: "🥥 Coconut milk" },
    { id: "none", name: "💧 No milk" },
  ],
  topping: [
    { id: "pearls", name: "⚫ Tapioca pearls" },
    { id: "jelly", name: "🍮 Jelly" },
    { id: "popping", name: "🫧 Popping boba" },
    { id: "none", name: "✨ No topping" },
  ],
  sweetness: [
    { id: "0", name: "0% sugar" },
    { id: "25", name: "25% sugar" },
    { id: "50", name: "50% sugar" },
    { id: "100", name: "100% sugar" },
  ],
};
const guests = [
  ["🐰", "Mochi"],
  ["🐱", "Mimi"],
  ["🐻", "Boba Bear"],
  ["🦊", "Peaches"],
  ["🐼", "Panda"],
  ["🐸", "Pip"],
  ["🐹", "Pudding"],
];
const $ = (id) => document.getElementById(id);
function loadStats() {
  try {
    const x = JSON.parse(localStorage.getItem("bubble-bloom-v1"));
    return {
      coins: Math.max(0, Number(x?.coins) || 0),
      served: Math.max(0, Number(x?.served) || 0),
      best: Math.max(0, Number(x?.best) || 0),
    };
  } catch {
    return { coins: 0, served: 0, best: 0 };
  }
}
const saved = loadStats();
let coins = saved.coins,
  served = saved.served,
  best = saved.best,
  streak = 0,
  selection = {},
  order = {},
  resolved = false,
  previousGuest = -1;
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const get = (category, id) => menu[category].find((item) => item.id === id);
function store() {
  try {
    localStorage.setItem(
      "bubble-bloom-v1",
      JSON.stringify({ coins, served, best }),
    );
  } catch {
    /* Private browsing may disable storage */
  }
}
function stats() {
  $("coins").textContent = coins;
  $("served").textContent = served;
  $("streak").textContent = streak;
  $("best").textContent = best;
  store();
}
function options() {
  for (const [category, items] of Object.entries(menu)) {
    const parent = $(category + "-options");
    parent.replaceChildren();
    for (const item of items) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "option";
      b.textContent = item.name;
      b.dataset.id = item.id;
      b.setAttribute("aria-pressed", String(selection[category] === item.id));
      if (selection[category] === item.id) b.classList.add("active");
      b.addEventListener("click", () => {
        if (resolved) return;
        selection[category] = item.id;
        options();
        cup();
      });
      parent.appendChild(b);
    }
  }
}
function cup() {
  const t = get("tea", selection.tea);
  $("cup").style.setProperty("--tea-color", t?.color || "#f4d8d8");
  const topping = selection.topping;
  $("pearls").replaceChildren();
  if (topping && topping !== "none") {
    for (let i = 0; i < 12; i++) {
      const p = document.createElement("div");
      p.className = "pearl";
      if (topping === "jelly") {
        p.style.borderRadius = "4px";
        p.style.background = "#ebc37c";
      }
      if (topping === "popping") {
        p.style.background = ["#f7d984", "#e98bb5", "#a3d2aa"][i % 3];
      }
      $("pearls").appendChild(p);
    }
  }
  $("cup-caption").textContent = t
    ? get("tea", selection.tea).name + " boba"
    : "Choose your ingredients!";
}
function newCustomer() {
  const choices = guests.map((_, i) => i).filter((i) => i !== previousGuest);
  const index = random(choices);
  previousGuest = index;
  const guest = guests[index];
  $("customer").textContent = guest[0];
  $("customer-name").textContent = guest[1];
  order = Object.fromEntries(
    Object.entries(menu).map(([key, items]) => [key, random(items).id]),
  );
  $("order").textContent =
    `${get("tea", order.tea).name} · ${get("milk", order.milk).name} · ${get("topping", order.topping).name} · ${get("sweetness", order.sweetness).name}`;
  selection = {};
  resolved = false;
  $("serve").disabled = false;
  $("message").textContent = "Choose all four ingredients, then press Serve!";
  options();
  cup();
}
function serve() {
  if (resolved) return;
  const keys = Object.keys(menu);
  const missing = keys.filter((k) => !selection[k]);
  if (missing.length) {
    $("message").textContent =
      "Oops! Choose your " + missing.join(", ") + " first. 💗";
    return;
  }
  resolved = true;
  $("serve").disabled = true;
  served++;
  const correct = keys.every((k) => selection[k] === order[k]);
  if (correct) {
    streak++;
    best = Math.max(best, streak);
    const earned = 15 + Math.min(20, (streak - 1) * 5);
    coins += earned;
    $("message").textContent =
      `Perfect! 💖 ${$("customer-name").textContent} loves it! +${earned} coins. ${streak > 1 ? "Streak bonus! ✨" : ""}`;
  } else {
    const matches = keys.filter((k) => selection[k] === order[k]).length;
    streak = 0;
    const earned = matches * 2;
    coins += earned;
    const wrong = keys.filter((k) => selection[k] !== order[k]).join(", ");
    $("message").textContent =
      `Almost! 🌷 You got ${matches}/4 ingredients right. Check: ${wrong}. +${earned} coins.`;
  }
  stats();
}
$("serve").addEventListener("click", serve);
$("next").addEventListener("click", newCustomer);
stats();
newCustomer();
