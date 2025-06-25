import React, { useEffect, useState } from 'react';
import Form from './Form'; // Adjust the path as per your project structure
import { RiTimerFlashLine } from "react-icons/ri";
import { Snowfall } from 'react-snowfall';
import {submitFormData,updateGameData} from './storeData';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.min.css'
import { useNavigate} from 'react-router-dom';
import {GameData,SelectedPathItem,FoundWord} from "../types/type"





const WordSearch: React.FC = () => {
  const words = [[
    'SYSTEM', 'RAM', 'DATABASE', 'DOS', 'ZIP', 'CSS',
    'HARDWARE','PROCESSOR', 'BYTE', 'HEAP',
    'BIT', 'MEMORY', 'MOUSE', 'HTML',
    'SQL', 'PYTHON', 'OS', 'JAVA', 'CUT', 'FILE'
  ],
  [
   "BUG", "BACKUP", "WIFI", "BIAS", "DISK",    
"PORT",                                       
"ARRAY", "CLIENT", "BOOT", "PIXEL", "INTERNET", "SERVER", 
"SSL", "BROWSER", "DOMAIN", "CODE",           
"PHP", "GPU", "CHAR", "BINARY"               
  ],
  [
    "DIRECTORY", "XML",
  
   
    "GOOGLE", "DOWNLOAD", "VIRUS", "PNG", "ITERATION",
    
    
    "UNIX", "HDMI", "EMAIL", "DATA", "IOS",
    
   
    "TREE", "BUS",
    
    "KEYBOARD", "EXE", "GIT", "GPS", "CLASS", "GUI" 
  ]
  
  
];
  const navigate = useNavigate();
  const colors = ["#dc0073", "#ff7700", "#005ae0"];
  const [chanceCount, setChanceCount] = useState<number>(() => {
    const chance = localStorage.getItem('chance');
    return chance ? parseInt(chance) : 30;
  });
  const [selectedLetters, setSelectedLetters] = useState<string>('');
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectedPath, setSelectedPath] = useState<SelectedPathItem[]>([]);
  const [selectionDirection, setSelectionDirection] = useState<string | null>(null);
  const [foundWords, setFoundWords] = useState<FoundWord[]>(() => {
    const storedWords = localStorage.getItem('foundWords');
    return storedWords ? JSON.parse(storedWords) : [];
  });
  const [score, setScore] = useState<number>(() => {
    const storedScore = localStorage.getItem('score');
    return storedScore ? JSON.parse(storedScore) : 0;
  });

  const [selectedGrid] = useState<number>(()=>{
    const gridNum = localStorage.getItem('gridNum');
    let index;
    if(gridNum)
    {
      index = parseInt(gridNum);
    }
    else
    {
      index = Math.floor(Math.random() * 3);
      localStorage.setItem('gridNum',index.toString());
    }
    return index;
  })
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const storedTime = localStorage.getItem('timeLeft');
    return storedTime ? JSON.parse(storedTime) : 2400; // Default to 2400 seconds (40 minutes)
  });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(() => {
    const formSubmitted = localStorage.getItem('formSubmitted');
    return formSubmitted ? false : true; // Show form if 'formSubmitted' is not set
  });
  const [timerStarted, setTimerStarted] = useState<boolean>(false); // Flag to track if timer has started

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleGameOver = async () => {
    const gameData: any = {
      wordsFound: foundWords,
      score: score,
      chanceleft: chanceCount,
      time: timeLeft,
      gridNum:selectedGrid
    };
    const userData = localStorage.getItem('userData');
    const data = JSON.parse(userData!);
    const rollNumber = data.rollNumber; // Ensure you have formData available here
    try {
      await updateGameData(rollNumber, gameData);
      console.log('Game data updated on game over.');
    } catch (error) {
      console.error('Error updating game data:', error);
    }
  };

  useEffect(() => {
    if (showForm) {
      return; // Don't start timer until form is submitted
    }

    if (!timerStarted && !showForm) {
      setTimerStarted(true); // Set flag once timer starts after form submission
    }

    if (timeLeft === 0 || gameOver) {
      setGameOver(true);
      handleGameOver();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    if(timeLeft == 10)
    {
        toast.warn('only 10 seconds left')
    }
    else if(timeLeft == 600)
    {
      toast.warn('only 10 minutes left')
    }

    return () => clearInterval(timer);
  }, [timeLeft, gameOver, showForm, timerStarted]);

  useEffect(() => {
    if (chanceCount === 0) {
      setGameOver(true);
    }
    if(chanceCount === 5)
    {
      toast.warn('only 5 chances left')
    }
  }, [chanceCount]);

  useEffect(()=>{
      const flag = localStorage.getItem('timeFlag');
      if(flag)
      {

      }
      else
      {
          navigate('/');
      }
  },[])

  useEffect(() => {
    localStorage.setItem('timeLeft', JSON.stringify(timeLeft)); // Store remaining time
    localStorage.setItem('chance', chanceCount.toString()); // Store chance count
  }, [timeLeft, chanceCount]);

  useEffect(() => {
    const handleMouseUp = () => {
      if (words[selectedGrid].includes(selectedLetters) && !foundWords.some(word => word.word === selectedLetters)) {
        const color = getRandomColor();
        const newFoundWords = [...foundWords, { word: selectedLetters, path: selectedPath, color }];
        setFoundWords(newFoundWords);
        setScore(score + 1);
        localStorage.setItem('foundWords', JSON.stringify(newFoundWords));
        localStorage.setItem('score', JSON.stringify(score + 1));
        if (newFoundWords.length === words[selectedGrid].length) {
          setGameOver(true);
        }
      } else {
        setSelectedPath([]);
      }
      setChanceCount(prevCount => prevCount - 1);
      setIsSelecting(false);
      setSelectionDirection(null);
      setSelectedLetters('');
    };

    if (isSelecting) {
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSelecting, selectedLetters, foundWords, score, words, chanceCount]);

  const handleMouseDown = (letter: string, index: number) => {
    if (gameOver) return; // Disable selection if game over
    setIsSelecting(true);
    setSelectedPath([{ letter, index }]);
    setSelectedLetters(letter);
    setSelectionDirection(null); // Reset direction on new selection
  };

  const handleMouseOver = (letter: string, index: number) => {
    if (gameOver || !isSelecting) return; // Disable selection if game over or not selecting
    const lastSelected = selectedPath[selectedPath.length - 1];
    const lastIndex = lastSelected.index;

    if (isValidSelection(lastIndex, index)) {
      setSelectedPath([...selectedPath, { letter, index }]);
      setSelectedLetters(selectedLetters + letter);
    }
  };

  const isValidSelection = (lastIndex: number, currentIndex: number): boolean => {
    const lastRow = Math.floor(lastIndex / 10);
    const lastCol = lastIndex % 10;
    const currentRow = Math.floor(currentIndex / 10);
    const currentCol = currentIndex % 10;

    if (selectionDirection === null) {
      if (lastRow === currentRow && Math.abs(lastCol - currentCol) === 1) {
        setSelectionDirection('row'); // Horizontal selection
      } else if (lastCol === currentCol && Math.abs(lastRow - currentRow) === 1) {
        setSelectionDirection('column'); // Vertical selection
      } else if (Math.abs(lastRow - currentRow) === 1 && Math.abs(lastCol - currentCol) === 1) {
        setSelectionDirection('diagonal'); // Diagonal selection
      } else {
        return false;
      }
    }

    switch (selectionDirection) {
      case 'row':
        return lastRow === currentRow && Math.abs(lastCol - currentCol) === 1;
      case 'column':
        return lastCol === currentCol && Math.abs(lastRow - currentRow) === 1;
      case 'diagonal':
        return Math.abs(lastRow - currentRow) === 1 && Math.abs(lastCol - currentCol) === 1;
      default:
        return false;
    }
  };

  const isCellSelected = (index: number): boolean => {
    return selectedPath.some(item => item.index === index);
  };

  const getCellColor = (index: number): string => {
    for (const foundWord of foundWords) {
      if (foundWord.path.some(item => item.index === index)) {
        return foundWord.color;
      }
    }
    return '';
  };

  const grid =[ [
    'S', 'Y', 'S', 'T', 'E', 'M', 'F', 'I', 'B', 'P',
    'F', 'Q', 'Z', 'I', 'P', 'D', 'O', 'S', 'Y', 'R', 
    'T', 'I', 'L', 'B', 'U', 'Z', 'O', 'T', 'T', 'O', 
    'O', 'U', 'L', 'P', 'S', 'F', 'H', 'C', 'E', 'C', 
    'Y', 'D', 'C', 'E', 'T', 'O', 'E', 'N', 'S', 'E', 
    'R', 'A', 'M', 'W', 'N', 'K', 'A', 'L', 'U', 'S', 
    'O', 'Z', 'A', 'O', 'A', 'M', 'P', 'M', 'O', 'S', 
    'M', 'R', 'T', 'V', 'F', 'O', 'R', 'T', 'M', 'O', 
    'E', 'R', 'A', 'W', 'D', 'R', 'A', 'H', 'N', 'R', 
    'M', 'J', 'D', 'A', 'T', 'A', 'B', 'A', 'S', 'E'
  ],
  [
    'B', 'U', 'G', 'S', 'B', 'I', 'A', 'S', 'K', 'B',
    'W', 'I', 'F', 'I', 'O', 'A', 'E', 'M', 'I', 'L',
    'H', 'N', 'N', 'R', 'O', 'R', 'D', 'I', 'S', 'K',
    'R', 'T', 'I', 'A', 'T', 'R', 'O', 'P', 'E', 'C',
    'E', 'E', 'A', 'N', 'R', 'A', 'C', 'I', 'R', 'O',
    'S', 'R', 'M', 'U', 'S', 'Y', 'L', 'X', 'V', 'L',
    'W', 'N', 'O', 'Q', 'P', 'R', 'I', 'E', 'E', 'B',
    'O', 'E', 'D', 'H', 'A', 'G', 'E', 'L', 'R', 'D',
    'R', 'T', 'P', 'H', 'O', 'L', 'N', 'S', 'W', 'B',
    'B', 'A', 'C', 'K', 'U', 'P', 'T', 'S', 'K', 'M'
  ],
  [
    'K', 'B', 'D', 'A', 'O', 'L', 'N', 'W', 'O', 'D',
    'U', 'E', 'L', 'G', 'O', 'O', 'G', 'Z', 'I', 'A',
    'N', 'M', 'Y', 'M', 'U', 'G', 'N', 'P', 'O', 'T',
    'I', 'A', 'H', 'B', 'A', 'I', 'S', 'G', 'S', 'A',
    'X', 'I', 'D', 'U', 'O', 'S', 'U', 'R', 'I', 'V',
    'E', 'L', 'M', 'I', 'A', 'A', 'B', 'S', 'E', 'T',
    'E', 'N', 'I', 'L', 'N', 'O', 'R', 'X', 'M', 'L',
    'R', 'F', 'C', 'D', 'W', 'M', 'E', 'D', 'O', 'M',
    'T', 'N', 'O', 'I', 'T', 'A', 'R', 'E', 'T', 'I',
    'D', 'I', 'R', 'E', 'C', 'T', 'O', 'R', 'Y', 'K'
  ]
];

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleFormSubmit = async (formData:any) => {
    localStorage.setItem('formSubmitted', 'true');
    try {
      const gameData:GameData = {
        wordsFound:foundWords,
        score:score,
        chanceleft:chanceCount,
        time : timeLeft
      }
      const res = await submitFormData(formData,gameData);
      if(res !== 'Duplicate')
      {
          toast.success("Thank you for the Details!")
          setShowForm(false);
      }
      else
      {
          toast.error("User Already Exists")
          setShowForm(false)
      }
      
    } catch (error) {
        console.log(error)
    }
    
  };

  const handleExit = () =>{
     navigate('/end');
  }

  return (
    <div className={`wordGamebg h-screen flex justify-center items-center w-full`}>
      <Snowfall />
      <div className='w-full flex justify-center gap-2 items-center h-[32rem]'>
        <div className='grid grid-cols-10 gap-1 w-fit p-3 bg-black/60 border-2 h-full border-teal-500 rounded-lg shadow-lg shadow-white/30'>
          {grid[selectedGrid].map((letter, index) => (
            <div
              key={index}
              className={`select-none flex justify-center items-center shadow-lg shadow-teal-700 w-10 h-10 border-2 border-black rounded-lg cursor-pointer ${
                isCellSelected(index) && isSelecting ? 'bg-gray-500' : 'bg-teal-700'
              }`}
              onClick={() => handleMouseDown(letter, index)}
              onMouseMove={() => handleMouseOver(letter, index)}
              style={{ backgroundColor:  getCellColor(index), pointerEvents: isCellSelected(index) && isSelecting ? 'none' : 'auto' }}
            >
              <p className='font-playfair text-white'>{letter}</p>
            </div>
          ))}
        </div>
        <div className='flex flex-col border-2 h-full overflow-auto border-teal-500 shadow-lg shadow-white/30 rounded-lg w-72 p-5 bg-black/60 text-white font-playfair text-xl'>
          <div className='flex flex-col items-center'>
            <p className=''>Chance Left : {chanceCount}</p>
            <p className=''>Selected Letters: {selectedLetters}</p>
            <p className='mt-4'>Score: {score}</p>
          </div>
          <div className='flex flex-col items-center'>
            <h3 className='mt-4'>Found Words:</h3>
            <ul className='mt-4'>
              {foundWords.map((foundWord, index) => (
                <li key={index} style={{  }}>{foundWord.word}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="fixed flex flex-col items-center bottom-4 right-20 text-white py-2 px-4 rounded">
        { gameOver ?<button className='mb-10 bg-black/80 px-4 py-1 rounded-md border-2 border-white' onClick={handleExit}>Exit</button> : <></>}
        <RiTimerFlashLine size={40} className='' />
        <p className='text-2xl font-playfair'>{formatTime(timeLeft)}</p>
      </div>
      {showForm && <Form onSubmit={handleFormSubmit} />}
      <ToastContainer position='top-right'/>
    </div>
  );
};

export default WordSearch;
