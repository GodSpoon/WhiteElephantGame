# 🎁 White Elephant Challenge Wheel

A fun and interactive White Elephant gift exchange game with a challenge wheel! Perfect for holiday parties, office gatherings, or any group event.

## 🎮 Live Demo

**[Play the Game Here!](https://YOUR-USERNAME.github.io/WhiteElephantGame/)**

## ✨ Features

- **Interactive Spin Wheel** with customizable challenges
- **Gift Stealing Mechanics** - steal gifts but you must perform the same challenge!
- **Challenge Validation** - if you fail a stolen challenge, the gift returns to the original owner
- **Multiple Gifts Per Player** - juggle multiple challenges at once!
- **Sound Effects** - customizable audio feedback
- **Responsive Design** - works on desktop and mobile
- **Real-time Game State** - see who has what gifts and their challenge status

## 🎯 How to Play

1. **Setup**: Add all players to the game
2. **Choose Action**: On your turn, choose to SPIN for a new gift OR STEAL a messed-up gift
3. **Spin & Claim**: Spin the wheel to get a challenge, then claim a new gift
4. **Maintain Challenges**: Keep performing your challenges for the entire game!
5. **Mess Up**: If someone breaks their challenge, mark that gift as "Messed Up"
6. **Stealing**: Anyone can steal a messed-up gift, but must perform the same challenge
7. **Validation**: If the stealing player fails the challenge, the gift returns to the original owner
8. **Win**: Keep your gifts and maintain your challenges to win!

## 🚀 Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/WhiteElephantGame.git
cd WhiteElephantGame

# Serve locally (Python 3)
python -m http.server 8000

# Or use any other local server
# Visit http://localhost:8000
```

### Project Structure

```
WhiteElephantGame/
├── index.html                 # Main HTML file
├── white-elephant-wheel.jsx   # React component with game logic
├── package.json              # Project metadata
├── .github/workflows/        # GitHub Actions for deployment
└── README.md                # This file
```

### Built With

- **React 18** - UI framework
- **Lucide React** - Icons
- **HTML5 Canvas** - Spinning wheel graphics
- **Web Audio API** - Sound effects
- **CSS3** - Styling and animations

## 🎨 Customization

### Adding New Challenges

1. Edit the `challenges` array in `white-elephant-wheel.jsx`
2. Each challenge needs: `text`, `color`, `font`, and `sound`
3. Or use the in-game settings panel to add challenges dynamically

### Modifying Sounds

The game uses Web Audio API to generate sounds. You can modify the `sounds` object in the `playSound` function to customize audio effects.

## 📱 Mobile Support

The game is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones
- Touch devices

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Inspired by the classic White Elephant gift exchange tradition
- Built for bringing fun and laughter to group gatherings
- Perfect for holiday parties, office events, and family gatherings!

---

**Enjoy the game! 🎁**