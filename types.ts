
export interface Riddle {
  id: number;
  clue: string;
  answer: string;
}

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}
