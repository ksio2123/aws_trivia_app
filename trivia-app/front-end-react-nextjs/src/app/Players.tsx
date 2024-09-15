import { Card, ListGroup, Badge } from 'react-bootstrap';
import { Player } from './_lib/Player';

export function Players({playerList}: {playerList: Player[]}) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Players</Card.Title>
        <ListGroup>
        {playerList.length === 0 && <div>no players</div>}
        {playerList.length > 0 && playerList.map((player) => {
          return (
            <ListGroup.Item
              key={player.connectionId}
              {...(player.currentPlayer ? {variant: 'primary'} : {})}
              className="d-flex justify-content-between align-items-center"
            >
              <span style={{color:player.playerName}}>&#11044;
                <span className="small" style={{color:"Black"}}>{player.playerName}</span>
              </span>
              <Badge pill>{player.score}</Badge>
            </ListGroup.Item>
          )
         })}
         </ListGroup>
      </Card.Body>
    </Card>
  );
}
