"use client";
import React, {createContext, useContext, useState, useEffect, ReactNode} from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";

interface comment {
    commenter: string,
    comment: string
}

interface drawing {
    time_Created: Date,
    data: Blob,
    comments: comment[]
}

interface GlobalStateContextType {
    currentDrawings: drawing[],
    setCurrentDrawings: (drawing: drawing[]) => void,
}

interface activeParentIdsInterface {
    preloadParentId: string | undefined,
    visibleParentIds: string[]
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export function GlobalStateProvider({ children }: { children: ReactNode }) {
    const [currentDrawings, setCurrentDrawings] = useState<string | undefined>(undefined);
    const [activeParentIds, setActiveParentIds] = useState<activeParentIdsInterface>({
        preloadParentId: undefined,
        visibleParentIds: []
    });
    const [fileId, setFileId] = useState<string | undefined>(undefined);
    const [userId, setUserId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<boolean>(false);
    const [contextMenuType, setContextMenuType] = useState<string>("file");
    const [heldKeys, setHeldKeys] = useState<Array<string>>([]);
    useEffect(() => {
        if (user?.userId) {
            setUserId(user.userId); // Automatically assign userId
        }
    }, [user]);

    return (
        <GlobalStateContext.Provider value={{ projectId, setProjectId, activeParentIds, setActiveParentIds, fileId, setFileId, userId, contextMenu, setContextMenu,
            contextMenuType, setContextMenuType, heldKeys, setHeldKeys}}>
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