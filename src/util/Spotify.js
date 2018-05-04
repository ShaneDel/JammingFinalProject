const clientID = 'f6959e42f70541468bea7530b435bc13';
const redirectURI = 'http://jamitup.surge.sh/';

let accessToken = '';
let expiresIn = '';

const Spotify = {
    getAccessToken() {
        if (accessToken !== '') {
            return accessToken;
        }
        const isAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const isExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

        if (isAccessToken && isExpiresIn) {
            accessToken = isAccessToken[1];
            expiresIn = isExpiresIn[1];
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
        } else {
            window.open(`https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=token&scope=playlist-modify-public`, "_self");
        }
    },

    search(term) {
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else { console.log('Request failed') }
        }).then(jsonResponse => {
            if (jsonResponse.tracks) {
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri,

                }))
            } else { return [] }
        })
    },

    savePlaylist(playlistName, trackURIs) {
        if (!playlistName && !trackURIs) {
            return;
        }

        let accessToken = this.getAccessToken();
        let user_id = '';
        let headers = { Authorization: `Bearer ${accessToken}` }

        return fetch('https://api.spotify.com/v1/me', { headers: headers }).then(response => {
            if (response.ok) {

                return response.json();
            } else { console.log('Request failed') }
        }).then(jsonResponse => {
            user_id = jsonResponse.id
            return fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ name: playlistName })
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else { console.log('Request failed') }
            }).then(jsonResponse => {
                const playlist_id = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ uris: trackURIs })
                });
            });
        });
    },
};

export default Spotify;