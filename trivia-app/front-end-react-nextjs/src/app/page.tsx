"use client"
import React, { useState, useEffect, useRef, useLayoutEffect} from 'react';
import { Row, Col, Card, Button, Container, Form, Spinner, Badge, ListGroup} from 'react-bootstrap';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

enum TriviaStep {
  STEP_GETSTARTED = 0,
  STEP_JOINGAME = 1,
  STEP_WAITING = 2,
  STEP_QUESTIONS = 3,
  STEP_GAMEOVER = 4,
}

type Question = {
  id: string,
  question: string,
  options: string[]
}

type Player = {
  connectionId: string,
  currentPlayer: boolean,
  playerName: string,
  score: number
}

function GetStarted({ onNewGame }: { onNewGame: () => void }) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Get Started</Card.Title>
        <Card.Text>
          Click the button below to start a new game.
        </Card.Text>
        <Button variant="primary" onClick={onNewGame}>Create a New Game</Button>
      </Card.Body>
    </Card>);
}

function JoinGame({onJoinGame}: {onJoinGame: () => void}) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Join Game</Card.Title>
        <Card.Text>
          You&apos;ve been invited to join a game!
        </Card.Text>
        <Button variant="primary" onClick={onJoinGame}>Join</Button>
      </Card.Body>
    </Card>
  );
}

function Waiting({onStartGame, gameId} : {onStartGame: () => void, gameId: string}) {
  const invitelink = new URL(`#newgame/${gameId}`, document.baseURI).href;
  const inviteBody = (gameId) ? (
    <Card.Text>
      Share the link below with players joining the game
      <Form.Control type="text" value={invitelink} readOnly />
      <Button variant="primary" onClick={onStartGame}>Start Game</Button>
    </Card.Text>
    ) : (
      <Spinner animation="grow" variant="secondary" />
  );

  return (
    <Card>
      <Card.Body>
        <Card.Title>Waiting for players</Card.Title>
        {inviteBody}
      </Card.Body>
    </Card>
  );
}

type QuestionsProps = {
  onAnswer: (questionId: string, answer: string) => void,
  question: Question
}

function Questions({onAnswer, question} : QuestionsProps) {
  const [activeButton, setActiveButton] = useState<string>(null!);

  const answerClick = (key: string, id: string, option: string) => {
    onAnswer(id, option);
    setActiveButton(key);
  }
  const questionBody = question === null? (
    <Spinner animation="grow" variant="secondary" />
  ) : (
    <Col lg="8">
      <b>{question.question}</b>
      <div className="d-grid gap-2">
      {question.options.map((option, i) => {
        const myKey = question.id + "-" + i;
        return (
          <Button
           key={myKey}
           variant={activeButton===myKey ? "success" : "secondary"}
           onClick={() => answerClick(myKey, question.id, option)}
           size="lg">
            {option}
          </Button>
        )
      })}
      </div>
    </Col>
  );
  return (
    <Card>
      <Card.Body>
        <Card.Title>Let&apos;s Play!</Card.Title>
          {questionBody}
      </Card.Body>
    </Card>
  );
}

function GameOver() {
  const restart = () => {
    document.location = document.baseURI;
  };

  return (
    <div className='jumbotron'>
      <h1>Game Completed!</h1>
      <p>
      </p>
      <p>
        <Button variant="primary" onClick={()=>restart()}>Restart</Button>
      </p>
  </div>
  );
}

function Players({playerList}: {playerList: Player[]}) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Players</Card.Title>

        <ListGroup>
        {playerList && playerList.filter((player)=>player.currentPlayer).map((player) => {
            return (<ListGroup.Item key={player.connectionId} variant="primary" className="d-flex justify-content-between align-items-center">
              <span style={{color:player.playerName}}>&#11044; <span className="small" style={{color:"Black"}}>{player.playerName}</span></span>
              <Badge pill>{player.score}</Badge>
            </ListGroup.Item>)
         })}
         </ListGroup>
         <p></p>
         <ListGroup>
        {playerList ? playerList.filter((player)=>!player.currentPlayer).map((player) => {
            return (<ListGroup.Item key={player.connectionId} className="d-flex justify-content-between align-items-center">
              <span style={{color:player.playerName}}>&#11044; <span className="small" style={{color:"Black"}}>{player.playerName}</span></span>
              <Badge pill >{player.score}</Badge>
            </ListGroup.Item>)
         }) : <div>no players</div>}

        </ListGroup>
      </Card.Body>
    </Card>
  );
}


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
    return () => { ws.close()};
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
