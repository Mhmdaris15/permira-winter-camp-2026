# Winter Camp 2025 Registration Form 🏔️❄️

A stunning, professional registration form web application for Winter Camp 2025, featuring a breathtaking northern lights winter theme, AI-powered chatbot, and Google Sheets integration.

![Winter Camp 2025](https://img.shields.io/badge/Winter%20Camp-2025-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite)

## ✨ Features

### 🎨 Stunning Visual Design
- **Northern Lights Animation** - Mesmerizing aurora borealis effect in the background
- **Mountain Landscape** - Layered SVG mountains with pine trees
- **Starry Night Sky** - Twinkling stars across the canvas
- **Animated Snowfall** - Gentle snow particles falling
- **Adventure Typography** - Bold, outdoor-style fonts (Bebas Neue, Orbitron)
- **Midnight Blue & Aurora Color Palette** - Deep blues, frosty whites, and vibrant aurora accents

### 🌐 Multi-language Support
- English 🇬🇧
- Indonesian (Bahasa) 🇮🇩
- Russian 🇷🇺

### 📋 Comprehensive Registration Form
**Personal Information:**
- Citizenship (with "Other" option that reveals text input)
- Full Name
- University/Institution
- Gender (with "Other" option for custom input)
- Age

**Contact Information:**
- Phone Number
- Email Address
- Social Media (Optional): Instagram, Twitter/X, LinkedIn

**Event Discovery:**
- "How did you hear about us?" - Multi-select checkboxes
  - Social Media, Friend/Family, University, Website, Email, Poster, Other

**Additional Info:**
- Dietary Restrictions
- Allergies
- Terms & Conditions agreement
- Willingness to Participate (Yes/No)
- Reason for Joining

### 🤖 AI-Powered Chatbot
- Powered by **Google Gemini AI**
- Context-aware responses about Winter Camp
- Beautiful floating chat interface
- Secure API key input

### 📊 Google Sheets Integration
- Form submissions sent directly to Google Sheets
- Just like Google Forms, but with a beautiful custom design
- Easy setup with provided Apps Script

## 🛠️ Tech Stack

- **React 18** - UI Library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS v4** - Utility-first styling
- **i18next** - Internationalization
- **Google Gemini API** - AI Chatbot
- **Google Apps Script** - Google Sheets integration

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

1. **Create a Google Sheet**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet

2. **Add Apps Script**
   - Go to Extensions → Apps Script
   - Delete any existing code
   - Copy the contents of `google-apps-script.js` and paste it
   - Save the project

3. **Deploy as Web App**
   - Click "Deploy" → "New deployment"
   - Select type: "Web app"
   - Set "Execute as": "Me"
   - Set "Who has access": "Anyone"
   - Click "Deploy" and authorize

4. **Connect to Your App**
   - Copy the Web App URL
   - Open `src/components/RegistrationForm/RegistrationFormNew.jsx`
   - Replace `YOUR_GOOGLE_APPS_SCRIPT_URL` with your URL

## 🤖 Setting Up Gemini Chatbot

1. Get your API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Enter the API key in the chatbot interface
3. The chatbot is pre-configured with Winter Camp context

## 🎨 Design Theme

- **Background**: Mountainous winter landscapes with northern lights and starry skies
- **Color Palette**: 
  - Midnight Blue (#0a1628)
  - Frosty White (#e8f4fc)
  - Aurora Blue (#4facfe)
  - Aurora Cyan (#00f2fe)
  - Aurora Green (#43e97b)
  - Evergreen (#1a5f4a)
  - Camp Red (#dc2626)
- **Typography**: Bebas Neue, Orbitron (adventure-style), Inter (body text)
- **Animations**: Northern lights, floating elements, snowfall, twinkling stars

## 📁 Project Structure

```
winter-camp-registration/
├── src/
│   ├── components/
│   │   ├── Background/        # Northern lights & mountain background
│   │   ├── Chatbot/          # Gemini AI chatbot
│   │   ├── EventDetails/     # Event information section
│   │   ├── LanguageSelector/ # Multi-language switcher
│   │   └── RegistrationForm/ # Complete registration form
│   ├── i18n/                 # Translations (EN, ID, RU)
│   ├── App.jsx
│   ├── App.css
│   ├── index.css            # Tailwind & global styles
│   └── main.jsx
├── google-apps-script.js    # Google Sheets integration
├── .github/workflows/       # GitHub Actions for deployment
└── vite.config.js
```

## 🌍 Deployment

### GitHub Pages (Automatic)

1. Push to `main` branch
2. Go to Settings → Pages
3. Select "GitHub Actions" as source
4. Site deploys automatically

### Manual Build

```bash
npm run build
npm run preview
```

## 🎯 Form Validation

- All required fields have validation
- Email format validation
- Phone number format validation
- Age range validation (1-120)
- Dynamic "Other" input fields
- Terms & conditions must be accepted
- Real-time error messages

## 📄 License

MIT License - Feel free to use for your own events!

## 🙏 Acknowledgments

- Built with ❤️ for Winter Camp 2025
- Icons: Emoji-based for universal compatibility
- Fonts: Google Fonts (Bebas Neue, Orbitron, Inter)
- AI: Powered by Google Gemini

---

⛷️ **Ready for the adventure of a lifetime!** 🏂❄️🏔️
