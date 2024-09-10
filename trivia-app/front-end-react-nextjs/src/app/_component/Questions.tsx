import { useState } from 'react';
import { Spinner, Col, Button, Card } from 'react-bootstrap';
import { Question } from '../_lib/Question';

type QuestionsProps = {
  onAnswer: (questionId: string, answer: string) => void,
  question: Question
}

export function Questions({ onAnswer, question }: QuestionsProps) {
  const [activeButton, setActiveButton] = useState<string>(null!);

  const answerClick = (key: string, id: string, option: string) => {
    onAnswer(id, option);
    setActiveButton(key);
  }
  const questionBody = question === null ? (
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
              variant={activeButton === myKey ? "success" : "secondary"}
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