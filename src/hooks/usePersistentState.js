import { useEffect, useState } from "react";

export default function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(localStorage.getItem(key) || defaultValue);
  useEffect(() => {
    localStorage.setItem(key, state);
  }, [key, state]);
  return [state, setState];
}
