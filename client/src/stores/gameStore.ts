import { defineStore } from "pinia";

export type GameStatus = "idle" | "spinning" | "result";

export interface GameState {
  gameStatus: GameStatus;
  currentNumber: number | null;
  history: number[];
  balance: number;
  isConnected: boolean;
  spinCount: number;
  wins: number;
  losses: number;
}

export const useGameStore = defineStore("game", {
  state: (): GameState => ({
    gameStatus: "idle",
    currentNumber: null,
    history: [],
    balance: 1000,
    isConnected: false,
    wins: 0,
    losses: 0,
    spinCount: 0,
  }),
  getters: {
    isSpinDisabled(): boolean {
      return this.gameStatus !== "idle";
    },
  },
  actions: {
    startSpin(bet: number, currentNumber: number): void {
      if (
        bet > this.balance ||
        this.balance === 0 ||
        this.gameStatus === "spinning"
      )
        return;

      this.gameStatus = "spinning";
      this.currentNumber = currentNumber;

      this.balance = this.balance - bet;
      this.spinCount++;
    },

    setGameStatus(status: GameStatus): void {
      this.gameStatus = status;
    },

    updateHistory(resultNumber: number): void {
      this.history.push(resultNumber);
      if (this.history.length > 10) {
        this.history.shift();
      }
    },
  },
});
