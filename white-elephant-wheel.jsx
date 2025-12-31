import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Gift, Users, Settings, Volume2, VolumeX, ArrowRight, ChevronDown, ChevronUp, X } from 'lucide-react';

const WhiteElephantWheel = () => {
  const soundOptions = [
    { value: 'cheer', label: '🎉 Cheering' },
    { value: 'womp', label: '😢 Womp Womp' },
    { value: 'drumroll', label: '🥁 Drumroll' },
    { value: 'airhorn', label: '📣 Airhorn' },
    { value: 'kazoo', label: '🎺 Kazoo' },
    { value: 'sad-trombone', label: '🎺 Sad Trombone' },
    { value: 'suspense', label: '😱 Suspense' },
    { value: 'laugh', label: '😂 Laugh Track' },
    { value: 'gasp', label: '😲 Dramatic Gasp' },
    { value: 'applause', label: '👏 Applause' },
    { value: 'boing', label: '🎪 Boing' },
    { value: 'none', label: '🔇 No Sound' }
  ];

  const [challenges, setChallenges] = useState([
    { text: "you have to speak in three word sentences or else someone can steal it", color: "#FF6B6B", font: "Comic Sans MS", sound: "womp" },
    { text: "You have to speak in puns only", color: "#4ECDC4", font: "Comic Sans MS", sound: "kazoo" },
    { text: "you have to quack between every word", color: "#FFE66D", font: "Comic Sans MS", sound: "laugh" },
    { text: "you have to give a presentation on why this gift is innocent and should go home with you and not prison", color: "#95E1D3", font: "Comic Sans MS", sound: "suspense" },
    { text: "You have to talk in the third person like Elmo", color: "#F38181", font: "Comic Sans MS", sound: "cheer" },
    { text: "You tell aleks a fact he didn't know", color: "#AA96DA", font: "Comic Sans MS", sound: "drumroll" },
    { text: "You must talk while being completely invisible and also on the moon", color: "#FCBAD3", font: "Comic Sans MS", sound: "gasp" },
    { text: "You must whisper everything", color: "#A8D8EA", font: "Comic Sans MS", sound: "none" },
    { text: "You must shout everything", color: "#FF8B94", font: "Comic Sans MS", sound: "airhorn" },
    { text: "You must only rhyme", color: "#FFC75F", font: "Comic Sans MS", sound: "applause" },
    { text: "Everything is slo-mo for 5m", color: "#C9ADA7", font: "Comic Sans MS", sound: "womp" },
    { text: "Your name is now Petra and everyone else is also named Petra except Petra", color: "#9D84B7", font: "Comic Sans MS", sound: "laugh" },
    { text: "You must dance while talking", color: "#FFD93D", font: "Comic Sans MS", sound: "cheer" },
    { text: "You can only talk to Liz and with the voice of Gir from invader Zim", color: "#6BCB77", font: "Comic Sans MS", sound: "kazoo" },
    { text: "You may only answer in questions", color: "#4D96FF", font: "Comic Sans MS", sound: "suspense" },
    { text: "You must compliment everyone first", color: "#FDA7DF", font: "Comic Sans MS", sound: "cheer" },
    { text: "You must pretend the gift is a pet fish", color: "#6FEDD6", font: "Comic Sans MS", sound: "boing" },
    { text: "You must translate everything into 'meow.'", color: "#FFB6B9", font: "Comic Sans MS", sound: "laugh" },
    { text: "You must give the gift a theme song", color: "#BAE1FF", font: "Comic Sans MS", sound: "drumroll" },
    { text: "You must talk like a pirate", color: "#F67280", font: "Comic Sans MS", sound: "airhorn" },
    { text: "You have to be Kate", color: "#C06C84", font: "Comic Sans MS", sound: "gasp" },
    { text: "You must tell the gift's tragic origin story", color: "#355C7D", font: "Comic Sans MS", sound: "sad-trombone" },
    { text: "You must make a sales pitch for the gift like you're an auctioneer", color: "#F8B195", font: "Comic Sans MS", sound: "drumroll" },
    { text: "You must act like the floor is lava", color: "#F67280", font: "Comic Sans MS", sound: "gasp" },
    { text: "You must hold your nose while talking", color: "#99B898", font: "Comic Sans MS", sound: "kazoo" },
    { text: "You have to completely encase Sam and yourself in toilet paper and refer to yourselves as 'the mummies'", color: "#E8A87C", font: "Comic Sans MS", sound: "laugh" }
  ]);

  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  
  // NEW: State for turn action choice
  const [showTurnChoice, setShowTurnChoice] = useState(false);
  const [turnAction, setTurnAction] = useState(null); // 'spin' or 'steal'
  
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [pendingGiftNumber, setPendingGiftNumber] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [newChallenge, setNewChallenge] = useState({ text: '', color: '#FF6B6B', font: 'Comic Sans MS', sound: 'cheer' });
  
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    drawWheel();
  }, [challenges, rotation, players]);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
  }, []);

  const playSound = (soundType) => {
    if (!soundEnabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    const sounds = {
      'cheer': { freq: [523, 659, 784], duration: 0.3, wave: 'sine' },
      'womp': { freq: [200, 150], duration: 0.4, wave: 'sawtooth' },
      'drumroll': { freq: [100], duration: 0.1, wave: 'square', repeat: 8 },
      'airhorn': { freq: [800], duration: 0.5, wave: 'sawtooth' },
      'kazoo': { freq: [300, 400, 300], duration: 0.2, wave: 'sawtooth' },
      'sad-trombone': { freq: [220, 196, 174, 156], duration: 0.3, wave: 'sawtooth' },
      'suspense': { freq: [100, 150, 100, 150], duration: 0.2, wave: 'triangle' },
      'laugh': { freq: [400, 500, 400, 500, 400], duration: 0.15, wave: 'sine' },
      'gasp': { freq: [800, 400], duration: 0.2, wave: 'sine' },
      'applause': { freq: [200], duration: 0.05, wave: 'square', repeat: 15 },
      'boing': { freq: [600, 300], duration: 0.3, wave: 'sine' },
      'spin': { freq: [400, 500, 600, 700], duration: 0.1, wave: 'triangle' },
      'success': { freq: [523, 659, 784, 1047], duration: 0.2, wave: 'sine' },
      'fail': { freq: [300, 250, 200], duration: 0.3, wave: 'sawtooth' },
      'steal': { freq: [400, 450, 500], duration: 0.2, wave: 'square' }
    };

    const sound = sounds[soundType] || sounds.cheer;
    
    if (sound.repeat) {
      let time = ctx.currentTime;
      for (let i = 0; i < sound.repeat; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = sound.wave;
        osc.frequency.setValueAtTime(sound.freq[0], time);
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + sound.duration);
        osc.start(time);
        osc.stop(time + sound.duration);
        time += sound.duration;
      }
    } else {
      oscillator.type = sound.wave;
      let time = ctx.currentTime;
      
      sound.freq.forEach((freq, i) => {
        oscillator.frequency.setValueAtTime(freq, time + i * sound.duration);
      });
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + sound.duration * sound.freq.length);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + sound.duration * sound.freq.length);
    }
  };

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (availableChallenges.length === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#f0f0f0';
      ctx.fill();
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      ctx.fillStyle = '#999';
      ctx.font = 'bold 24px Comic Sans MS';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('All challenges in use!', centerX, centerY);
      
      return;
    }
    
    const sliceAngle = (2 * Math.PI) / availableChallenges.length;
    
    availableChallenges.forEach((challenge, index) => {
      const startAngle = rotation + index * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = challenge.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      ctx.save();
      const textAngle = startAngle + sliceAngle / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate(textAngle);
      
      ctx.fillStyle = '#000';
      ctx.font = `bold 14px ${challenge.font}`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      
      const maxWidth = radius - 50;
      const words = challenge.text.split(' ');
      const lines = [];
      let currentLine = '';
      
      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth) {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = words[i];
          } else {
            let truncated = words[i];
            while (ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 0) {
              truncated = truncated.slice(0, -1);
            }
            lines.push(truncated + '...');
            currentLine = '';
          }
        } else {
          currentLine = testLine;
        }
        
        if (lines.length >= 2 && currentLine) {
          let finalLine = currentLine;
          while (ctx.measureText(finalLine + '...').width > maxWidth && finalLine.length > 0) {
            finalLine = finalLine.slice(0, -1);
          }
          lines.push(finalLine + '...');
          break;
        }
      }
      
      if (lines.length < 3 && currentLine && !currentLine.endsWith('...')) {
        lines.push(currentLine);
      }
      
      const lineHeight = 16;
      const startY = -(lines.length - 1) * lineHeight / 2;
      
      lines.forEach((line, i) => {
        ctx.fillText(line, radius - 30, startY + i * lineHeight);
      });
      
      ctx.restore();
    });
    
    // Center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 5;
    ctx.stroke();
    
    ctx.fillStyle = '#333';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', centerX, centerY);
    
    // Pointer
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 10, centerY);
    ctx.lineTo(centerX + radius - 30, centerY - 25);
    ctx.lineTo(centerX + radius - 30, centerY + 25);
    ctx.closePath();
    ctx.fillStyle = '#FF1744';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  // NEW: Start turn - show choice modal
  const startTurn = () => {
    if (players.length === 0) return;
    
    // If there are stealable gifts, show choice
    if (allMessedUpGifts.length > 0 && availableChallenges.length > 0) {
      setShowTurnChoice(true);
    } else if (allMessedUpGifts.length > 0 && availableChallenges.length === 0) {
      // Only stealing available
      setTurnAction('steal');
      showStealOptions();
    } else if (availableChallenges.length > 0) {
      // Only spinning available
      setTurnAction('spin');
      spinWheel();
    } else {
      alert('No available actions! All challenges are in use and no gifts to steal.');
    }
  };

  // NEW: Handle turn action choice
  const chooseTurnAction = (action) => {
    setTurnAction(action);
    setShowTurnChoice(false);
    
    if (action === 'spin') {
      spinWheel();
    } else {
      showStealOptions();
    }
  };

  // NEW: Show steal-only modal
  const showStealOptions = () => {
    setSelectedChallenge(null);
    setShowGiftModal(true);
  };

  const spinWheel = () => {
    if (spinning || availableChallenges.length === 0) return;
    
    setSpinning(true);
    playSound('spin');
    
    const spins = 5 + Math.random() * 5;
    const extraDegrees = Math.random() * 360;
    const totalRotation = spins * 360 + extraDegrees;
    
    const startRotation = rotation;
    const endRotation = startRotation + (totalRotation * Math.PI / 180);
    const duration = 3500;
    const startTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + (endRotation - startRotation) * easeOut;
      
      setRotation(currentRotation);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        determineWinner(currentRotation);
      }
    };
    
    animate();
  };

  const determineWinner = (finalRotation) => {
    if (availableChallenges.length === 0) return;
    
    const normalizedRotation = (finalRotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const sliceAngle = (2 * Math.PI) / availableChallenges.length;
    const pointerAngle = 0;
    const selectedIndex = Math.floor(((2 * Math.PI - normalizedRotation + pointerAngle) % (2 * Math.PI)) / sliceAngle) % availableChallenges.length;
    
    const challenge = availableChallenges[selectedIndex];
    setSelectedChallenge(challenge);
    playSound(challenge.sound);
    createConfetti();
    setShowGiftModal(true);
  };

  const createConfetti = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'];
    const confettiCount = 60;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.top = '-10px';
      confetti.style.opacity = '1';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '9999';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      
      document.body.appendChild(confetti);
      
      const duration = 2000 + Math.random() * 1000;
      const angle = Math.random() * Math.PI * 2;
      const velocity = 2 + Math.random() * 3;
      
      confetti.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${Math.cos(angle) * velocity * 100}px, ${window.innerHeight + 20}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }).onfinish = () => confetti.remove();
    }
  };

  const addGiftToCurrentPlayer = () => {
    if (!selectedChallenge || !pendingGiftNumber.trim()) return;
    
    if (isGiftNumberTaken(pendingGiftNumber)) {
      alert(`Gift #${pendingGiftNumber.trim()} has already been claimed! Please choose a different gift number.`);
      playSound('fail');
      return;
    }
    
    const updatedPlayers = [...players];
    const currentPlayer = updatedPlayers[currentTurnIndex];
    
    if (!currentPlayer.gifts) {
      currentPlayer.gifts = [];
    }
    
    currentPlayer.gifts.push({
      giftNumber: pendingGiftNumber.trim(),
      challenge: selectedChallenge.text,
      challengeColor: selectedChallenge.color,
      messedUp: false,
      originalOwnerIndex: currentTurnIndex // Track original owner
    });
    
    setPlayers(updatedPlayers);
    setShowGiftModal(false);
    setPendingGiftNumber('');
    setSelectedChallenge(null);
    setTurnAction(null);
    playSound('success');
    
    // Auto-advance turn after successful claim
    setTimeout(() => nextTurn(), 500);
  };

  const stealGift = (fromPlayerIndex, fromGiftIndex) => {
    const fromPlayer = players[fromPlayerIndex];
    
    if (!fromPlayer || !fromPlayer.gifts || !fromPlayer.gifts[fromGiftIndex]) {
      alert('This gift is no longer available!');
      setShowGiftModal(false);
      return;
    }
    
    const stolenGift = {
      ...fromPlayer.gifts[fromGiftIndex], 
      messedUp: false,
      previousOwnerIndex: fromPlayerIndex // Track who we stole from
    };
    
    const updatedPlayers = players.map((p, pIdx) => {
      if (pIdx === currentTurnIndex) {
        return {
          ...p,
          gifts: [...(p.gifts || []), stolenGift]
        };
      }
      if (pIdx === fromPlayerIndex) {
        return {
          ...p,
          gifts: p.gifts.filter((_, gIdx) => gIdx !== fromGiftIndex)
        };
      }
      return p;
    });
    
    setPlayers(updatedPlayers);
    setShowGiftModal(false);
    setPendingGiftNumber('');
    setSelectedChallenge(null);
    setTurnAction(null);
    playSound('steal');
    
    // Auto-advance turn after successful steal
    setTimeout(() => nextTurn(), 500);
  };

  const togglePlayerExpanded = (index) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].expanded = !updatedPlayers[index].expanded;
    setPlayers(updatedPlayers);
  };

  const markGiftMessedUp = (playerIndex, giftIndex) => {
    const player = players[playerIndex];
    const gift = player.gifts[giftIndex];
    
    if (!confirm(`Mark ${player.name}'s Gift #${gift.giftNumber} as messed up?\n\nThis will make it stealable by other players!`)) {
      return;
    }
    
    const updatedPlayers = players.map((p, pIdx) => {
      if (pIdx !== playerIndex) return p;
      return {
        ...p,
        gifts: p.gifts.map((g, gIdx) => {
          if (gIdx !== giftIndex) return g;
          return { ...g, messedUp: true };
        })
      };
    });
    
    setPlayers(updatedPlayers);
    playSound('fail');
    
    // Create a more visible notification
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.background = 'linear-gradient(135deg, #FF6B6B, #FF8E53)';
    notification.style.color = 'white';
    notification.style.padding = '30px 50px';
    notification.style.borderRadius = '20px';
    notification.style.fontSize = '24px';
    notification.style.fontWeight = '800';
    notification.style.zIndex = '10000';
    notification.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
    notification.style.textAlign = 'center';
    notification.innerHTML = `🏴‍☠️ ${player.name}'s Gift #${gift.giftNumber}<br/>is now STEALABLE!`;
    
    document.body.appendChild(notification);
    
    // Animate in
    notification.animate([
      { opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)' },
      { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
    ], {
      duration: 300,
      easing: 'ease-out'
    });
    
    // Remove after 2 seconds
    setTimeout(() => {
      notification.animate([
        { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        { opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)' }
      ], {
        duration: 300,
        easing: 'ease-in'
      }).onfinish = () => notification.remove();
    }, 2000);
  };

  const removeGift = (playerIndex, giftIndex) => {
    const player = players[playerIndex];
    const gift = player.gifts[giftIndex];
    
    if (!confirm(`Remove ${player.name}'s Gift #${gift.giftNumber}?\n\nThis will make the gift number available again.`)) {
      return;
    }
    
    const updatedPlayers = players.map((p, pIdx) => {
      if (pIdx !== playerIndex) return p;
      return {
        ...p,
        gifts: p.gifts.filter((_, gIdx) => gIdx !== giftIndex)
      };
    });
    
    setPlayers(updatedPlayers);
  };

  const nextTurn = () => {
    if (players.length === 0) return;
    setCurrentTurnIndex((currentTurnIndex + 1) % players.length);
    setSelectedChallenge(null);
    setPendingGiftNumber('');
    setTurnAction(null);
    setShowTurnChoice(false);
  };

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, { 
        name: newPlayerName.trim(), 
        gifts: [],
        expanded: true
      }]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (index) => {
    const player = players[index];
    
    if (player.gifts && player.gifts.length > 0) {
      if (!confirm(`${player.name} has ${player.gifts.length} gift(s). Are you sure you want to remove them?`)) {
        return;
      }
    }
    
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
    
    if (newPlayers.length === 0) {
      setCurrentTurnIndex(0);
    } else if (currentTurnIndex >= newPlayers.length) {
      setCurrentTurnIndex(newPlayers.length - 1);
    } else if (index < currentTurnIndex) {
      setCurrentTurnIndex(currentTurnIndex - 1);
    }
  };

  const addNewChallenge = () => {
    if (newChallenge.text.trim()) {
      setChallenges([...challenges, {...newChallenge}]);
      setNewChallenge({ text: '', color: '#FF6B6B', font: 'Comic Sans MS', sound: 'cheer' });
    }
  };

  const removeChallenge = (index) => {
    setChallenges(challenges.filter((_, i) => i !== index));
  };

  const usedChallengeTexts = players
    .flatMap(p => p.gifts || [])
    .map(g => g.challenge);

  const availableChallenges = challenges.filter(c => !usedChallengeTexts.includes(c.text));

  const currentPlayer = players[currentTurnIndex];

  const allMessedUpGifts = players.flatMap((player, pIndex) => 
    (player.gifts || [])
      .map((gift, gIndex) => ({...gift, playerIndex: pIndex, giftIndex: gIndex, playerName: player.name}))
      .filter(gift => gift.messedUp)
  );

  const takenGiftNumbers = players
    .flatMap(p => p.gifts || [])
    .map(g => g.giftNumber.toLowerCase().trim());

  const isGiftNumberTaken = (giftNum) => {
    return takenGiftNumbers.includes(giftNum.toLowerCase().trim());
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '20px 32px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1800px',
        margin: '0 auto 20px auto',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800
          }}>
            🎁 White Elephant Challenge Wheel
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              padding: '12px 16px',
              background: soundEnabled ? '#4ECDC4' : '#ddd',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              boxShadow: soundEnabled ? '0 4px 12px rgba(78,205,196,0.3)' : 'none'
            }}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button
            onClick={() => setShowRules(!showRules)}
            style={{
              padding: '12px 20px',
              background: '#FFE66D',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '15px',
              boxShadow: '0 4px 12px rgba(255,230,109,0.3)'
            }}
          >
            📜 Rules
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: '12px 20px',
              background: '#95E1D3',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '15px',
              boxShadow: '0 4px 12px rgba(149,225,211,0.3)'
            }}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Turn Choice Modal - NOW REACTIVE */}
      {showTurnChoice && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          padding: '20px',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px', textAlign: 'center' }}>
              {currentPlayer?.name}'s Turn!
            </h2>
            <p style={{ fontSize: '18px', marginBottom: '32px', color: '#666', textAlign: 'center' }}>
              Choose your action:
            </p>
            
            {/* Dynamic update notification */}
            {allMessedUpGifts.length > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '20px',
                fontWeight: 700,
                fontSize: '15px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(255,107,107,0.3)',
                animation: 'pulse 2s infinite'
              }}>
                🔥 {allMessedUpGifts.length} STEALABLE GIFT{allMessedUpGifts.length > 1 ? 'S' : ''} AVAILABLE NOW!
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button
                onClick={() => chooseTurnAction('spin')}
                disabled={availableChallenges.length === 0}
                style={{
                  padding: '24px',
                  background: availableChallenges.length === 0 ? '#ddd' : 'linear-gradient(135deg, #4ECDC4, #44A08D)',
                  color: availableChallenges.length === 0 ? '#999' : 'white',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: availableChallenges.length === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '20px',
                  fontWeight: 700,
                  boxShadow: availableChallenges.length === 0 ? 'none' : '0 6px 20px rgba(78,205,196,0.4)',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎰</div>
                <div>Spin for New Gift</div>
                <div style={{ fontSize: '14px', fontWeight: 400, marginTop: '8px', opacity: 0.9 }}>
                  Get a new challenge and claim a gift
                </div>
                {availableChallenges.length === 0 && (
                  <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '8px', color: '#FF6B6B' }}>
                    ❌ No challenges available
                  </div>
                )}
              </button>
              
              <button
                onClick={() => chooseTurnAction('steal')}
                disabled={allMessedUpGifts.length === 0}
                style={{
                  padding: '24px',
                  background: allMessedUpGifts.length === 0 ? '#ddd' : 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                  color: allMessedUpGifts.length === 0 ? '#999' : 'white',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: allMessedUpGifts.length === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '20px',
                  fontWeight: 700,
                  boxShadow: allMessedUpGifts.length === 0 ? 'none' : '0 6px 20px rgba(255,107,107,0.4)',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏴‍☠️</div>
                <div>Steal a Gift</div>
                <div style={{ fontSize: '14px', fontWeight: 400, marginTop: '8px', opacity: 0.9 }}>
                  Take a messed-up gift and its challenge
                </div>
                {allMessedUpGifts.length === 0 ? (
                  <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '8px', color: '#FF6B6B' }}>
                    ❌ No stealable gifts yet
                  </div>
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '8px' }}>
                    ✨ {allMessedUpGifts.length} gift{allMessedUpGifts.length > 1 ? 's' : ''} available
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {showRules && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          backdropFilter: 'blur(4px)'
        }} onClick={() => setShowRules(false)}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '700px',
            maxHeight: '85vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, fontWeight: 800, fontSize: '28px' }}>🎲 How to Play</h2>
            <div style={{ lineHeight: '1.8', fontSize: '16px' }}>
              <p><strong>1. Setup:</strong> Add all players.</p>
              <p><strong>2. Choose Action:</strong> On your turn, choose to either SPIN for a new gift OR STEAL a messed-up gift.</p>
              <p><strong>3a. If Spinning:</strong> Spin the wheel to get a challenge, then claim a new gift with that challenge.</p>
              <p><strong>3b. If Stealing:</strong> Select a messed-up gift from another player and take on their challenge (no spinning needed).</p>
              <p><strong>4. Multiple Gifts:</strong> Players can take multiple turns for more gifts! Each gift has its own challenge.</p>
              <p><strong>5. Maintain Challenges:</strong> ALL challenges must be maintained for the ENTIRE game!</p>
              <p><strong>6. Mess Up:</strong> If someone breaks a challenge, mark that specific gift as "Messed Up".</p>
              <p><strong>7. Stealing Rules:</strong> Anyone can steal a messed-up gift and must maintain the same challenge.</p>
              <p><strong>8. Win:</strong> Keep your gifts and challenges to win!</p>
              <p style={{ background: '#FFE66D', padding: '16px', borderRadius: '12px', marginTop: '20px', fontWeight: 600 }}>
                <strong>💡 Tip:</strong> You could end up juggling multiple challenges at once! 🤹
              </p>
            </div>
            <button
              onClick={() => setShowRules(false)}
              style={{
                marginTop: '24px',
                padding: '14px 40px',
                background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '16px',
                boxShadow: '0 4px 16px rgba(255,107,107,0.4)'
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          backdropFilter: 'blur(4px)'
        }} onClick={() => setShowSettings(false)}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'auto',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, fontWeight: 800, fontSize: '28px' }}>⚙️ Challenge Settings</h2>
            
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 700 }}>Add New Challenge</h3>
              <input
                type="text"
                value={newChallenge.text}
                onChange={(e) => setNewChallenge({...newChallenge, text: e.target.value})}
                placeholder="Enter challenge text..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid #ddd',
                  marginBottom: '12px',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700 }}>Color</label>
                  <input
                    type="color"
                    value={newChallenge.color}
                    onChange={(e) => setNewChallenge({...newChallenge, color: e.target.value})}
                    style={{ width: '100%', height: '42px', cursor: 'pointer', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700 }}>Font</label>
                  <select
                    value={newChallenge.font}
                    onChange={(e) => setNewChallenge({...newChallenge, font: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #ddd',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Comic Sans MS">Comic Sans MS</option>
                    <option value="Arial">Arial</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Impact">Impact</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700 }}>Sound</label>
                  <select
                    value={newChallenge.sound}
                    onChange={(e) => setNewChallenge({...newChallenge, sound: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #ddd',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  >
                    {soundOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={addNewChallenge}
                disabled={!newChallenge.text.trim()}
                style={{
                  padding: '12px 24px',
                  background: newChallenge.text.trim() ? 'linear-gradient(135deg, #4ECDC4, #44A08D)' : '#ddd',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: newChallenge.text.trim() ? 'pointer' : 'not-allowed',
                  fontWeight: 700,
                  fontSize: '15px',
                  boxShadow: newChallenge.text.trim() ? '0 4px 12px rgba(78,205,196,0.3)' : 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={18} />
                Add Challenge
              </button>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 700 }}>
                All Challenges ({challenges.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflow: 'auto' }}>
                {challenges.map((challenge, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '14px',
                      background: challenge.color + '22',
                      borderLeft: `4px solid ${challenge.color}`,
                      borderRadius: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 600, flex: '1 1 200px' }}>{challenge.text}</span>
                    <button
                      onClick={() => removeChallenge(index)}
                      style={{
                        background: 'rgba(255,107,107,0.2)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        color: '#FF6B6B'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              style={{
                marginTop: '24px',
                padding: '14px 40px',
                background: 'linear-gradient(135deg, #95E1D3, #64B5A6)',
                color: '#333',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '16px',
                boxShadow: '0 4px 16px rgba(149,225,211,0.4)'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Gift Selection Modal */}
      {showGiftModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          padding: '20px',
          backdropFilter: 'blur(8px)'
        }} onClick={() => {
          setShowGiftModal(false);
          setPendingGiftNumber('');
          setSelectedChallenge(null);
          setTurnAction(null);
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            animation: 'slideIn 0.3s ease-out'
          }} onClick={(e) => e.stopPropagation()}>
            {selectedChallenge && (
              <div style={{
                background: selectedChallenge.color,
                padding: '24px',
                borderRadius: '16px',
                marginBottom: '24px',
                border: '3px solid rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ margin: '0 0 12px 0', fontSize: '24px', fontWeight: 800 }}>
                  🎯 YOUR CHALLENGE:
                </h2>
                <p style={{ fontSize: '18px', fontWeight: 700, margin: 0, lineHeight: '1.4' }}>
                  {selectedChallenge.text}
                </p>
              </div>
            )}

            {turnAction === 'spin' && (
              <>
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Claim Your Gift!</h3>
                
                {takenGiftNumbers.length > 0 && (
                  <div style={{
                    background: '#FFF3CD',
                    border: '2px solid #FFC107',
                    borderRadius: '12px',
                    padding: '12px',
                    marginBottom: '16px',
                    fontSize: '14px'
                  }}>
                    <strong>Already Taken:</strong> {takenGiftNumbers.sort((a, b) => {
                      const numA = parseInt(a) || 0;
                      const numB = parseInt(b) || 0;
                      return numA - numB;
                    }).join(', ')}
                  </div>
                )}
                
                <input
                  type="text"
                  value={pendingGiftNumber}
                  onChange={(e) => setPendingGiftNumber(e.target.value)}
                  placeholder="Enter Gift Number"
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: pendingGiftNumber.trim() && isGiftNumberTaken(pendingGiftNumber) 
                      ? '3px solid #FF6B6B' 
                      : '3px solid #333',
                    fontSize: '18px',
                    fontWeight: 700,
                    marginBottom: '8px',
                    textAlign: 'center',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    background: pendingGiftNumber.trim() && isGiftNumberTaken(pendingGiftNumber)
                      ? '#FFE6E6'
                      : 'white'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && addGiftToCurrentPlayer()}
                  autoFocus
                />
                {pendingGiftNumber.trim() && isGiftNumberTaken(pendingGiftNumber) && (
                  <div style={{
                    color: '#FF6B6B',
                    fontSize: '14px',
                    fontWeight: 700,
                    marginBottom: '12px',
                    textAlign: 'center'
                  }}>
                    ⚠️ This gift number is already taken!
                  </div>
                )}
                <button
                  onClick={addGiftToCurrentPlayer}
                  disabled={!pendingGiftNumber.trim() || isGiftNumberTaken(pendingGiftNumber)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: (pendingGiftNumber.trim() && !isGiftNumberTaken(pendingGiftNumber)) 
                      ? 'linear-gradient(135deg, #4CAF50, #45A049)' 
                      : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: (pendingGiftNumber.trim() && !isGiftNumberTaken(pendingGiftNumber)) 
                      ? 'pointer' 
                      : 'not-allowed',
                    fontWeight: 700,
                    fontSize: '18px',
                    boxShadow: (pendingGiftNumber.trim() && !isGiftNumberTaken(pendingGiftNumber)) 
                      ? '0 4px 16px rgba(76,175,80,0.4)' 
                      : 'none',
                    marginBottom: '24px'
                  }}
                >
                  ✅ Claim This Gift
                </button>
              </>
            )}

            {(turnAction === 'steal' || allMessedUpGifts.length > 0) && (
              <>
                {turnAction === 'spin' && (
                  <div style={{
                    textAlign: 'center',
                    margin: '24px 0',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#666'
                  }}>
                    OR
                  </div>
                )}

                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px', color: '#FF6B6B' }}>
                  🏴‍☠️ {turnAction === 'steal' ? 'Select a Gift to Steal!' : 'Or Steal a Messed-Up Gift!'}
                </h3>
                
                {/* Dynamic update indicator */}
                {allMessedUpGifts.length > 0 && (
                  <div style={{
                    background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    fontWeight: 700,
                    fontSize: '15px',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(255,107,107,0.3)',
                    animation: 'pulse 2s infinite'
                  }}>
                    🔥 {allMessedUpGifts.length} STEALABLE GIFT{allMessedUpGifts.length > 1 ? 'S' : ''} AVAILABLE!
                  </div>
                )}
                
                {allMessedUpGifts.length === 0 ? (
                  <div style={{
                    background: '#f0f0f0',
                    padding: '24px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    color: '#999'
                  }}>
                    No stealable gifts available yet.<br/>
                    <span style={{ fontSize: '14px' }}>Wait for someone to mess up their challenge!</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {allMessedUpGifts.map((gift, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: '#FFCCCB',
                          padding: '16px',
                          borderRadius: '12px',
                          border: '2px solid #FF6B6B'
                        }}
                      >
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px' }}>
                            {gift.playerName}'s Gift #{gift.giftNumber}
                          </div>
                          <div style={{
                            background: 'white',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 600
                          }}>
                            Challenge: {gift.challenge}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => stealGift(gift.playerIndex, gift.giftIndex)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: 700,
                            boxShadow: '0 4px 12px rgba(78,205,196,0.3)'
                          }}
                        >
                          🏴‍☠️ Steal This Gift!
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Game Area */}
      <div style={{ 
        maxWidth: '1800px', 
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 1200 ? '1.5fr 1fr' : '1fr',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Left Column - Wheel */}
        <div>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            textAlign: 'center',
            minHeight: '500px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              marginBottom: '16px',
              fontSize: '18px',
              fontWeight: 700,
              color: availableChallenges.length === 0 ? '#FF6B6B' : '#667eea'
            }}>
              {availableChallenges.length === 0 ? (
                '🚫 All challenges in use!'
              ) : (
                `${availableChallenges.length} / ${challenges.length} challenges available`
              )}
            </div>
            
            {players.length > 0 && currentPlayer && (
              <div style={{
                background: 'linear-gradient(135deg, #FFE66D 0%, #FFC107 100%)',
                padding: '16px',
                borderRadius: '16px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 700, opacity: 0.8, marginBottom: '4px', letterSpacing: '1px' }}>
                  CURRENT TURN
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>
                  {currentPlayer.name}
                </div>
              </div>
            )}

            <div style={{ 
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              minHeight: 0
            }}>
              <canvas
                ref={canvasRef}
                width={900}
                height={900}
                style={{
                  cursor: 'pointer',
                  border: '6px solid #667eea',
                  borderRadius: '50%',
                  boxShadow: '0 8px 32px rgba(102,126,234,0.4)',
                  opacity: availableChallenges.length === 0 ? 0.5 : 1,
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>

            {players.length > 0 && currentPlayer && (
              <button
                onClick={startTurn}
                disabled={spinning}
                style={{
                  width: '100%',
                  padding: '20px',
                  marginTop: '16px',
                  background: spinning ? '#ccc' : 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: spinning ? 'wait' : 'pointer',
                  fontWeight: 800,
                  fontSize: '22px',
                  boxShadow: spinning ? 'none' : '0 6px 20px rgba(255,107,107,0.4)'
                }}
              >
                {spinning ? '🎡 SPINNING...' : '🎮 START TURN'}
              </button>
            )}

            {players.length === 0 && (
              <div style={{
                padding: '20px',
                marginTop: '16px',
                background: '#FFF3CD',
                border: '2px solid #FFC107',
                borderRadius: '16px',
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: 700,
                color: '#856404'
              }}>
                👥 Add players to start the game!
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Players */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          minHeight: '500px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '22px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Users size={24} /> Players ({players.length})
            {takenGiftNumbers.length > 0 && (
              <span style={{
                background: '#4ECDC4',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '14px',
                marginLeft: 'auto'
              }}>
                {takenGiftNumbers.length} 🎁 In Play
              </span>
            )}
            {allMessedUpGifts.length > 0 && (
              <span style={{
                background: '#FF6B6B',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '14px',
                animation: 'pulse 2s infinite'
              }}>
                {allMessedUpGifts.length} 🏴‍☠️ Stealable
              </span>
            )}
          </h2>
          
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="Player name..."
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                border: '2px solid #ddd',
                fontSize: '15px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
            <button
              onClick={addPlayer}
              disabled={!newPlayerName.trim()}
              style={{
                padding: '12px 20px',
                background: newPlayerName.trim() ? 'linear-gradient(135deg, #4ECDC4, #44A08D)' : '#ddd',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: newPlayerName.trim() ? 'pointer' : 'not-allowed',
                fontWeight: 700,
                fontSize: '15px',
                boxShadow: newPlayerName.trim() ? '0 4px 12px rgba(78,205,196,0.3)' : 'none',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Plus size={18} />
            </button>
          </div>

          <div style={{ flex: 1, overflow: 'auto' }}>
            {players.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#999',
                fontSize: '16px'
              }}>
                <Users size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                <div style={{ fontWeight: 700, marginBottom: '8px' }}>No Players Yet</div>
                <div style={{ fontSize: '14px' }}>Add players above to start the game!</div>
              </div>
            )}
            
            {players.map((player, pIndex) => (
              <div
                key={pIndex}
                style={{
                  marginBottom: '12px',
                  border: pIndex === currentTurnIndex ? '3px solid #FFE66D' : '2px solid #eee',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: pIndex === currentTurnIndex ? '#FFFEF0' : 'white',
                  boxShadow: pIndex === currentTurnIndex ? '0 4px 16px rgba(255,230,109,0.3)' : '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: pIndex === currentTurnIndex ? '#FFE66D' : 'transparent'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <span style={{ fontSize: '18px', fontWeight: 800 }}>
                      {player.name}
                    </span>
                    <span style={{
                      background: player.gifts?.length > 0 ? '#4ECDC4' : '#ddd',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 700
                    }}>
                      {(player.gifts || []).length} 🎁
                    </span>
                    {(player.gifts || []).some(g => g.messedUp) && (
                      <span style={{
                        background: '#FF6B6B',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 700
                      }}>
                        {(player.gifts || []).filter(g => g.messedUp).length} 🏴‍☠️
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => togglePlayerExpanded(pIndex)}
                      style={{
                        background: 'rgba(0,0,0,0.1)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {player.expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <button
                      onClick={() => removePlayer(pIndex)}
                      style={{
                        background: 'rgba(255,107,107,0.2)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px',
                        cursor: 'pointer',
                        color: '#FF6B6B'
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {player.expanded && (player.gifts || []).length > 0 && (
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(player.gifts || []).map((gift, gIndex) => (
                      <div
                        key={gIndex}
                        style={{
                          background: gift.messedUp ? '#FFCCCB' : gift.challengeColor + '33',
                          border: `2px solid ${gift.messedUp ? '#FF6B6B' : gift.challengeColor}`,
                          borderRadius: '12px',
                          padding: '14px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Gift size={20} style={{ color: gift.challengeColor }} />
                            <span style={{ fontSize: '17px', fontWeight: 800 }}>
                              Gift #{gift.giftNumber}
                            </span>
                            {gift.messedUp && (
                              <span style={{ 
                                background: '#FF6B6B', 
                                color: 'white', 
                                padding: '4px 10px', 
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: 700
                              }}>
                                ❌ MESSED UP
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => removeGift(pIndex, gIndex)}
                            style={{
                              background: 'rgba(0,0,0,0.1)',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '4px 8px',
                              cursor: 'pointer'
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                        
                        <div style={{
                          background: 'white',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          fontSize: '14px',
                          fontWeight: 600,
                          marginBottom: '10px',
                          border: `1px solid ${gift.challengeColor}`,
                          lineHeight: '1.4'
                        }}>
                          🎭 {gift.challenge}
                        </div>

                        {!gift.messedUp && (
                          <button
                            onClick={() => markGiftMessedUp(pIndex, gIndex)}
                            style={{
                              width: '100%',
                              padding: '10px',
                              background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              fontWeight: 700,
                              fontSize: '14px',
                              boxShadow: '0 4px 12px rgba(255,107,107,0.3)'
                            }}
                          >
                            😱 Mark as Messed Up
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {player.expanded && (player.gifts || []).length === 0 && (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontStyle: 'italic', fontSize: '14px' }}>
                    No gifts yet
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default WhiteElephantWheel;
