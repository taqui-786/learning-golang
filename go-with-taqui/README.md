# 🐹 Go with Taqui — Visual Go Learning Platform

A modern, interactive, and visual web application designed to guide developers through their **Go (Golang)** journey — from foundational syntax to backend microservices, distributed systems, and Agentic AI.

---

## 🌟 Highlights & Features

- **📚 55 Comprehensive Modules (0–54):** Over 615 curated subtopics covering every aspect of Go development.
- **🌉 JavaScript & Python Bridges:** Explains Go concepts using mental models and direct comparisons familiar to JS/TS and Python engineers.
- **⚡ Client-Side Hash Routing:** Zero server configuration required; refreshes and direct links work seamlessly on GitHub Pages.
- **💾 LocalStorage Progress Tracking:** Automatically remembers completed topics, quiz results, and study streaks locally in your browser.
- **🎨 Handcrafted Visual Design:** Built with Tailwind CSS v4, smooth animations via Motion, and Lucide Icons.
- **🚀 Automated CI/CD:** Fully automated GitHub Actions workflow to build and deploy straight to GitHub Pages on every push.

---

## 🛠️ Tech Stack

* **Framework:** [React 19](https://react.dev/)
* **Build Tool:** [Vite](https://vite.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Animation:** [Motion](https://motion.dev/)

---

## 🚀 Getting Started Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (version 20+ recommended)
* `npm` (bundled with Node.js)

### 1. Install Dependencies
```bash
cd go-with-taqui
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` to explore the app with Hot Module Replacement (HMR).

### 3. Build for Production
```bash
npm run build
```
The optimized static build will be output to the `dist/` directory.

---

## 🌐 GitHub Pages Deployment

This application includes a continuous deployment workflow powered by **GitHub Actions** located at:
[`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml)

### How It Works:
1. Every time code is pushed to the `main` branch, the workflow triggers automatically.
2. It sets up Node.js 20, installs dependencies with `npm ci`, and runs `npm run build`.
3. The resulting `dist/` bundle is uploaded and deployed to GitHub Pages using official GitHub Actions (`actions/deploy-pages@v4`).

> [!NOTE]
> Ensure that GitHub Pages is enabled in your repository:
> **Settings ➔ Pages ➔ Build and deployment ➔ Source: GitHub Actions**.
