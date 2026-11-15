"use strict";
const menu = {
    tea: [
        { id: "strawberry", name: "strawberry 🍓", color: "#e99eac" },
        { id: "matcha", name: "matcha 🍵", color: "#a8c49b" },
        { id: "taro", name: "taro 💜", color: "#b9a0d3"},
        { id: "classic", name: "classic 🫖", color: "#cf9e78" },
    ],
    milk : [
        { id: "whole", name: "whole milk 🥛" },
        { id: "oat", name: "oat milk 🌾" },
        { id: "coconut", name: "coconut milk 🥥" },
        { id: "none", name: "no milk 💧" },
    ],
    topping: [
        { id: "pearls", name: "tapioca pearls ⚫" },
        { id: "jelly", name: "jelly 🍮", },
        { id: "popping", name: "popping pearls 🫧" },
        { id: "none", name: "no topping ✨" },
    ],
    sweetness: [
        { id: "0", name: "0% sugar" },
        { id: "25", name: "25% sugar" },
        { id: "50", name: "50% sugar" },
        { id: "75", name: "75% sugar" },
        { id: "100", name: "100% sugar" }
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
        }
    }
}