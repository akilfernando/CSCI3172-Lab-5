async function getRecommendations() {
  const artist = document.getElementById("artist").value;
  if (!artist) {
    alert("Please enter an artist name.");
    return;
  }

  const response = await fetch(`/api/recommend?artist=${artist}`);
  const data = await response.json();

  if (data.error) {
    document.getElementById("results").innerHTML = `<p>${data.error}</p>`;
  } else {
    document.getElementById("results").innerHTML = data
      .map(a => `<h3>${a.name}</h3><p>Genre: ${a.genre}</p><img src="${a.image}" width="150">`)
      .join("");
  }
}