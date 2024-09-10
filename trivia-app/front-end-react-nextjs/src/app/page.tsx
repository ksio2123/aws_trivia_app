"use client"
import React, { useState, useEffect, useRef, useLayoutEffect} from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { Question } from './_lib/Question';
import { Player } from './_lib/Player';
import { TriviaStep } from './_lib/TriviaStep';
import { GetStarted } from './_component/GetStarted';
import { JoinGame } from './_component/JoinGame';
import { Waiting } from './_component/Waiting';
import { GameOver } from './_component/GameOver';
import { Players } from './_component/Players';
import { Questions } from './_component/Questions';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(TriviaStep.STEP_GETSTARTED);
  const [connected, setConnected] = useState(false);
  const [gameId, setGameId] = useState<string>(null!);
  const [playerList, setPlayerList] = useState<Player[]>(null!);
  const [question, setQuestion] = useState<Question>(null!);
  const connection = useRef<WebSocket>(null!);
  useLayoutEffect(() => {
    if (document.location.hash.startsWith('#newgame') ) {
      setCurrentStep(TriviaStep.STEP_JOINGAME);
      setGameId(document.location.hash.replace('#newgame/', ''));
    }
  }, [])
  useEffect(() => {
    const ws = new WebSocket(process.env.WEBSOCKET_ENDPOINT ?? '');
    ws.onopen = () => {
      setConnected(true);
    }
    ws.onmessage = (evt) => {
      const message = JSON.parse(evt.data);
      switch (message.action) {
        case "gamecreated":
          setGameId(message.gameId)
          break;
        case "playerlist":
          setPlayerList(message.players.splice(0));
          break;
        case "question":
          setQuestion(message.question);
          break;
        case "gameover":
          setCurrentStep(TriviaStep.STEP_GAMEOVER);
          break;
        default:
          break;
      }
    }
    connection.current = ws;
    return ws.close;
  }, [])
  const newGame = () => {
    const message = JSON.stringify({ "action": "newgame" });
    connection.current.send(message);
    setCurrentStep(TriviaStep.STEP_WAITING);
  }
  const joinGame = () => {
    const message = JSON.stringify({ "action": "joingame", "gameid": gameId });
    connection.current.send(message);
    setCurrentStep(TriviaStep.STEP_QUESTIONS);
  }
  const startGame = () => {
    const message = JSON.stringify({ "action": "startgame", "gameid": gameId });
    connection.current.send(message);
    setCurrentStep(TriviaStep.STEP_QUESTIONS);
  }
  const answer = (questionId: string, answer: string) => {
    const message = JSON.stringify({
      "action": "answer",
      "gameid": gameId,
      "questionid": questionId,
      "answer": answer
    })
    connection.current.send(message);
  }
  return (
    <Container className="p-3">
      <Row>
        <Col>
          {currentStep === TriviaStep.STEP_GETSTARTED && <GetStarted onNewGame={newGame} />}
          {currentStep === TriviaStep.STEP_JOINGAME && <JoinGame onJoinGame={joinGame} />}
          {currentStep === TriviaStep.STEP_WAITING && <Waiting onStartGame={startGame} gameId={gameId}/>}
          {currentStep === TriviaStep.STEP_QUESTIONS && <Questions onAnswer={answer}  question={question}/>}
          {currentStep === TriviaStep.STEP_GAMEOVER && <GameOver />}
          {connected ? <small>&#129001; connected</small> :  <small>&#128997; disconnected</small>}
        </Col>
        <Col xs={3}>
          {playerList && <Players playerList={playerList}/>}
          <br/>
          <div className="d-flex justify-content-center">
          {question && <CountdownCircleTimer
            key={question.id}
            size={120}
            isPlaying
            duration={5}
            colors={"#007bff"}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
