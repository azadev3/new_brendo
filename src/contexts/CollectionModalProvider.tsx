import React, { createContext, useContext, useState } from 'react';

type CollectionModalContextType = {
    createCollectionModal: boolean;
    addProductCollection: boolean;
    productId: number | null;
    setCreateCollectionModal: (open: boolean) => void;
    setAddProductCollection: (open: boolean) => void;
    setProductId: (v: number | null) => void;
};

const CollectionModalContext = createContext<CollectionModalContextType | null>(null);

export const CollectionModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [createCollectionModal, setCreateCollectionModal] = useState<boolean>(false);
    const [addProductCollection, setAddProductCollection] = useState<boolean>(false);
    const [productId, setProductId] = React.useState<number | null>(null);

    return (
        <CollectionModalContext.Provider value={{ createCollectionModal, setCreateCollectionModal, setAddProductCollection, addProductCollection, setProductId, productId }}>
            {children}
        </CollectionModalContext.Provider>
    );
};

export const useCollectionModal = () => {
    const context = useContext(CollectionModalContext);
    if (!context) {
        throw new Error('useCollectionModal must be used within a CollectionModalProvider');
    }
    return context;
};
