# Winter Camp 2026 Registration Form 🏔️❄️

A stunning, professional registration form web application for Winter Camp 2026. Features a breathtaking northern lights winter theme, AI-powered chatbot with RAG system, and Google Sheets integration via Cloudflare Workers.

![Winter Camp 2026](https://img.shields.io/badge/Winter%20Camp-2026-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite)

## ✨ Features

### 🎨 Stunning Visual Design
- **Northern Lights Animation** - Mesmerizing aurora borealis effect in the background
- **Mountain Landscape** - Layered SVG mountains with pine trees
- **Starry Night Sky** - Twinkling stars across the canvas
- **Animated Snowfall** - Gentle snow particles falling
- **Dark/Light Theme Toggle** - Switch between dark and light modes
- **Adventure Typography** - Bold, outdoor-style fonts (Bebas Neue, Orbitron)
- **Midnight Blue & Aurora Color Palette** - Deep blues, frosty whites, and vibrant aurora accents

### 🌐 Multi-language Support
- English 🇬🇧
- Indonesian (Bahasa) 🇮🇩
- Russian 🇷🇺

### 📋 Comprehensive Registration Form
**Personal Information:**
- Citizenship (with "Other" option)
- Full Name
- University/Institution
- Gender (with custom input option)
- Age

**Contact Information:**
- Phone Number
- Email Address
- VK Profile (Optional)
- Telegram Username (Optional)

**Event Discovery:**
- "How did you hear about us?" - Multi-select checkboxes

**Additional Info:**
- Allergies (all food is 100% Halal)
- KBRI Proof Upload (for Indonesian citizens)
- Performance Interest (Cultural Night)
- Terms & Conditions agreement
- Willingness to Participate
- Reason for Joining

### 🤖 AI-Powered Chatbot
- Powered by **Chutes.ai** with **Qwen/Qwen3-32B** model
- **RAG System** - Context-aware responses using knowledge base
- **Local Fallback** - Smart pattern matching when API unavailable
- Beautiful floating chat interface
- Multi-language support

### 📊 Backend Integration
- **Cloudflare Workers** - Proxy for form submission and file uploads
- **Google Sheets** - Registration data storage
- **Google Drive** - KBRI proof file storage

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2 | UI Library |
| Vite | 7.2 | Build tool |
| Tailwind CSS | 4.1 | Styling |
| i18next | 25.7 | Internationalization |
| GSAP | 3.14 | Animations |
| Headless UI | 2.2 | Accessible components |
| Cloudflare Workers | - | Backend proxy |
| Google Apps Script | - | Sheets integration |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/winter-camp-registration.git
cd winter-camp-registration

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173/winter-camp-registration/](http://localhost:5173/winter-camp-registration/) in your browser.

## 📊 Setting Up Google Sheets Integration

### Option 1: Via Cloudflare Worker (Recommended)

1. Navigate to `cloudflare-worker/` directory
2. Follow the instructions in `cloudflare-worker/README.md`
3. Deploy the worker and update the endpoint URL in `RegistrationFormNew.jsx`

### Option 2: Direct Google Apps Script

1. **Create a Google Sheet** at [sheets.google.com](https://sheets.google.com)
2. Go to **Extensions → Apps Script**
3. Copy contents of `google-apps-script.js` and paste
4. **Deploy → New deployment** as Web App
5. Set **Execute as**: "Me" and **Who has access**: "Anyone"
6. Copy the Web App URL to `src/components/RegistrationForm/RegistrationFormNew.jsx`

## 📁 Project Structure

```
winter-camp-registration/
├── src/
│   ├── components/
│   │   ├── Background/        # Northern lights & mountain background
│   │   ├── Chatbot/           # AI chatbot with RAG system
│   │   ├── EventDetails/      # Event information section
│   │   ├── FAQ/               # Expandable FAQ section
│   │   ├── Gallery/           # Photo gallery
│   │   ├── LanguageSelector/  # Multi-language switcher
│   │   ├── RegistrationForm/  # Registration form with validation
│   │   ├── Rundown/           # 3-day event schedule
│   │   ├── Snowfall/          # Snowfall animation
│   │   └── WhatToBring/       # Packing checklist
│   ├── context/
│   │   └── ThemeContext.jsx   # Dark/Light theme provider
│   ├── data/                  # Knowledge base files
│   ├── i18n/                  # Translations (EN, ID, RU)
│   ├── App.jsx                # Main application
│   ├── App.css
│   ├── index.css              # Global styles & design system
│   └── main.jsx               # Entry point
├── cloudflare-worker/         # Cloudflare Worker for backend
│   ├── worker.js              # Worker script
│   ├── google-apps-script.js  # Enhanced Apps Script
│   └── wrangler.toml          # Worker configuration
├── data/                      # Excel/CSV data files
├── public/                    # Static assets (logos)
├── google-apps-script.js      # Basic Apps Script
└── vite.config.js
```

## 📅 Event Details

| Detail | Information |
|--------|-------------|
| **Date** | February 12-14, 2026 |
| **Location** | Центр «Молодёжный», Saint Petersburg, Russia |
| **Organizer** | PERMIRA Saint Petersburg |
| **Supported by** | KBRI Moscow |

### Schedule Highlights
- **Day 1**: Arrival, Opening Ceremony, Talk Show, Team Building
- **Day 2**: Central Naval Museum Visit, Cultural Night Performances
- **Day 3**: Outdoor Games (Snowman Contest!), Award Ceremony, Departure

## 🎨 Design Theme

**Color Palette:**
| Color | Hex | Usage |
|-------|-----|-------|
| Midnight Blue | `#0a1628` | Background |
| Frosty White | `#e8f4fc` | Text |
| Aurora Blue | `#4facfe` | Accents |
| Aurora Cyan | `#00f2fe` | Highlights |
| Aurora Green | `#43e97b` | Success states |
| Camp Red | `#dc2626` | Errors |

**Typography:**
- Bebas Neue, Orbitron (adventure style)
- Inter (body text)

**Animations:**
- Northern lights effect
- Floating elements
- Snowfall particles
- Twinkling stars
- GSAP scroll-triggered animations

## 🎯 Form Validation

- All required fields have validation
- Email format validation
- Phone number format validation
- Age range validation (1-120)
- File size validation (KBRI proof max 2MB)
- Terms & conditions must be accepted
- Real-time error messages

## 🌍 Deployment

### GitHub Pages (Automatic)

1. Push to `main` branch
2. Go to **Settings → Pages**
3. Select "GitHub Actions" as source
4. Site deploys automatically

### Manual Build

```bash
npm run build
npm run preview
```

## 📞 Contact

**Organizers:**
- Fikriya: +79111495385
- Aris: +79810409453
- Abil: +6285121080413
- Telegram: [@permiraspb](https://t.me/permiraspb)

## 👨‍💻 Developer

**Muhammad Aris Septanugroho**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/muhammad-aris-septanugroho/)

## 📄 License

MIT License - Feel free to use for your own events!

---

⛷️ **Ready for the adventure of a lifetime!** 🏂❄️🏔️
