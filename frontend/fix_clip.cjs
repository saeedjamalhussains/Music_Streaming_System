const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/pages/main/MainContent.jsx',
  'src/pages/landing/HeroGeometric.jsx',
  'src/pages/auth/signup.jsx',
  'src/pages/auth/login.jsx',
  'src/pages/admin/AdminPanel.jsx',
  'src/components/layout/Sidebar.jsx',
  'src/components/features/AddToPlaylistModal.jsx',
  'src/components/features/PlaylistManager.jsx',
  'src/components/features/PlaylistView.jsx'
];

for (const file of filesToFix) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    // Replace if it doesn't already have pb-2 or pb-6 etc. nearby
    // Just a simple replace for specific strings:
    content = content.replace(/bg-clip-text text-transparent(?!.*pb-.*")/g, 'bg-clip-text text-transparent pb-2');
    fs.writeFileSync(fullPath, content);
  }
}
console.log('Fixed clipping classes.');
