# AI or Real? 🤖📷

A daily browser game where you guess if images are AI-generated or real photos. Inspired by Wordle, Timeguessr, and other engaging daily challenge games.

## 🎮 Game Features

- **Daily Challenge**: 5 new images every day
- **Clean Interface**: Minimal, snappy design with smooth animations
- **Instant Feedback**: Know immediately if you're right or wrong
- **Stats Tracking**: Monitor your accuracy, streak, and game history
- **Share Results**: Share your daily score with friends
- **Streak System**: Build up your consecutive days played
- **Local Storage**: All stats saved in your browser

## 🎯 How to Play

1. Open the game in your browser
2. Click "Play Today's Challenge"
3. View each image and decide: AI-generated or Real photo?
4. Click your choice and get instant feedback
5. Complete all 5 images to see your score
6. Share your results and come back tomorrow!

## 🚀 Getting Started

### Simple Setup (No Server Required)

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. Start playing!

```bash
# Clone the repository
git clone https://github.com/AbdullahSiddiqiGit/LockIn.git
cd LockIn

# Open in your default browser (or just double-click index.html)
open index.html  # macOS
start index.html  # Windows
xdg-open index.html  # Linux
```

### Optional: Local Server

For the best experience (especially when testing), you can use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Then open http://localhost:8000
```

## 📁 Project Structure

```
LockIn/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── game.js            # Game logic, state management, and daily challenges
└── README.md          # Project documentation
```

## 🎨 Design Philosophy

### Inspired by the Best

- **Wordle**: One daily challenge, everyone plays the same puzzle, shareable results
- **Timeguessr**: Image-based guessing with visual analysis
- **Minimalist Games**: Clean UI, fast loading, focused gameplay

### Key Design Principles

- **Minimal UI**: Only essential elements, reducing cognitive load
- **Instant Feedback**: Immediate visual response to choices
- **Smooth Animations**: CSS-based transitions for snappy performance
- **Mobile-First**: Responsive design that works on all devices
- **No Account Required**: Play immediately, stats saved locally
- **Daily Cadence**: One challenge per day encourages habit formation

## 🔧 Customization

### Adding Your Own Images

Edit the `imageDatabase` array in `game.js`:

```javascript
const imageDatabase = [
    // Day 1 challenge
    [
        { url: 'path/to/image1.jpg', type: 'real', hint: 'Notice the lighting' },
        { url: 'path/to/image2.jpg', type: 'ai', hint: 'Check the details' },
        // ... 3 more images for 5 total
    ],
    // Add more days...
];
```

### Changing the Number of Images

To change from 5 images per day:

1. Update the total in HTML: search for `/5` and `5 images`
2. Update JavaScript: change the hardcoded `5` in calculations
3. Update progress bar logic in `updateProgress()`

### Styling

All styles are in `styles.css` with CSS custom properties for easy theming:

```css
:root {
    --color-primary: #6366f1;  /* Change primary color */
    --color-correct: #10b981;  /* Correct answer color */
    --color-incorrect: #ef4444; /* Incorrect answer color */
}
```

## 🌐 Deployment

### GitHub Pages

1. Push your code to GitHub
2. Go to Settings > Pages
3. Select your branch and `/root` folder
4. Your game will be live at `https://yourusername.github.io/LockIn/`

### Other Hosting Options

- **Netlify**: Drag and drop your folder
- **Vercel**: Connect your GitHub repo
- **Cloudflare Pages**: Connect and deploy
- **Any static host**: Upload the files

## 🎮 Game Mechanics

### Daily Challenge System

- Challenges rotate based on date (deterministic)
- Everyone gets the same challenge each day
- Resets at midnight local time
- Can only play once per day

### Scoring & Stats

- **Score**: Number of correct guesses out of 5
- **Accuracy**: Lifetime percentage of correct answers
- **Current Streak**: Consecutive days played
- **Best Streak**: Longest consecutive day streak
- **History**: Last 10 games with scores

### Share Format

```
AI or Real? 2025-12-27
4/5 (80%)

✅✅❌✅✅

Play at: [your-url]
```

## 🤖 Tips for Players

Look for these clues to spot AI-generated images:

- **Hands**: AI often struggles with fingers and hand anatomy
- **Text**: Gibberish or malformed letters in signs/books
- **Symmetry**: Unnatural or impossible symmetry
- **Textures**: Too smooth or pattern repetition
- **Lighting**: Inconsistent shadows or light sources
- **Eyes**: Unnatural reflections or misaligned pupils
- **Background**: Morphing or blending objects

## 📝 Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔮 Future Enhancements

Potential features to add:

- [ ] Backend API for centralized daily challenges
- [ ] Real AI-generated image database
- [ ] Difficulty levels (Easy, Medium, Hard)
- [ ] Timed mode for extra challenge
- [ ] Leaderboards and global stats
- [ ] Image hints system
- [ ] Multiple game modes
- [ ] Achievement system
- [ ] Dark mode toggle
- [ ] Accessibility improvements

## 📄 License

MIT License - feel free to use and modify for your own projects!

## 🤝 Contributing

Contributions welcome! Feel free to:

- Add more daily challenges
- Improve the image detection algorithms
- Enhance UI/UX
- Fix bugs
- Add new features

## 🙏 Credits

- Inspired by [Wordle](https://www.nytimes.com/games/wordle/index.html)
- Design patterns from [Timeguessr](https://timeguessr.com)
- Images from [Unsplash](https://unsplash.com) and placeholder services

---

**Have fun and test your AI detection skills!** 🚀
