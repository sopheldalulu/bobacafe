"use strict";
const menu = {
  tea: [
    { id: "strawberry", name: "strawberry 🍓", color: "#e99eac" },
    { id: "matcha", name: "matcha 🍵", color: "#a8c49b" },
    { id: "taro", name: "taro 💜", color: "#b9a0d3" },
    { id: "classic", name: "classic 🫖", color: "#cf9e78" },
  ],
  milk: [
    { id: "whole", name: "whole milk 🥛" },
    { id: "oat", name: "oat milk 🌾" },
    { id: "coconut", name: "coconut milk 🥥" },
    { id: "none", name: "no milk 💧" },
  ],
  topping: [
    { id: "pearls", name: "tapioca pearls ⚫" },
    { id: "jelly", name: "jelly 🍮" },
    { id: "popping", name: "popping pearls 🫧" },
    { id: "none", name: "no topping ✨" },
  ],
  sweetness: [
    { id: "0", name: "0% sugar" },
    { id: "25", name: "25% sugar" },
    { id: "50", name: "50% sugar" },
    { id: "75", name: "75% sugar" },
    { id: "100", name: "100% sugar" },
  ],
};

const guests = [
  ["🐰", "Mimi"],
  ["🐱", "Prince"],
  ["🐻", "Barbara"],
  ["🦊", "Tim"],
  ["🐼", "Andy"],
  ["🐸", "Fran"],
  ["🐹", "Hannah"],
];

const $ = (id) => document.getElementById(id);
function loadStats() {
  try {
    const x = JSON.parse(localStorage.getItem("bubble-bloom-v1"));
    return {
      coins: Math.max(0, Number(x?.coins) || 0),
      serve: Math.max(0, Number(x?.served) || 0),
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
    localStorage.setitem(
      "boba-cafe-v1",
      JSON.stringify({ coins, served, best }),
    );
  } catch {
    /* private browing may disable storage */
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
  for (const [category, items] of Object.entries(menuu)) {
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
        selection[category] === item.id;
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
  const topping = selection.toppping;
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
    : "choose your ingredients!";
}

function newCustomer() {
  const choices = guests.map((_, i) => i).filter((i) => i !== previousGuest);
  const index = random(choices);
  previousGuest = index;
  const guest = guests[index];
  $("customer").textContent = guest[0];
  $("customer-name").textContent = guest[1];
  order = Object.fromEntries();
}
