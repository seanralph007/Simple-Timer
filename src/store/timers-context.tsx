import { createContext, useContext, useReducer, type ReactNode } from "react";

export type Timer = {
    name: string;
    duration: number
}

type TimerState = {
    isRunning: boolean;
    timers: Timer[]
}

const initialState: TimerState = {
    isRunning: true,
    timers: []
}

type TimersContextValue = TimerState & {
    addTimer: (timerData: Timer) => void,
    startTimers: () => void,
    stopTimers: () => void
}

const TimersContext = createContext<TimersContextValue | null>(null)

export function useTimersContext () {
    const timersCtx = useContext(TimersContext)

    if (timersCtx === null) {
        throw new Error('TimersContext is null, that should not be the case')
    }

    return timersCtx;
}

type TimersContextProviderProps = {
    children: ReactNode
}

type StartTimersAction = {
    type: 'START_TIMER'
}

type StopTimersAction = {
    type: 'STOP_TIMER'
}

type AddTimersAction = {
    type: 'ADD_TIMER',
    payload: Timer
}

type Action = StartTimersAction | StopTimersAction | AddTimersAction;

function timersReducer(state: TimerState, action: Action): TimerState {
    if (action.type === 'START_TIMER') {
        return {
            ...state,
            isRunning: true
        }
    }
    if (action.type === 'STOP_TIMER') {
        return {
            ...state,
            isRunning: false
        }
    }
    if (action.type === 'ADD_TIMER') {
        return {
            ...state,
            timers: [
                ...state.timers,
                {
                    name: action.payload.name,
                    duration: action.payload.duration
                },
            ],
        }
    }

    return state
}

export default function TimersContextProvider(props:TimersContextProviderProps) {

    const [timerState, dispatch] = useReducer(timersReducer, initialState)

    const ctx: TimersContextValue = {
        isRunning: timerState.isRunning,
        timers: timerState.timers,
        addTimer(timerData) {
            dispatch({type: 'ADD_TIMER', payload: timerData})
        },
        startTimers() {
            dispatch({type: 'START_TIMER'})
        },
        stopTimers() {
            dispatch({type: 'STOP_TIMER'})
        },
    }

    return <TimersContext.Provider value={ctx}>{props.children}</TimersContext.Provider>
}