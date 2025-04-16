"use client"

import {
    createContext,
    useState,
    useContext,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";

// 1. Define the shape of the modal state
interface ModalState {
    state: boolean;
    payload: {
        userId: string;
        communityId: string;
    };
}

// 2. Context value type
interface ModelContextType {
    isOpen: ModalState;
    setIsOpen: Dispatch<SetStateAction<ModalState>>;
}

// 3. Create the context
const ModelContextData = createContext<ModelContextType | undefined>(undefined);

// 4. Props for the provider
interface ModelProviderProps {
    children: ReactNode;
}

// 5. The provider component
const ModelContext = ({ children }: ModelProviderProps) => {
    const [isOpen, setIsOpen] = useState<ModalState>({
        state: false,
        payload: {
            userId: "",
            communityId: "",
        },
    });

    return (
        <ModelContextData.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </ModelContextData.Provider>
    );
};

// 6. Custom hook for accessing the context
export const useModelContext = () => {
    const context = useContext(ModelContextData);
    if (!context) {
        throw new Error("useModelContext must be used within a ModelContext provider");
    }
    return context;
};

export default ModelContext;
