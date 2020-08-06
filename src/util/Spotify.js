const clientId = ""
//const redirectUri = "http://localhost:3000/callback/"
const redirectUri = "http://react-savePlaylist.surge.sh"
let accessToken;
export const Spotify = {
    getAccessToken(){
        
        if(accessToken){
            return accessToken;
        }
        //check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if (accessTokenMatch && expiresInMatch){
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1])
            //This clears the parameters, allowing us to grab a new access token when it expires.SearchResults
            window.setTimeout(() => accessToken = '', expiresIn * 1000 );
            window.history.pushState('Access Token', null, '/')
            return accessToken
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location = accessUrl
        }

        
    },
    
    search(userSearch){
        const accessToken = this.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${userSearch}`,{
            headers: {
                Authorization: `Bearer ${accessToken}`} })
        .then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            
            return  jsonResponse.tracks.items.map(track => (
                {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri,
                    preview_url: track.preview_url
                }
            ))
        })
    },
    
    savePlaylist(playlistName, uriTrackArray){
        if(!playlistName || !uriTrackArray.length){
            return;
        }

        const accessToken = this.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};
        let userId;
        
        return fetch(`https://api.spotify.com/v1/me`, {headers: headers})
        .then(response => {
            return response.json();
        })
        .then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: playlistName})
            }).then(response => response.json())
            .then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: uriTrackArray})
                });
            })
        })
    }

}

export default Spotify;