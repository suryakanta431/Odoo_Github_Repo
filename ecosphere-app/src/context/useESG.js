import { useContext } from 'react';
import { ESGContext } from './ESGContextValue';

export const useESG = () => useContext(ESGContext);
