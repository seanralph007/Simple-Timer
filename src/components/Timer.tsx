import Container from './UI/Container.tsx';
import { useTimersContext, type Timer as TimerProps } from '../store/timers-context.tsx';
import { useEffect, useRef, useState } from 'react';
// OR
// type TimerProps = {
//   name: string;
//   duration: number
// }

export default function Timer({name, duration}: TimerProps) {
  const [remainingState, setRemainingState] = useState(duration * 1000)
  const { isRunning } = useTimersContext()

  const interval = useRef<number | null>(null)

  if (remainingState <= 0 && interval.current) {
    clearInterval(interval.current)
  }

  useEffect(() => {
    let timer: number;

    if (isRunning) {
      timer = setInterval(function () {
        setRemainingState((prevTime) => {
          if (prevTime <= 0) {
            return prevTime
          }
          return prevTime - 100
        })
      }, 100)
      interval.current = timer;

    } else if (!isRunning && interval.current) {
      clearInterval(interval.current)
    }

    return () => clearInterval(timer)
  }, [isRunning])

  const formattedRemainingTime = (remainingState / 1000).toFixed(2)

  return (
    <Container as="article">
      <h2>{name}</h2>
      <p><progress max={duration * 1000} value={remainingState} /></p>
      <p>{formattedRemainingTime}</p>
    </Container>
  );
}
