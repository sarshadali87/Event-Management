
import { useAppContext } from '../contexts/AppContext';

export const useToast = () => {
  const { showToast } = useAppContext();
  return showToast;
};
