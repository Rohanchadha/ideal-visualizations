import React, { createContext, useContext, useState, useCallback } from 'react';
import CallbackForm from '../components/CallbackForm';

const UIContext = createContext(null);

export function UIProvider({ children }) {
    const [callbackOpen, setCallbackOpen] = useState(false);
    const openCallback = useCallback(() => setCallbackOpen(true), []);
    const closeCallback = useCallback(() => setCallbackOpen(false), []);
    return (
        <UIContext.Provider value={{ openCallback, closeCallback }}>
            {children}
            <CallbackForm open={callbackOpen} onClose={closeCallback} />
        </UIContext.Provider>
    );
}

export function useUI() {
    const ctx = useContext(UIContext);
    if (!ctx) throw new Error('useUI must be used within UIProvider');
    return ctx;
}
