import { Card, Form, Button, Spinner } from 'react-bootstrap';

export function Waiting({onStartGame, gameId} : {onStartGame: () => void, gameId: string}) {
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