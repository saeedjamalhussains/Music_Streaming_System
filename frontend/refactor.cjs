const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const fileMap = {
  'App1.jsx': 'App.jsx',
  'AppLayout.jsx': 'layout/AppLayout.jsx',
  'index.css': 'assets/styles/index.css',
  'main.jsx': 'main.jsx',
  'tuneup.png': 'assets/images/tuneup.png',
  'blocks/Components/ElasticSlider/ElasticSlider.jsx': 'components/common/ElasticSlider.jsx',
  'blocks/Components/TiltedCard/TiltedCard.jsx': 'components/common/TiltedCard.jsx',
  'components/Logo.jsx': 'components/common/Logo.jsx',
  'components/authentication/AuthContext.jsx': 'context/AuthContext.jsx',
  'components/authentication/Login.css': 'pages/auth/Login.css',
  'components/authentication/login.jsx': 'pages/auth/login.jsx',
  'components/authentication/ProtectedRoute.jsx': 'pages/auth/ProtectedRoute.jsx',
  'components/authentication/Signup.css': 'pages/auth/Signup.css',
  'components/authentication/signup.jsx': 'pages/auth/signup.jsx',
  'components/lib/utils.js': 'utils/utils.js',
  'hooks/useAudioPlayer.js': 'hooks/useAudioPlayer.js',
  'hooks/useSidebar.js': 'hooks/useSidebar.js',
  'Landercomponents/HarmonyLandingPage.jsx': 'pages/landing/HarmonyLandingPage.jsx',
  'Landercomponents/HeroGeometric.css': 'assets/styles/HeroGeometric.css',
  'Landercomponents/HeroGeometric.jsx': 'pages/landing/HeroGeometric.jsx',
  'Landercomponents/Testimonial.jsx': 'components/common/Testimonial.jsx',
  'Landercomponents/header/buttonStyles.js': 'components/layout/Navbar/buttonStyles.js',
  'Landercomponents/header/StickyHeader.jsx': 'components/layout/Navbar/StickyHeader.jsx',
  'Landercomponents/header/TransparentHeader.module.css': 'components/layout/Navbar/TransparentHeader.module.css',
  'services/api.js': 'services/api.js',
  'v0/AddToPlaylistModal.jsx': 'components/features/AddToPlaylistModal.jsx',
  'v0/AdminPanel.jsx': 'pages/admin/AdminPanel.jsx',
  'v0/bhAAi.css': 'assets/styles/bhAAi.css',
  'v0/Chatbot.jsx': 'components/features/Chatbot.jsx',
  'v0/MainContent.jsx': 'pages/main/MainContent.jsx',
  'v0/PlayerControls.jsx': 'components/layout/PlayerControls.jsx',
  'v0/PlaylistManager.jsx': 'components/features/PlaylistManager.jsx',
  'v0/PlaylistView.jsx': 'components/features/PlaylistView.jsx',
  'v0/Sidebar.jsx': 'components/layout/Sidebar.jsx',
};

// Aliases for regex replacements
const importReplacements = {
  './App1.jsx': '@/App.jsx',
  './AppLayout': '@/layout/AppLayout',
  '../AppLayout': '@/layout/AppLayout',
  './index.css': '@/assets/styles/index.css',
  '../../index.css': '@/assets/styles/index.css',
  './components/authentication/signup': '@/pages/auth/signup',
  './components/authentication/login': '@/pages/auth/login',
  './Landercomponents/HarmonyLandingPage': '@/pages/landing/HarmonyLandingPage',
  './Landercomponents/HeroGeometric': '@/pages/landing/HeroGeometric',
  './components/authentication/AuthContext': '@/context/AuthContext',
  './components/authentication/ProtectedRoute': '@/pages/auth/ProtectedRoute',
  './v0/AdminPanel': '@/pages/admin/AdminPanel',
  './v0/Sidebar': '@/components/layout/Sidebar',
  './v0/MainContent': '@/pages/main/MainContent',
  './v0/PlayerControls': '@/components/layout/PlayerControls',
  './v0/AddToPlaylistModal': '@/components/features/AddToPlaylistModal',
  './hooks/useAudioPlayer': '@/hooks/useAudioPlayer',
  './hooks/useSidebar': '@/hooks/useSidebar',
  '../components/Logo': '@/components/common/Logo',
  '../../components/Logo': '@/components/common/Logo',
  './TransparentHeader.module.css': '@/components/layout/Navbar/TransparentHeader.module.css',
  './buttonStyles': '@/components/layout/Navbar/buttonStyles',
  '../services/api': '@/services/api',
  '../../services/api': '@/services/api',
  '../v0/bhAAi.css': '@/assets/styles/bhAAi.css',
  './bhAAi.css': '@/assets/styles/bhAAi.css',
  '../Landercomponents/HeroGeometric.css': '@/assets/styles/HeroGeometric.css',
  './HeroGeometric.css': '@/assets/styles/HeroGeometric.css',
  '../Landercomponents/Testimonial': '@/components/common/Testimonial',
  './Login.css': '@/pages/auth/Login.css',
  './Signup.css': '@/pages/auth/Signup.css',
  './tuneup.png': '@/assets/images/tuneup.png',
  '../tuneup.png': '@/assets/images/tuneup.png',
  '../../tuneup.png': '@/assets/images/tuneup.png',
  './PlaylistView': '@/components/features/PlaylistView',
  './Chatbot': '@/components/features/Chatbot',
  './PlaylistManager': '@/components/features/PlaylistManager',
  '../hooks/useSidebar': '@/hooks/useSidebar',
  '../hooks/useAudioPlayer': '@/hooks/useAudioPlayer',
  // TiltedCard and ElasticSlider
  '../../blocks/Components/ElasticSlider/ElasticSlider': '@/components/common/ElasticSlider',
  '../../blocks/Components/TiltedCard/TiltedCard': '@/components/common/TiltedCard',
};

// Create dirs
const dirs = new Set();
for (const newPath of Object.values(fileMap)) {
  const dir = path.dirname(path.join(srcDir, newPath));
  dirs.add(dir);
}
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Read, replace, write
for (const [oldPath, newPath] of Object.entries(fileMap)) {
  const oldFull = path.join(srcDir, oldPath);
  const newFull = path.join(srcDir, newPath);
  
  if (!fs.existsSync(oldFull)) {
    console.log(`Skipping missing file: ${oldFull}`);
    continue;
  }
  
  let content = fs.readFileSync(oldFull, 'utf8');
  
  // Replace imports (dumb string replacement for typical patterns)
  for (const [oldImp, newImp] of Object.entries(importReplacements)) {
    // Escape dots for regex
    const oldRegex = oldImp.replace(/\./g, '\\.');
    // Match quotes
    const regex = new RegExp(`(['"])${oldRegex}(['"])`, 'g');
    content = content.replace(regex, `$1${newImp}$2`);
  }
  
  fs.writeFileSync(newFull, content);
}

// Clean up old directories (we'll do this carefully or just let them be and delete later)
console.log('Refactoring complete.');
