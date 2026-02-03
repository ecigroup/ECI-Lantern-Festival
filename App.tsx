
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GameState } from './types';
import { RIDDLES, ANSWER_POOL } from './constants';
import Lantern from './components/Lantern';
import { 
  Sparkles, Trophy, Share2, ArrowRight, RotateCcw, 
  CheckCircle2, XCircle, Flower2, MousePointer2, 
  Moon, Mail, Star, Heart
} from 'lucide-react';

const FestiveIllustration: React.FC = () => (
  <div className="relative w-full h-32 sm:h-56 bg-gradient-to-b from-red-950 to-red-900 rounded-2xl overflow-hidden mb-4 border-b-2 border-yellow-600/30 shadow-inner shrink-0">
    <div className="absolute top-2 left-4 text-yellow-200/40">
      <Moon className="w-6 h-6 fill-yellow-200/10" />
    </div>
    
    {Array.from({ length: 10 }).map((_, i) => (
      <div 
        key={i} 
        className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-pulse"
        style={{ 
          top: `${Math.random() * 60}%`, 
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          opacity: Math.random() * 0.5 + 0.3
        }}
      ></div>
    ))}

    <div className="absolute inset-0 flex justify-around items-end pb-2">
      <Lantern className="scale-[0.35] opacity-60" delay={0.4} />
      <Lantern className="scale-[0.5] opacity-90" delay={0.1} />
      <Lantern className="scale-[0.4] opacity-70" delay={1.2} />
    </div>

    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-red-950/80 to-transparent"></div>
  </div>
);

const CardFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`relative w-full h-full p-2 border border-yellow-600/50 rounded-lg ${className}`}>
    <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-yellow-500"></div>
    <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-yellow-500"></div>
    <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-yellow-500"></div>
    <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-yellow-500"></div>
    {children}
  </div>
);

