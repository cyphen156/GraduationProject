import { createContext } from 'react';

const TeamContext = createContext({
  teamId: null,
  setTeamId: () => {},
});

export default TeamContext;
