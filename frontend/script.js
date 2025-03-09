async function searchMusic() {
    const query = document.getElementById("query").value;
    const type = document.getElementById("searchType").value;

    if (!query) {
        alert("Please enter a search term.");
        return;
    }

    const response = await fetch(`/api/search/${type}?query=${query}`);
    const data = await response.json();

    let resultHtml = "";
    if (data.length === 0) {
        resultHtml = "<p>No results found.</p>";
    } else {
        resultHtml = "<ul>";
        data.forEach(item => {
            if (type === "artist") {
                resultHtml += `<li><strong>${item.name}</strong> (ID: ${item.id})</li>`;
            } else if (type === "album") {
                resultHtml += `<li><strong>${item.title}</strong> by ${item["artist-credit"]?.[0]?.name || "Unknown Artist"}</li>`;
            } else if (type === "song") {
                resultHtml += `<li><strong>${item.title}</strong> - ${item["artist-credit"]?.[0]?.name || "Unknown Artist"}</li>`;
            }
        });
        resultHtml += "</ul>";
    }

    document.getElementById("result").innerHTML = resultHtml;
}