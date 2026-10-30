# 🔮 The Offline Medium

![The Offline Medium UI](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Fxox012t6obpulnxkaolk.png)
*(Replace the link above with a screenshot of your actual UI)*

**The Offline Medium** is a deeply private, fully local web application that acts as a digital clairvoyant and tarot card reader. Built for the [Hacktoberfest Open-Source AI Challenge (Week 4: Ghost in the Machine)](https://dev.to/challenges/hacktoberfest-week4-2026-10-26).

This project proves that we can have immersive, deeply engaging AI roleplay experiences without sacrificing privacy. It runs entirely on your local machine using an open-weight model, meaning it works even if you disconnect from the internet. **No cloud, no data harvesting, just you and the ghost in your machine.**

## ✨ Features
*   **100% Offline & Private:** Powered by local inference via Ollama. Your deepest questions never leave your device.
*   **Immersive Roleplay:** Highly engineered system prompts force Llama 3 to act as a mysterious, poetic medium drawing imaginary tarot cards.
*   **Real-time Typing Effect:** Utilizes the Web Streams API to render responses character-by-character as the local GPU generates them.
*   **Eerie Voice Output:** Integrates the browser's native Web Speech API to give the Medium a slow, haunting voice.
*   **Minimalist UI:** A clean, dark-themed interface built with React and Tailwind CSS.

## 🛠️ Tech Stack
*   **Frontend:** React, Vite, Tailwind CSS v3, Lucide React (Icons)
*   **Local Inference Engine:** Ollama
*   **Open-Weight Model:** Llama 3 (8B)

---

## 🚀 How to Run Locally

### 1. Awaken the Local Spirit (Install Ollama)
You need to install Ollama to run the AI model locally.
1. Download and install [Ollama](https://ollama.com/).
2. Open your terminal and pull the Llama 3 model:
   ```bash
   ollama pull llama3