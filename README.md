# Sushanth CD — Software Engineer & AIML Specialist Portfolio

A modern, high-performance personal engineering portfolio for **Sushanth CD**, specializing in Artificial Intelligence & Machine Learning (AIML), production data pipelines, and full-stack software development.

Built entirely with **vanilla, zero-dependency web technologies** (HTML5, Modern CSS3, and ES6+ JavaScript), delivering instantaneous load times, responsive adaptability across all viewports, and glassmorphic aesthetics.

---

## 🌟 Key Highlights & Features

- **Responsive Vertical Navigation**: Pinned left sidebar on desktop (`>= 992px`) that automatically transitions into a sleek, frosted-glass mobile top bar with accessible off-canvas drawer navigation for tablet and mobile viewports (`< 992px`).
- **Interactive AI Twin Assistant**: A simulation of Sushanth CD capable of responding in real time to queries regarding machine learning models, algorithms, tech stack, and career goals. Features typing indicators, quick prompt chips, and full integration documentation for external LLMs (OpenAI GPT-4o-mini / Google Gemini).
- **Project Detail Modals & Video Embeds**: Accessible native `<dialog>` modals with keyboard trapping and background dimming. Includes system architecture summaries, performance metrics, and responsive 16:9 interactive video walkthrough demo embeds.
- **Glassmorphism & Depth System**: Curated Obsidian & Slate color palette with backdrop filters (`blur(16px)` / `blur(20px)`), multi-layered elevation drop shadows, and subtle ambient gradients.
- **Motion & Accessibility**: Desktop mouse-tracking parallax on the Hero portrait, progressive scroll entrance transitions (`IntersectionObserver`), and accessibility overrides for `prefers-reduced-motion`.
- **Contact Form**: Form validation, loading state feedback, interactive confirmation card, and instructions for serverless dispatch via Resend API.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Markup** | Semantic HTML5, WAI-ARIA roles, native `<dialog>` element |
| **Styling** | Modern CSS3, CSS Custom Properties (Tokens), Flexbox, CSS Grid, Glassmorphic Backdrop Filters |
| **Logic** | Vanilla JavaScript (ES6+ IIFE), `IntersectionObserver`, `requestAnimationFrame` |
| **Typography** | Google Fonts (`Outfit` for headings, `Inter` for body, `JetBrains Mono` for code & badges) |
| **Dependencies** | **0 External Libraries** (Pure native browser APIs) |

---

## 📂 Project Structure

```text
Sush-ide/
├── index.html              # Main single-page portfolio application
├── index.css               # Design system, tokens, layout & responsive media queries
├── index.js                # Drawer navigation, scrollspy, AI twin, modals & parallax
├── 404.html                # Branded glassmorphic 404 error page
├── .nojekyll               # Instructs GitHub Pages to bypass Jekyll processing
├── robots.txt              # Search engine crawler permissions
├── sitemap.xml             # XML sitemap for SEO discovery
├── Sush proff pic.jpeg     # Hero profile portrait (maintained in native 3:4 ratio)
├── churn-thumb.jpg         # Customer Churn project thumbnail & preview
├── algo-thumb.jpg          # Algorithmic Suite project thumbnail & preview
├── eda-thumb.jpg           # EDA Dashboard project thumbnail & preview
├── pixel-avatar.jpg        # Digital pixel avatar asset
└── README.md               # Project documentation & deployment guide
```

---

## 💻 Local Preview & Testing

To run and preview the website locally on your computer:

### Option 1: Python HTTP Server (Recommended)
Open your terminal inside this project folder and run:
```bash
# Python 3
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in any web browser.

### Option 2: VS Code Live Server
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and select **"Open with Live Server"**.

---

## 🚀 Deployment Guide

### Method 1: Deploy to GitHub Pages (Free & Recommended)

#### Step 1: Initialize Git and Commit
Open a terminal in this project folder (`Sush-ide`) and execute:
```bash
# Initialize git repository
git init

# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: Sushanth CD Portfolio"
```

#### Step 2: Create a GitHub Repository
1. Log in to your [GitHub Account](https://github.com).
2. Click the **`+`** icon in the top right corner and choose **New repository**.
3. Name your repository (e.g., `sushanth-portfolio` or `sushanthcd.github.io` for a user site).
4. Keep the repository **Public** and leave "Initialize with a README" unchecked.
5. Click **Create repository**.

#### Step 3: Link and Push
In your local terminal, link the remote and push:
```bash
# Rename branch to main
git branch -M main

# Add your GitHub repository as remote (replace YOUR-USERNAME and REPO-NAME)
git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git

# Push the code to GitHub
git push -u origin main
```

#### Step 4: Activate GitHub Pages
1. In your GitHub repository, navigate to **Settings** (tab at the top).
2. In the left sidebar, click **Pages** (under the "Code and automation" section).
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Choose `main` and folder `/ (root)`.
4. Click **Save**.
5. Wait 1–2 minutes. GitHub will provide a live URL, e.g.:
   `https://YOUR-USERNAME.github.io/REPO-NAME/`

---

### Method 2: Deploy to Vercel (Instant HTTPS & Global CDN)

1. Go to [Vercel](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** > **Project**.
3. Select your portfolio repository from GitHub.
4. Leave all build settings at their defaults (Framework Preset: **Other**, Build Command: empty).
5. Click **Deploy**. Your site will be live on an HTTPS `.vercel.app` domain in seconds.

---

### Method 3: Deploy to Netlify (Drag-and-Drop or Git)

#### Drag-and-Drop (Zero Git required):
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop the entire `Sush-ide` folder into the browser window.
3. Your website is instantly live!

#### Git Integration:
1. Connect your GitHub repository in the Netlify dashboard.
2. Publish directory: `.` (root).
3. Click **Deploy Site**.

---

## 🔒 Connecting Real APIs

### 1. OpenAI / Gemini for AI Twin
See lines 150–208 in `index.js` for step-by-step instructions on setting up a lightweight serverless proxy endpoint to connect your live OpenAI or Google Gemini API key securely.

### 2. Resend API for Contact Form
See lines 385–453 in `index.js` for sample Node.js serverless functions to dispatch inquiries directly to your inbox.

---

## 📄 License
Created by Sushanth CD. All rights reserved.
