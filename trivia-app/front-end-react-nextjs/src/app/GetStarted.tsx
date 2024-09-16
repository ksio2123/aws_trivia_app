// import React from 'react';
import { Card, Button } from 'react-bootstrap';

export function GetStarted({ onNewGame }: { onNewGame: () => void }) {
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