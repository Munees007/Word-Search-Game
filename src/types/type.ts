export interface UserData {
    date:number,
  formData: {
    name: string;
    rollNumber: string;
    className: string;
    email: string;
  };
  gameData: {
    chanceleft: number;
    score: number;
    time: number;
    gridNum:number;
    wordsFound: {
      color: string;
      path: { index: number; letter: string }[];
      word: string;
    }[];
  };
}

export interface FormData {
  name: string;
  rollNumber: string;
  className: string;
  email: string;
}

export interface GameData {
  wordsFound: FoundWord[];
  score: number;
  chanceleft: number;
  time: number;
}



export interface SelectedPathItem {
  letter: string;
  index: number;
}

export interface FoundWord {
  word: string;
  path: SelectedPathItem[];
  color: string;
}


