// useToggleState.ts
import { useState } from "react";

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
