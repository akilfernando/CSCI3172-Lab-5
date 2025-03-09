// Async function to search for music based on user input
async function searchMusic() {
    // Get the search term and search type (artist, album, song) from the form
    const query = document.getElementById("query").value;
    const type = document.getElementById("searchType").value;

    // If no query is entered, show an alert and stop execution
    if (!query) {
        alert("Please enter a search term.");
        return;
    }

    // Fetch data from the server API based on the search type and query
    const response = await fetch(`/api/search/${type}?query=${query}`);
    const data = await response.json();

    // Initialize the HTML for displaying results
    let resultHtml = "";

    // If no results are found, show a message indicating that
    if (data.length === 0) {
        resultHtml = "<p>No results found.</p>";
    } else {
        // Otherwise, loop through the results and display them in an unordered list
        resultHtml = "<ul>";
        data.forEach(item => {
            // Handle the display for artist results
            if (type === "artist") {
                resultHtml += `
                    <li>
                        <strong>${item.name}</strong>
                        <br>Area: ${item.area}
                        <br>Genres: ${item.genres}
                    </li>
                `;
            } 
            // Handle the display for album results
            else if (type === "album") {
                resultHtml += `<li><strong>${item.title}</strong> by ${item["artist-credit"]?.[0]?.name || "Unknown Artist"}</li>`;
            } 
            // Handle the display for song results
            else if (type === "song") {
                resultHtml += `<li><strong>${item.title}</strong> - ${item["artist-credit"]?.[0]?.name || "Unknown Artist"}</li>`;
            }
        });
        resultHtml += "</ul>";
    }

    // Insert the result HTML into the result div on the page
    document.getElementById("result").innerHTML = resultHtml;
}