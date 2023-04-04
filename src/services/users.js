export async function getSavedFiles(token) {
    // Make a GET request to the '/v1/users/' endpoint
    // with the provided token in the Authorization header
    return fetch('http://localhost:8000/v1/users/', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
        // Return the response as JSON
        .then(function (res) { return res.json(); })
}

export async function addFile(token, filename) {
    // Make a POST request to the '/v1/users/addFile/{filename}' endpoint
    // with the provided token in the Authorization header
    return fetch('http://localhost:8000/v1/users/addFile/' + filename, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
        .then(function (res) { return res.json(); })
}

export async function removeFile(token, filename) {
    // Encode the filename for use in the URL
    var url = 'http://localhost:8000/v1/users/removeFile/' + encodeURIComponent(filename)
    // Make a POST request to the '/v1/users/removeFile/{encodedFilename}' endpoint
    // with the provided token in the Authorization header
    return fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
        .then(function (res) { return res.json(); })
}

export async function login(token, filename) {
    // Make a POST request to the '/v1/users/removeFile/{filename}' endpoint
    // with the provided token in the Authorization header
    return fetch('http://localhost:8000/v1/users/removeFile/' + filename, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
            // Return the response as JSON

        .then(function (res) { return res.json(); })
}

export async function userDetails(token) {
    // Make a POST request to the '/v1/users/removeFile/{filename}' endpoint
    // with the provided token in the Authorization header
    return fetch('http://localhost:8000/v1/users/', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
            // Return the response as JSON

        .then(function (res) { return res.json(); })
}