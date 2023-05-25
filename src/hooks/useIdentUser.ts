import { useEffect, useState } from 'react';

const useIdentUser = (username:any) => {
  const [julio, setJulio] = useState(false);

  useEffect(() => {
    const identUser = (username:any) => {
      if (username === "juliusomo") {
        setJulio(true);
      }
    };

    identUser(username);
  }, [username]);

  return julio;
};

export default useIdentUser;
