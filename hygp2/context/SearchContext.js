import { createContext } from 'react';

const SearchContext = createContext({
  teams: [],
  setTeams: () => {},
  searchText: '',
  setSearchText: () => {},
});

export default SearchContext;
