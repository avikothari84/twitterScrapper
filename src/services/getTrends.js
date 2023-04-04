// function to get the current trending topics on Twitter for a given location
export async function getTwitterTrends(item) {
    // send a POST request to the server with the specified location
    return fetch('http://localhost:8000/v1/getTrends', {
        method: 'POST',
        // mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(function (res) { 
            // return the response message as a JSON object
            return res.json(); 
        })
}