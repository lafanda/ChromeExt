import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const ShowDetails = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const showId = urlParams.get('id');
  const url = urlParams.get('url');
  const img = urlParams.get('img');
  const title = urlParams.get('title');
  const rank = urlParams.get('rank');
  const [averageRating, setAverageRating] = useState(null);
  const [numVotes, setNumVotes] = useState(null);
  const [episodeIds, setEpisodeIds] = useState([]);
  const [episodeRatings, setEpisodeRatings] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [hoverContent, setHoverContent] = useState(null);

  useEffect(() => {
    const fetchEpisodeIds = async () => {
      try {
        const options = {
          method: 'GET',
          url: `https://moviesdatabase.p.rapidapi.com/titles/series/${showId}`,
          headers: {
            'X-RapidAPI-Key': 'a297f08b6dmshf0db367767dc0d6p1bb837jsndfc650bf082b',
            'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
          },
        };

        const response = await axios.request(options);

        if (!Array.isArray(response.data.results) || response.data.results.length === 0) {
          setEpisodeIds([showId]);
        } else {
          const episodes = response.data.results.map((episode) => episode.tconst);
          setEpisodeIds(episodes);
        }
      } catch (error) {
        console.error(error);
        setEpisodeIds([]);
      }
    };

    fetchEpisodeIds();
  }, [showId]);

  useEffect(() => {
    const fetchEpisodeRatings = async () => {
      try {
        const fetchRatingPromises = episodeIds.map(async (episodeId) => {
          const options = {
            method: 'GET',
            url: `https://moviesdatabase.p.rapidapi.com/titles/episode/${episodeId}`,
            params: { info: 'base_info' },
            headers: {
              'X-RapidAPI-Key': 'a297f08b6dmshf0db367767dc0d6p1bb837jsndfc650bf082b',
              'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
            },
          };
          const response = await axios.request(options);
          return {
            episodeId,
            ratings: response.data,
          };
        });

        const episodeRatings = await Promise.all(fetchRatingPromises);
        setEpisodeRatings(episodeRatings);
      } catch (error) {
        console.error(error);
        setEpisodeRatings([]);
      }
    };

    if (episodeIds.length > 0) {
      fetchEpisodeRatings();
    }
  }, [episodeIds]);

  useEffect(() => {
    const fetchRatings = async () => {
      const options = {
        method: 'GET',
        url: `https://moviesdatabase.p.rapidapi.com/titles/${showId}/ratings`,
        headers: {
          'X-RapidAPI-Key': 'a297f08b6dmshf0db367767dc0d6p1bb837jsndfc650bf082b',
          'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
        },
      };

      try {
        const response = await axios.request(options);
        const { averageRating, numVotes } = response.data.results;
        setAverageRating(averageRating);
        setNumVotes(numVotes);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRatings();
  }, [showId]);

 // ... Rest of the code ...

return (
  <div className="MainContainer">
    <div className="searchResultsContainer">
      {episodeRatings.length === 0 ? (
        <p>loading...</p>
      ) : (
        <div className='body'>
          <div style={{paddingBottom: '2px'}}>
            <img style={{ height: '200px', float: 'left', padding: '0 5px 0 8px'}} src={img} alt="Show Poster" />
            <h1 style={{margin: '0'}}>{title}</h1>
            <h3>Average Rating: {averageRating}</h3>
            <h3>Number of Votes: {numVotes}</h3>
            <h3>IMDB Rank: #{rank}</h3>
            <a style={{ fontSize: '20px' }} href={url} target="_blank" rel="noopener noreferrer">Read Synopsis</a>
          </div>
          <div style={{ paddingTop: '50px', margin: '0' }}>
            <strong style = {{display: 'flex', border: 'solid'}}>
              <p style={{paddingLeft: '10px', margin: '0'}}>0</p>
              <p style={{paddingLeft: '33.1px', margin: '0'}}>1</p>
              <p style={{paddingLeft: '33.1px', margin: '0'}}>2</p>
              <p style={{paddingLeft: '33.1px', margin: '0'}}>3</p>
              <p style={{paddingLeft: '33.1px', margin: '0'}}>4</p>
              <p style={{paddingLeft: '33.1px', margin: '0'}}>5</p>
              <p style={{paddingLeft: '33.1px', margin: '0'}}>6</p>
              <p style={{paddingLeft: '33.1px', margin: '0'}}>7</p>
              <p style={{paddingLeft: '33.1px', margin: '0'}}>8</p>
              <p style={{paddingLeft: '33.1px', margin: '0'}}>9</p>
              <p style = {{paddingLeft: '33.1px', margin: '0',paddingRight: '10px'}}>10</p>
              </strong>
            {episodeRatings.map(({ episodeId, ratings }, index) => {
              const averageRating = ratings.results?.ratingsSummary.aggregateRating || 0;
              const spaces = 41 * averageRating + 10;
              const isHovered = hoveredIndex === index;

              const hoverBoxClass = averageRating < 5 ? 'hover-box-right' : 'hover-box';

              return (
                <p key={episodeId} className="searchTitle" style={{ paddingLeft: `${spaces}px` }}>
                  <span
                    onMouseEnter={() => {
                      setHoveredIndex(index);
                      setHoverContent(
                        <div className={hoverBoxClass}>
                          <p>Episode Number: {index + 1}</p>
                          <p>Episode Title: {ratings.results?.titleText.text}</p>
                          <p>Rating: {averageRating}</p>
                        </div>
                      );
                    }}
                    onMouseLeave={() => {
                      setHoveredIndex(-1);
                      setHoverContent(null);
                    }}
                  >
                    {isHovered && hoverContent && (
                      <span className="hover-container">
                        <span className="hover-content">{hoverContent}</span>
                        <a href={`https://www.imdb.com/title/${ratings.results?.id}/?ref_=ttep_ep1`} target="_blank" className="o-marker">o</a>
                      </span>
                    )}
                    {!isHovered && 'o'}
                  </span>
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  </div>
);

};

export default ShowDetails;
