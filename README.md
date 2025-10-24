# 🚀 My Custom New Tab

<div align="center">

![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-v1.0.0-blue?style=for-the-badge&logo=google-chrome&logoColor=white)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.14-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**A beautiful, feature-rich custom new tab page for Chrome built with React**

[![Installation Guide](https://img.shields.io/badge/📖-Installation%20Guide-green?style=for-the-badge)](#-installation)
[![Features](https://img.shields.io/badge/✨-Features-purple?style=for-the-badge)](#-features)
[![Screenshots](https://img.shields.io/badge/📸-Screenshots-orange?style=for-the-badge)](#-screenshots)

</div>

---

## ✨ Features

### 🕐 **Animated Clock**
- Beautiful flip-clock animation
- Real-time updates
- Modern design with smooth transitions

### 🔍 **Multi-Engine Search**
- **Google** - Default search engine
- **DuckDuckGo** - Privacy-focused search
- **Bing** - Microsoft's search engine
- **Brave Search** - Independent search
- **YouTube** - Video search
- **Reddit** - Community search
- **Wikipedia** - Knowledge search

### 📚 **Smart Bookmarks**
- Automatic bookmark synchronization
- Quick access to your saved sites
- Clean, organized display
- Chrome API integration

### 📝 **Todo List**
- Persistent task management
- Cross-tab synchronization
- Add, complete, and delete tasks
- Local storage integration

### 🎯 **Google Apps Hub**
- Quick access to Google services
- **Gmail, YouTube, Drive, Maps, Calendar**
- **Photos, Translate, Meet, Chat**
- **Play Store, Music, and more**

### 🤖 **AI Tools Integration**
- Quick access to AI-powered tools
- Modern interface design
- Seamless integration

### 🎨 **Modern UI/UX**
- Dark theme with elegant design
- Responsive layout
- Smooth animations
- Professional typography

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | Frontend framework |
| **Vite** | 7.1.7 | Build tool & dev server |
| **Tailwind CSS** | 4.1.14 | Styling framework |
| **Lucide React** | 0.545.0 | Icon library |
| **React Flip Clock** | 1.7.2 | Clock animations |
| **Chrome APIs** | Latest | Extension functionality |

---

## 📦 Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Google Chrome** browser

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd extention
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

### Chrome Extension Installation

1. **Open Chrome Extensions**
   - Navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right)

2. **Load the extension**
   - Click **"Load unpacked"**
   - Select the `dist/` folder from your project

3. **Set as default new tab**
   - The extension will automatically override your new tab page
   - Enjoy your custom new tab experience!

---

## 🎯 Usage

### Search Functionality
- **Type** your query in the search bar
- **Select** your preferred search engine from the dropdown
- **Press Enter** or click the search button

### Managing Bookmarks
- Click the **Bookmarks** button (top-right)
- View your Chrome bookmarks
- Click any bookmark to visit the site

### Todo Management
- Click the **Todo** button to open the task panel
- **Add** new tasks by typing and pressing Enter
- **Mark complete** by clicking the checkbox
- **Delete** tasks with the trash icon

### Google Apps Access
- Click the **grid icon** (top-right)
- Browse available Google services
- Click any app to open it in a new tab

---

## 🎨 Customization

### Adding New Search Engines
Edit `src/components/searchEngines.js`:

```javascript
{
  id: "your-engine",
  name: "Your Engine",
  url: "https://your-engine.com/search?q=",
  icon: "your-svg-path"
}
```

### Styling Modifications
- **Colors**: Edit `tailwind.config.js`
- **Components**: Modify files in `src/components/`
- **Global styles**: Update `src/index.css`

### Adding New Features
1. Create component in `src/components/`
2. Import and use in `src/App.jsx`
3. Add any required Chrome permissions to `manifest.json`

---

## 📁 Project Structure

```
extention/
├── 📁 dist/                    # Built extension files
│   ├── 📄 manifest.json        # Extension configuration
│   ├── 📄 index.html           # Main HTML file
│   └── 📁 assets/              # Compiled CSS/JS
├── 📁 src/                     # Source code
│   ├── 📁 components/          # React components
│   │   ├── 🕐 Clock.jsx        # Animated clock
│   │   ├── 🔍 SearchEngine.jsx # Search functionality
│   │   ├── 📚 Bookmarks.jsx    # Bookmark manager
│   │   ├── 📝 TodoList.jsx      # Task management
│   │   ├── 🎯 GoogleApps.jsx   # Google services
│   │   └── 🤖 AiTools.jsx      # AI tools
│   ├── 📄 App.jsx              # Main application
│   └── 📄 main.jsx             # Entry point
├── 📄 manifest.json            # Extension manifest
├── 📄 package.json             # Dependencies
└── 📄 vite.config.js           # Build configuration
```

---

## 🔧 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Building for Production

```bash
# Build the extension
npm run build

# The dist/ folder will contain your extension
# Load this folder in Chrome as an unpacked extension
```

---

## 🚀 Deployment

### Chrome Web Store (Future)
1. **Prepare your extension**
   - Ensure all features work correctly
   - Test in different Chrome versions
   - Create store assets (icons, screenshots)

2. **Package for store**
   - Zip the `dist/` folder contents
   - Follow Chrome Web Store guidelines

### Manual Distribution
- Share the `dist/` folder
- Users can load it as an unpacked extension
- Perfect for testing and small-scale distribution

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Javaad** - [Portfolio](https://javaadde.github.io/portfolio)

---

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Vite Team** - For the lightning-fast build tool
- **Tailwind CSS** - For the utility-first CSS framework
- **Chrome Extensions Team** - For the powerful APIs

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

**Made with ❤️ and lots of ☕**

[![GitHub stars](https://img.shields.io/github/stars/your-username/your-repo?style=social)](https://github.com/your-username/your-repo)
[![GitHub forks](https://img.shields.io/github/forks/your-username/your-repo?style=social)](https://github.com/your-username/your-repo)

</div>