const OracleSpread: React.FC<{ 
  clue: string; 
  isFlipped: boolean; 
  onDraw: (index: number) => void;
  selectedIndex: number | null;
}> = ({ clue, isFlipped, onDraw, selectedIndex }) => {
  const cards = [0, 1, 2, 3, 4]; 

  return (
    <div className="relative w-full h-[340px] flex items-center justify-center mb-4 z-20 shrink-0">
      {cards.map((idx) => {
        const isSelected = selectedIndex === idx;
        const shouldHide = selectedIndex !== null && !isSelected;
        const offset = (idx - 2) * 20;
        const rotation = (idx - 2) * 5;

        return (
          <div
            key={idx}
            className={`absolute transition-all duration-700 preserve-3d cursor-pointer
              ${isSelected ? 'z-50' : 'z-10'}
              ${shouldHide ? 'opacity-0 scale-50 pointer-events-none translate-y-20' : 'opacity-100'}
              ${isFlipped && isSelected ? 'rotate-y-180' : ''}
              ${!isFlipped && !isSelected ? 'hover:-translate-y-2 active:scale-95' : ''}
            `}
            style={{
              width: isSelected ? '240px' : '110px',
              height: isSelected ? '330px' : '180px',
              transform: isSelected && isFlipped 
                ? 'rotateY(180deg) translateZ(50px) scale(1)' 
                : isSelected 
                ? 'translateY(0px) scale(1)' 
                : `translateX(${offset}px) rotate(${rotation}deg)`,
              perspective: '1000px'
            }}
            onClick={() => selectedIndex === null && onDraw(idx)}
          >
            {/* Front of Oracle Card */}
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-red-900 to-red-950 border-2 border-yellow-600 rounded-xl flex items-center justify-center overflow-hidden shadow-xl">
              <div className="absolute inset-0 opacity-10 flex flex-wrap gap-2 p-2 justify-center pointer-events-none">
                {Array.from({ length: 6 }).map((_, i) => <Flower2 key={i} className="w-4 h-4 text-yellow-500" />)}
              </div>
              <div className="text-center p-2">
                <Lantern className="scale-50 mb-1 opacity-50" />
                <p className="text-yellow-200/60 font-black text-[8px] tracking-widest uppercase">Secret {idx + 1}</p>
                {!isSelected && <div className="mt-2 animate-pulse"><MousePointer2 className="w-4 h-4 text-yellow-400 mx-auto" /></div>}
              </div>
            </div>

            {/* Back of Oracle Card (The Clue) */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border-2 border-yellow-600 rounded-xl flex items-center justify-center p-3 text-center shadow-inner overflow-hidden">
              <CardFrame className="flex flex-col justify-center">
                <div className="flex flex-col items-center justify-center h-full space-y-2">
                  <Sparkles className="text-yellow-600 w-4 h-4 opacity-40 shrink-0" />
                  <div className="overflow-y-auto max-h-[100%] w-full flex items-center justify-center">
                    <p className="text-xs font-bold italic leading-tight text-gray-800 px-1">
                      "{clue}"
                    </p>
                  </div>
                  <div className="w-8 h-0.5 bg-yellow-600/20 shrink-0"></div>
                  <span className="text-[7px] uppercase font-bold text-yellow-700/50 tracking-widest">Oracle Reading</span>
                </div>
              </CardFrame>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const AnswerTarot: React.FC<{
  option: string;
  isCorrect: boolean;
  isSelected: boolean;
  isRevealed: boolean;
  disabled: boolean;
  onClick: () => void;
}> = ({ option, isCorrect, isSelected, isRevealed, disabled, onClick }) => {
  return (
    <div 
      className={`group h-14 w-full perspective-1000 cursor-pointer mb-2 shrink-0 ${disabled ? 'cursor-default' : ''}`}
      onClick={() => !disabled && onClick()}
    >
      <div className={`relative w-full h-full transition-all duration-700 preserve-3d shadow-md rounded-xl ${isRevealed ? 'rotate-y-180' : 'active:scale-95'}`}>
        <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-2 bg-[#450a0a] border border-yellow-600/40 rounded-xl">
           <p className="text-[10px] font-bold text-yellow-200 text-center leading-tight uppercase tracking-wider px-2">
             {option}
           </p>
        </div>
        <div className={`absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-1 rounded-xl border-2 ${isCorrect ? 'bg-green-900 border-green-500' : 'bg-red-950 border-red-600'}`}>
          {isCorrect ? (
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-bold uppercase tracking-widest text-[8px]">Truth</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-500 font-bold uppercase tracking-widest text-[8px]">Illusion</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isClueRevealed, setIsClueRevealed] = useState(false);
  const [selectedClueCard, setSelectedClueCard] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isGreetingFlipped, setIsGreetingFlipped] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentOptions = useMemo(() => {
    const riddle = RIDDLES[currentRiddleIndex];
    const incorrectAnswers = ANSWER_POOL.filter(a => a !== riddle.answer);
    const shuffledIncorrect = [...incorrectAnswers].sort(() => Math.random() - 0.5);
    const selectedOptions = [riddle.answer, shuffledIncorrect[0], shuffledIncorrect[1]];
    return selectedOptions.sort(() => Math.random() - 0.5);
  }, [currentRiddleIndex]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleTimeout = () => {
    setIsAnswerRevealed(true);
    proceedToNext();
  };

  const handleClueDraw = (idx: number) => {
    setSelectedClueCard(idx);
    setTimeout(() => {
      setIsClueRevealed(true);
      startTimer();
    }, 400);
  };

  const proceedToNext = () => {
    setTimeout(() => {
      if (currentRiddleIndex < RIDDLES.length - 1) {
        setIsClueRevealed(false);
        setIsAnswerRevealed(false);
        setSelectedClueCard(null);
        setSelectedAnswer(null);
        setCurrentRiddleIndex(prev => prev + 1);
        setTimeLeft(15);
      } else {
        setGameState(GameState.FINISHED);
      }
    }, 2000);
  };

  const startGame = () => {
    setGameState(GameState.PLAYING);
    setCurrentRiddleIndex(0);
    setScore(0);
    setIsClueRevealed(false);
    setSelectedClueCard(null);
    setIsAnswerRevealed(false);
    setSelectedAnswer(null);
    setTimeLeft(15);
    setIsGreetingFlipped(false);
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswerRevealed || timeLeft === 0 || !isClueRevealed) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedAnswer(answer);
    setIsAnswerRevealed(true);
    if (answer === RIDDLES[currentRiddleIndex].answer) setScore(prev => prev + 1);
    proceedToNext();
  };

  const shareResults = () => {
    const text = `🏮 I found ${score}/12 truths in ECI Oracle Challenge! 🎴 #ECI #LanternFestival`;
    if (navigator.share) {
      navigator.share({ title: 'ECI Riddle Challenge', text, url: window.location.href }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
    }
  };

  const handleContactUs = () => window.open("https://www.ecigroup-global.com/en/contact-us.html", "_blank");

  const isPerfectScore = score === 12;

  return (
    <div className="min-h-screen bg-[#2a0808] text-yellow-100 flex flex-col items-center p-4 relative font-['Noto_Sans_TC'] overflow-y-auto">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .backface-hidden { backface-visibility: hidden; }
        .preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      `}</style>

      {gameState === GameState.START && (
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm text-center space-y-8 animate-in fade-in zoom-in duration-700 py-6">
          <div className="flex justify-center space-x-4">
            <Lantern delay={0} className="scale-75" />
            <Lantern delay={0.4} className="scale-75" />
          </div>
          <div className="px-2">
            <h1 className="text-3xl font-bold festive-font text-yellow-400 drop-shadow-md tracking-wider uppercase mb-3 leading-tight">
              ECI Grand Lantern Riddle Challenge
            </h1>
            <h2 className="text-xs font-medium text-yellow-200 tracking-[0.2em] opacity-80 uppercase italic">Who is the ultimate Riddle Master?</h2>
          </div>
          
          <div className="bg-black/30 p-6 rounded-3xl border border-yellow-600/30 backdrop-blur-sm shadow-xl">
            <p className="text-sm leading-relaxed italic font-medium">
              12 brain-teasing riddles are waiting for you! Put your wits to the test, see how many levels you can clear, and uncover the hidden surprises behind the answers.
            </p>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 font-black text-red-950 bg-yellow-400 rounded-full hover:bg-yellow-300 active:scale-95 shadow-lg uppercase tracking-widest text-sm flex items-center justify-center group"
          >
            START CHALLENGE NOW
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {gameState === GameState.PLAYING && (
        <div className="w-full max-w-sm flex flex-col items-center space-y-4 animate-in slide-in-from-bottom-8 duration-700 pt-2 pb-10">
          {/* HUD */}
          <div className="w-full flex justify-between items-center px-2 shrink-0">
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-widest opacity-50 font-bold">Progress</span>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black text-yellow-400">{currentRiddleIndex + 1}</span>
                <span className="text-xs opacity-30 font-bold">/ 12</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
               <span className="text-[8px] uppercase tracking-widest opacity-50 font-bold">Wisdom</span>
               <div className="text-xl font-black text-yellow-400">{score}</div>
            </div>
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${timeLeft <= 5 ? 'border-red-500 text-red-500 animate-pulse' : 'border-yellow-500/50 text-yellow-400'}`}>
               <span className="text-sm font-black">{timeLeft}</span>
            </div>
          </div>

          {/* Card Container - Added extra vertical breathing room */}
          <OracleSpread 
            clue={RIDDLES[currentRiddleIndex].clue} 
            isFlipped={isClueRevealed} 
            onDraw={handleClueDraw}
            selectedIndex={selectedClueCard}
          />

          <div className={`w-full transition-all duration-700 ${isClueRevealed ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
            <p className="text-[8px] uppercase tracking-widest text-yellow-500/50 font-bold text-center mb-2">Select the truth</p>
            {currentOptions.map((choice, idx) => (
              <AnswerTarot
                key={`${currentRiddleIndex}-${idx}`}
                option={choice}
                isCorrect={choice === RIDDLES[currentRiddleIndex].answer}
                isSelected={selectedAnswer === choice}
                isRevealed={isAnswerRevealed}
                disabled={isAnswerRevealed || timeLeft === 0 || !isClueRevealed}
                onClick={() => handleAnswerSelect(choice)}
              />
            ))}
          </div>
        </div>
      )}

      {gameState === GameState.FINISHED && (
        <div className="w-full max-w-sm flex flex-col items-center space-y-6 animate-in zoom-in duration-700 pb-12 pt-4">
          {isPerfectScore ? (
            <div className="w-full flex flex-col items-center space-y-6">
              <Trophy className="w-16 h-16 text-yellow-400 filter drop-shadow-lg" />
              <div 
                className={`w-full aspect-[2/3] max-h-[450px] perspective-1000 cursor-pointer ${isGreetingFlipped ? 'rotate-y-180' : ''} transition-all duration-1000 preserve-3d relative z-30`}
                onClick={() => setIsGreetingFlipped(true)}
              >
                {/* Perfect Card Front */}
                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-red-900 to-red-950 border-4 border-yellow-600 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
                  <Lantern className="scale-125 mb-8" />
                  <h3 className="text-2xl font-black text-yellow-400 festive-font uppercase tracking-widest mb-4">Master of Riddles</h3>
                  <p className="text-xs text-yellow-200/60 uppercase font-bold tracking-widest mb-8">Tap to reveal blessing</p>
                  <MousePointer2 className="w-6 h-6 text-yellow-400 animate-bounce" />
                </div>
                {/* Perfect Card Back (Greeting) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#1a0404] border-4 border-yellow-600 rounded-3xl flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]"></div>
                  <div className="relative z-10 space-y-6 flex flex-col items-center">
                    <div className="flex space-x-2">
                      <Star className="text-yellow-400 w-4 h-4" />
                      <Heart className="text-red-500 w-4 h-4 fill-red-500" />
                      <Star className="text-yellow-400 w-4 h-4" />
                    </div>
                    <h4 className="text-2xl font-black text-yellow-400 festive-font italic leading-tight">Chinese Lantern Festival</h4>
                    <div className="w-full h-px bg-yellow-600/30"></div>
                    <p className="text-sm font-serif italic text-yellow-100/90 leading-relaxed px-2">
                      "May your path be bright and your year be full."
                    </p>
                    <Lantern className="scale-75" />
                    <p className="text-[8px] text-yellow-500/40 uppercase tracking-[0.2em] font-black">ECI Elastic Corporation</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center space-y-4">
              <h2 className="text-3xl font-black text-yellow-500 festive-font uppercase italic">A Bright Journey</h2>
              <p className="text-xs text-yellow-200/60 font-medium tracking-widest uppercase">Wisdom grows with every lantern</p>
              <div className="w-full bg-black/40 p-4 rounded-3xl border border-yellow-600/20 backdrop-blur-md space-y-4 overflow-hidden">
                <FestiveIllustration />
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-black text-yellow-400">{score}</div>
                    <span className="text-[8px] uppercase tracking-widest opacity-40 font-bold">Truths</span>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-black text-yellow-400">{Math.round((score/12)*100)}%</div>
                    <span className="text-[8px] uppercase tracking-widest opacity-40 font-bold">Wisdom</span>
                  </div>
                </div>
                <p className="text-sm italic text-yellow-100/80 text-center leading-relaxed font-serif py-2">
                   "Pursue <span className="text-yellow-400 font-bold underline">Flexibility</span>, <br/>Create with Full Sincerity."
                </p>
              </div>
            </div>
          )}

          {(!isPerfectScore || isGreetingFlipped) && (
            <div className="w-full space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 px-2">
              <button
                onClick={startGame}
                className={`w-full py-4 font-black rounded-2xl transition-all shadow-md active:scale-95 uppercase tracking-widest text-xs flex items-center justify-center ${isPerfectScore ? 'bg-yellow-500 text-red-950' : 'bg-red-600 text-yellow-100'}`}
              >
                <RotateCcw className="mr-2 w-4 h-4" />
                {isPerfectScore ? 'Reset Ritual' : 'Try Again'}
              </button>
              <button
                onClick={shareResults}
                className="w-full py-4 bg-transparent border-2 border-yellow-500 text-yellow-400 font-black rounded-2xl active:scale-95 uppercase tracking-widest text-xs flex items-center justify-center"
              >
                <Share2 className="mr-2 w-4 h-4" />
                Share Oracle
              </button>
              <button
                onClick={handleContactUs}
                className="w-full py-4 bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 font-black rounded-2xl active:scale-95 uppercase tracking-widest text-xs flex items-center justify-center"
              >
                <Mail className="mr-2 w-4 h-4" />
                Contact Us
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
