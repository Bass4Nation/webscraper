// useToggleState.ts
import { useState } from "react";

/**
 * 
 * @param initialState - initial state of the toggle
 * @returns - a tuple with the state and a function to toggle the state
 */
export const useToggleState = (initialState: boolean = false) => {
  const [state, setState] = useState(initialState);
  const toggleState = (value?: boolean) => {
    if (value === undefined) {
      setState(!state);
    } else {
      setState(value);
    }
  };
  return [state, toggleState] as const;
};
