import React, { useEffect, useState } from "react";
import WordSearch from "./components/wordSeacrch";
import HomePage from "./components/HomePage";
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { ThemeProvider } from "./components/ToggleContext";
import UserData from "./components/UserData";
import Thank from "./components/Thank";
import { Button } from 'antd';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.min.css'
const App:React.FC = ()=>{
  const warningToastMessages: string[] = [
    "Oops! That key doesn’t unlock any secrets. Try playing the game instead!",
    "Inspecting the game? Ah, the mysteries lie in playing, not peeking!",
    "Nice try! But this isn’t Hogwarts, and no magic keys work here.",
    "Caught you red-handed! Stick to the rules and enjoy the game.",
  ];
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMWPage, setIsMWPage] = useState(false);

  useEffect(() => {
    // ✅ Only run this after mount (after <BrowserRouter> is applied)
    const pathname = window.location.pathname;
    setIsMWPage(pathname === "/mw");
  }, []);
  const warnPlayer = () => {
    const randomMessage =
      warningToastMessages[Math.floor(Math.random() * warningToastMessages.length)];
    toast.warn(randomMessage);
  };

  const enableFullScreen = () => {
    const element = document.documentElement;
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
  };

  const monitorFullScreen = () => {
    if (!document.fullscreenElement) {
      setIsFullScreen(false);
    }
  };

  const handleFullScreenToggle = () => {
    enableFullScreen();
    setIsFullScreen(true);
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", monitorFullScreen);

    if(localStorage.getItem('WordWizardDate') !== new Date().toLocaleDateString()) {
      localStorage.clear();
      localStorage.setItem('WordWizardDate', new Date().toLocaleDateString());
    }
    const disableInspect = (e: MouseEvent | KeyboardEvent) => {
      // Disable right-click
      if (e.type === "contextmenu") {
        warnPlayer();
        e.preventDefault();
      }

      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J
      if (e.type === "keydown") {
        const keyboardEvent = e as KeyboardEvent;
        if (
          keyboardEvent.key === "F12" || // F12 key
          (keyboardEvent.ctrlKey &&
            keyboardEvent.shiftKey &&
            (keyboardEvent.key === "I" || keyboardEvent.key === "J")) // Ctrl+Shift+I or J
        ) {
          warnPlayer();
          keyboardEvent.preventDefault();
        }
      }
    };

    document.addEventListener("contextmenu", disableInspect);
    document.addEventListener("keydown", disableInspect);

    return () => {
      document.removeEventListener("fullscreenchange", monitorFullScreen);
      document.removeEventListener("contextmenu", disableInspect);
      document.removeEventListener("keydown", disableInspect);
    };
  }, []);
    return(
      <ThemeProvider>
      <BrowserRouter>
      {!isFullScreen && !isMWPage &&  (
          <div className="relative w-full h-screen gap-10 flex flex-col justify-center items-center bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-white font-playwrite mb-10 drop-shadow-lg">
        Word Wizard
      </h1>

      {/* Full Screen Button */}
      <Button
        type="primary"
        size="large"
        className="bg-green-500 hover:bg-green-400 text-black font-bold border-2 border-black shadow-md transition duration-300 px-6 py-3 rounded-xl"
        onClick={handleFullScreenToggle}
      >
        Enter Full Screen to Start the Game
      </Button>

      {/* Watermark */}
      <div className="absolute bottom-4 right-4 text-white text-sm opacity-30 select-none">
        © Softech Association
      </div>
    </div>
        )}
        {(isFullScreen || isMWPage)&& (
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/wordGame" element={<WordSearch/>}></Route>
        <Route path="/mw" element={<UserData/>}/> 
        <Route path="/end" element={<Thank/>}/>
      </Routes>
      )}
      <ToastContainer position='top-right'/>
      </BrowserRouter>
      </ThemeProvider>
    )
}

export default App;