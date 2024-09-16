
import { useState, useEffect, useRef, useLayoutEffect} from 'react';
import { MessageType } from './MessageType';
import { TriviaStep } from './TriviaStep';
import { Player } from './Player';
import { Question } from './Question';

const {STEP_GETSTARTED, STEP_JOINGAME, STEP_GAMEOVER} =  TriviaStep;
const {GAME_CREATED, PLAYER_LIST, QUESTION, GAMEOVER} = MessageType;

export const useGameController = () => {
  const [connected, setConnected] = useState(false);
  const connection = useRef<WebSocket>(null!);
  const [gameId, setGameId] = useState<string>('');
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [question, setQuestion] = useState<Question>(null!);
  const [currentStep, setCurrentStep] = useState(STEP_GETSTARTED);

  useLayoutEffect(() => {
    if (document.location.hash.startsWith('#newgame') ) {
      setCurrentStep(STEP_JOINGAME);
      setGameId(document.location.hash.replace('#newgame/', ''));
    }
  }, [])

  useEffect(() => {
    const ws = new WebSocket(process.env.WEBSOCKET_ENDPOINT ?? '');
    connection.current = ws;
    ws.onopen = () => setConnected(true);
    ws.onmessage = (evt) => {
      const message = JSON.parse(evt.data);
      switch (message.action) {
        case GAME_CREATED:
          setGameId(message.gameId)
          break;
        case PLAYER_LIST:
          let players = message.players.splice(0);
          // make currentPlayer top of the list
          players.sort((p1: Player) => p1.currentPlayer === true ? -1 : 1)
          setPlayerList(players);
          break;
        case QUESTION:
          setQuestion(message.question);
          break;
        case GAMEOVER:
          setCurrentStep(STEP_GAMEOVER);
          break;
        default:
          break;
      }
    };
    ws.onclose = () => setConnected(false);
    return ws.close
  }, []);

  return { connected, gameId, playerList, question, currentStep, send: (msg: string) => connection.current?.send(msg), setCurrentStep };
};