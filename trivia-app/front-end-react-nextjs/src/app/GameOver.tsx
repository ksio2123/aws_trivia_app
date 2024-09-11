import { Button } from 'react-bootstrap';
export function GameOver() {
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