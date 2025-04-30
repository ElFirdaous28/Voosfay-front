import React, { createContext, useContext, useState } from 'react';
import ConfirmationDialog from '../components/ConfirmationDialog';

const DialogContext = createContext();

export const useConfirmation = () => useContext(DialogContext);

export const ConfirmationProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogConfig, setDialogConfig] = useState({});
    const [onConfirmCallback, setOnConfirmCallback] = useState(() => () => { });

    const openDialog = (config, onConfirm) => {
        setDialogConfig(config);
        setOnConfirmCallback(() => onConfirm);
        setIsOpen(true);
    };

    const handleConfirm = () => {
        onConfirmCallback();
        setIsOpen(false);
    };

    const handleCancel = () => {
        setIsOpen(false);
    };

    return (
        <DialogContext.Provider value={{ openDialog }}>
            {children}
            <ConfirmationDialog
                isOpen={isOpen}
                {...dialogConfig}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </DialogContext.Provider>
    );
};
