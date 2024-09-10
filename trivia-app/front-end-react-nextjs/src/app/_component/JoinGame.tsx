import { Card, Button } from 'react-bootstrap'

export function JoinGame({onJoinGame}: {onJoinGame: () => void}) {
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