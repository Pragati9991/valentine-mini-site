# 💖 Customizable Valentine / Birthday Mini Site

A cute, romantic, customizable one-page mini site built with **Vite (Vanilla JS)**.

## ✨ Features

- Intro screen with image + message
- Playful “Will you be my Valentine?” screen (escaping "No" button)
- Customizable lunch / activity / evening options
- Optional custom text input
- Final summary screen
- Copy to clipboard
- WhatsApp share button
- Ready for GitHub + Netlify auto-deploy

---

## 🚀 Getting Started

### Install dependencies

```bash
npm install

Run locally
npm run dev


Open the local URL shown in your terminal.

🏗 Build for Production
npm run build


Preview production version:

npm run preview

🌍 Deployment (GitHub + Netlify Auto Deploy)

After connecting the repository to Netlify:

Update workflow:

git add .
git commit -m "Update content"
git push


Netlify will automatically rebuild and deploy the updated version.

🎨 How to Customize
🖼 Change the Image

Place your image inside:

/public/us.jpeg


If you use a different filename, update the image path inside Intro() in:

/src/main.js


Example:

<img src="/your-image-name.jpeg" />

✏ Change Intro Text

Open:

/src/main.js


Edit the text inside the Intro() function.

🍽 Change the Options

Inside Choices() in:

/src/main.js


Edit these arrays:

const lunchOpts = [
  "Italian 🍝",
  "Ramen 🍜",
  "Sushi 🍣",
  "Spanish / Mediterranean 🥘"
];

const actOpts = [
  "Ceramics class 🏺",
  "Long walk together 🚶‍♀️🚶‍♂️",
  "Massage / spa 💆",
  "Coffee + dessert ☕🍰"
];

const eveOpts = [
  "Cozy movie at home 🎬",
  "Fun at home games 🎲",
  "Early cuddle + sleep 😴"
];

😈 Customize the “No” Button Messages

Inside Valentine() in:

/src/main.js


Edit:

const teasePhrases = [
  "Hmm? 😏",
  "Try again 😌",
  "Nope 😜",
  "You sure? 💕"
];

📁 Project Structure
project-root/
│
├── public/
│   └── us.jpeg
│
├── src/
│   ├── main.js
│   └── style.css
│
├── index.html
├── package.json
└── README.md

✨ Future Improvement (Optional)

To make this fully reusable for anyone:

Move all customizable text and options into a separate config.js

Keep logic untouched

Allow users to edit only one configuration file

📄 License

Free to use, modify, and personalize.
