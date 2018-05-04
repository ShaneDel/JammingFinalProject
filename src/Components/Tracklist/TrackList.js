import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component {
  render() {
    if (this.props.tracks) {
      return (
        <div className="TrackList">
          {this.props.tracks.map(track => {
            return <Track key={track.id}
              track={track}
              onAdd={this.props.onAdd}
              onRemove={this.props.onRemove}
              isRemoval={this.props.isRemoval} />
          })};
        </div>
      )
    } else {
      return null
    }
  }
}

export default TrackList;