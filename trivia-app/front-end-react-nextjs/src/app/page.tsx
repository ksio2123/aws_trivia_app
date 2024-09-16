"use client"
import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { TriviaStep } from './_lib/TriviaStep';
import { GetStarted } from './GetStarted';
import { JoinGame } from './JoinGame';
import { Waiting } from './Waiting';
import { GameOver } from './GameOver';
import { Players } from './Players';
import { Questions } from './Questions';
import { useGameController } from './_lib/useGameController';

const {STEP_GETSTARTED, STEP_JOINGAME, STEP_WAITING, STEP_GAMEOVER, STEP_QUESTIONS} =  TriviaStep;

export default function Home() {

  const {send, setCurrentStep, gameId, currentStep, connected, playerList, question} = useGameController()

  const newGame = () => {
    const message = JSON.stringify({ "action": "newgame" });
    send(message);
    setCurrentStep(STEP_WAITING);
  }
  const joinGame = () => {
    const message = JSON.stringify({ "action": "joingame", "gameid": gameId });
    send(message);
    setCurrentStep(STEP_QUESTIONS);
  }
  const startGame = () => {
    const message = JSON.stringify({ "action": "startgame", "gameid": gameId });
    send(message);
    setCurrentStep(STEP_QUESTIONS);
  }
  const answer = (questionId: string, answer: string) => {
    const message = JSON.stringify({
      "action": "answer",
      "gameid": gameId,
      "questionid": questionId,
      "answer": answer
    })
    send(message);
  }
  return (
    <Container className="p-3">
      <Row>
        <Col>
          {currentStep === STEP_GETSTARTED && <GetStarted onNewGame={newGame} />}
          {currentStep === STEP_JOINGAME && <JoinGame onJoinGame={joinGame} />}
          {currentStep === STEP_WAITING && <Waiting onStartGame={startGame} gameId={gameId}/>}
          {currentStep === STEP_QUESTIONS && <Questions onAnswer={answer}  question={question}/>}
          {currentStep === STEP_GAMEOVER && <GameOver />}
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
