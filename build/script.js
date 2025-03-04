document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = document.getElementById('query').value;
    const type = document.getElementById('search-type').value;
    const response = await fetch('/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, type })
    });
    const data = await response.json();
    displayResults(data, type);
  });
  
  const displayResults = (data, type) => {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    if (type === 'artist' && data.artists.items.length > 0) {
      data.artists.items.forEach(artist => {
        const artistDiv = document.createElement('div');
        artistDiv.classList.add('result-item');
        artistDiv.innerHTML = `
          <h2>${artist.name}</h2>
          <img src="${artist.images[0]?.url}" alt="${artist.name}">
          <p>Followers: ${artist.followers.total}</p>
          <p>Genres: ${artist.genres.join(', ')}</p>
        `;
        resultsDiv.appendChild(artistDiv);
      });
    } else if (type === 'track' && data.tracks.items.length > 0) {
      data.tracks.items.forEach(track => {
        const trackDiv = document.createElement('div');
        trackDiv.classList.add('result-item');
        trackDiv.innerHTML = `
          <h2>${track.name}</h2>
          <p>Artist: ${track.artists.map(artist => artist.name).join(', ')}</p>
          <p>Album: ${track.album.name}</p>
          <audio controls>
            <source src="${track.preview_url}" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
        `;
        resultsDiv.appendChild(trackDiv);
      });
    } else if (type === 'album' && data.albums.items.length > 0) {
      data.albums.items.forEach(album => {
        const albumDiv = document.createElement('div');
        albumDiv.classList.add('result-item');
        albumDiv.innerHTML = `
          <h2>${album.name}</h2>
          <p>Artist: ${album.artists.map(artist => artist.name).join(', ')}</p>
          <img src="${album.images[0]?.url}" alt="${album.name}">
        `;
        resultsDiv.appendChild(albumDiv);
      });
    } else {
      resultsDiv.innerHTML = '<p>No results found</p>';
    }
  };