// function to get the user's timeline
export async function getUserTimeline(item) {
  // send a POST request to the server with the specified data
  return fetch('http://localhost:8000/v1/getTimeline', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
    .then(function (res) { return res.json(); })

}

// function to search tweets by keyword
export async function getTweetsByKeyword(item) {
  // send a POST request to the server with the specified data
  return fetch('http://localhost:8000/v1/getBySearchQuery', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
    .then(function (res) { return res.json(); })

}

// function to search tweets by hashtag
export async function getTweetsByHashtag(item) {
  // send a POST request to the server with the specified data
  return fetch('http://localhost:8000/v1/getBySearchQuery', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
    .then(function (res) { return res.json(); })

}

// function to get tweets sentiment
export function getTweetsSentiment(filename) {
  // send a GET request to the server with the specified data
  return fetch('http://localhost:8000/v1/sentimentAnalysis/' + filename, {
    method: 'GET',
  })
    .then(function (res) {
      return res.json();
    })
}

// function to get tweets summary
export function getSummary(filename) {
  // send a GET request to the server with the specified data
  return fetch('http://localhost:8000/v1/getSummary/' + filename, {
    method: 'GET',
  })
    .then(function (res) {
      return res.json();
    })
}

// function to download the file
export async function downloadFile(filename) {
  return fetch('http://localhost:8000/v1/download/' + filename)
    .then((response) => response.blob())
    .then((blob) => {
      // Create blob link to download
      const url = window.URL.createObjectURL(
        new Blob([blob]),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        filename,
      );

      // Append to html link element page
      document.body.appendChild(link);

      // Start download
      link.click();

      // Clean up and remove the link
      link.parentNode.removeChild(link);
    });
}