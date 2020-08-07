# React-savePlaylist-Spotify

I implemented all the components and logic for this app, it creates a new playlist on you Spotify account, it uses REACT and the Implicit Grant Flow Authorization to get access 

https://developer.spotify.com/documentation/general/guides/authorization-guide/

If you want to have this working on your local host you need to install all the dependencies and use the Spotify Applications Registration Flow

https://developer.spotify.com/my-applications/#!/applications

Get a clientId and place it on the variable `clientId` ./src/util/Spotify.js. however you can find the application working on the next link

http://react-saveplaylist.surge.sh/

There are some songs that you can not preview it, that's because the Spotify API does not have any value on the respective Json response for the preview_url used on this project.

You can check it through the React developer tools.

The component rendering flow would be

App

  * SearchBar 

  *	SearchResults

    *	TrackList

      *	Tracks

  *	Playlist

    *	TrackList

      * Tracks

and  ./src/util/Spotify.js. is in charged of the Api call to Spotify
