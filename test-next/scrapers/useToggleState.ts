import { useState } from "react";

// useToggleState.ts
export const useToggleState = (initialState: boolean) => {
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
