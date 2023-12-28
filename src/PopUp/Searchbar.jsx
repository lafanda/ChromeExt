import React, { useEffect, useState } from 'react';
import './styles.css'

import axios from 'axios';

const Searchbar = () => {
  const [query, setQuery] = useState('');
  const [shows, setShows] = useState([]);
  //const navigate = useNavigate();

  useEffect(() => {
    const fetchExactData = async () => {
      try {
        if (query.trim() === '') {
          setShows([]); 
          return;
        }
        const options = {
          method: 'GET',
          url: `https://imdb-search2.p.rapidapi.com/${query}`,
          headers: {
            'X-RapidAPI-Key': 'a297f08b6dmshf0db367767dc0d6p1bb837jsndfc650bf082b',
            'X-RapidAPI-Host': 'imdb-search2.p.rapidapi.com'
          }
        };
        const response = await axios.request(options);
  
        // Check if results array is empty or not available in the response data
        if (!Array.isArray(response.data.description) || response.data.description.length === 0) {
          setShows([]); // Set shows to an empty array
        } else {
          setShows(response.data); // Update shows with the response data
        }
      } catch (error) {
        console.error(error);
        setShows([]); // Handle error by clearing the shows array
      }
    };
  
    fetchExactData();
  }, [query]);  

  return (
    <div className="MainContainer" >
      <input style={{ fontSize: '20px', borderRadius: '8px'}} placeholder = 'search'className="searchBar" type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="searchResultsContainer">
        {query.trim() === '' ? (
          <></>
        ) : (
          <>
            {shows.length === 0 ? (
              <p>Searching..</p>
            ) : (
              shows.description.map((show) => (
            
                <a href={`/details.html?id=${show['#IMDB_ID']}&url=${show['#IMDB_URL']}&img=${show['#IMG_POSTER']}&title=${show['#TITLE']}&rank=${show['#RANK']}`}  key={show['#IMDB_ID']} className="searchResults" style={{ display: 'flex', paddingTop: '20px', textDecoration: 'none', color: 'black'}}>
                  <img className="thumbnail"src={show['#IMG_POSTER']} alt="" style={{ width: '80px', marginRight: '5px', border: 'solid' }} />
                  <strong className="searchTitle" style = {{margin: 'auto 0 ', fontSize: '16px', }}>{show['#TITLE']}</strong>
                </a>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
  
};

export default Searchbar;
