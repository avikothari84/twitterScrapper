// function to register a new user
export async function register(data) {
    // send a POST request to the server with the specified data
    return fetch('http://localhost:8000/v1/register/', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        // stringify the data and set it as the body of the request
        body: JSON.stringify(data)
    })
        .then(function (res) { 
            // return an object with the response message and status code
            return {'message':res.json(),'status':res.status}; 
        })
}

// function to login an existing user
export async function login(data) {
    // send a POST request to the server with the specified data
    return fetch('http://localhost:8000/v1/login/', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(function (res) { 
            // return the response message as a JSON object
            return res.json(); 
        })
}