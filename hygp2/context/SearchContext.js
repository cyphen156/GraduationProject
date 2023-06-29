import { createContext } from 'react';

const SearchContext = createContext({
  teams: [],
  setTeams: () => {},
  searchText: '',
  setSearchText: () => {},
  recommendedInterest: '',
  setRecommendedInterest: () => {},
});

export default SearchContext;
