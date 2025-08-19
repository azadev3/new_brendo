import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrlInf } from '../../InfluencerBaseURL';
import { useParams } from 'react-router-dom';

const CollectionContext = createContext<any>(null);

export const CollectionProvider = ({ children }: any) => {
  const [collections, setCollections] = useState([]);
  const { lang = 'ru' } = useParams();

  useEffect(() => {
    const userStr = localStorage.getItem('user-info');
    const user = userStr ? JSON.parse(userStr) : null;
    const token = user?.token;

    axios
      .get(`${baseUrlInf}/collections`, {
        headers: { Authorization: `Bearer ${token}`, 'Accept-Language': lang },
      })
      .then(res => setCollections(res.data?.data))
      .catch(console.error);
  }, [lang]);

  return (
    <CollectionContext.Provider value={{ collections, setCollections }}>
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollections = () => useContext(CollectionContext);
