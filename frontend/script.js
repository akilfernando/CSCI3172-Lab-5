async function searchArtist() {
    const artist = document.getElementById("artist").value;
    if (!artist) {
        alert("Please enter an artist name.");
        return;
    }

    const response = await fetch(`/api/search?artist=${artist}`);
    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerHTML = `<p>${data.error}</p>`;
    } else {
        document.getElementById("result").innerHTML = `
            <h2>${data.artist}</h2>
            <p>Country: ${data.country}</p>
            <p>Description: ${data.disambiguation}</p>
        `;
    }
}