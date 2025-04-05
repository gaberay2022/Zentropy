import React, {createContext, useContext, useState, ReactNode} from "react";

interface comment {
    commenter: string,
    comment: string
}

interface drawing {
    data: string,
    comments: string[]
}

interface GlobalStateContextType {
    currentDrawings: drawing[],
    setCurrentDrawings: (drawing: drawing[]) => void,
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export function GlobalStateProvider({ children }: { children: ReactNode }) {
    const [currentDrawings, setCurrentDrawings] = useState<drawing[]>([]);

    return (
        <GlobalStateContext.Provider value={{ currentDrawings, setCurrentDrawings}}>
            {children}
        </GlobalStateContext.Provider>
    );
}

export function useGlobalState() {
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error("useGlobalState must be used within a GlobalStateProvider");
    }
    return context;
}