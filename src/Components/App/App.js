import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import PlayList from '../Playlist/PlayList';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: '',
      searchResults: [],
      playlistName: '',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  search(term) {
    Spotify.getAccessToken();
    Spotify.search(term).then(searchResults => {this.setState({
      searchResults: searchResults
    })});
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks.concat(track);
    this.setState({ playlistTracks: tracks });
  }

  removeTrack(remove) {
    let updatedPlaylist = this.state.playlistTracks.filter(track => { return track.id !== remove.id });
    this.setState({ playlistTracks: updatedPlaylist });
  }


  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => track.uri );
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({
      searchResults: []
    });
    this.updatePlaylistName('My playlist');
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
            onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack} />
            <PlayList
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
