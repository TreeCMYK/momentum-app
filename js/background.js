const images = ["blue.jpg", "green.jpg", "violet.jpg"];

const chosenImage = images[Math.floor(Math.random() * images.length)];

const bgImage = document.createElement("img");

document.body.style.backgroundImage = `url('img/${chosenImage}')`;

// document.body.appendChild(bgImage);
