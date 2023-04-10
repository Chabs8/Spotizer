import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Artists = () => {
  const { id } = useParams();
  const [artists, setArtists] = useState({});
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const navigateTo = useNavigate();
  function handleAlbumClick(idAlbum) {
      navigateTo(`/album/${idAlbum}`);
  }
  function handleSongClick(idSong, youtubeLink) {
    var videoSong = document.getElementById(idSong);
    if (!videoSong) {
      videoSong = document.createElement('iframe');
      videoSong.className = 'iframe';
      videoSong.id = idSong;
      videoSong.width = '560';
      videoSong.height = '315';
      videoSong.src = youtubeLink;
      videoSong.title = 'YouTube video player';
      videoSong.frameBorder = '0';
      videoSong.allow = 'autoplay;';
      videoSong.allowfullscreen = true;
      videoSong.style.display = 'none'; // Add this line
      document.body.appendChild(videoSong);
    }
    // Hide all other videos
    var allVideos = document.getElementsByClassName('iframe');
    for (var i = 0; i < allVideos.length; i++) {
      allVideos[i].style.display = 'none';
    }
    videoSong.style.display = 'block';
  }

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get(
          `https://mmi.unilim.fr/~morap01/L250/public/index.php/api/artists/${id}`
        );
        setArtists(response.data);
        console.log(response.data);
        const albumPromises = response.data.albums.map(album => {
          return axios.get(`https://mmi.unilim.fr/${album}`);
        });
        const albumResponses = await Promise.all(albumPromises);
        const albumsData = albumResponses.map(response => response.data);
        setAlbums(albumsData);
      // Récupérer les données des chansons de l'artiste
    const songPromises = response.data.songs.map(song => {
      return axios.get(`https://mmi.unilim.fr${song}`);
    });
    const songResponses = await Promise.all(songPromises);
    const songsData = songResponses.map(response => response.data);
    setSongs(songsData);
  } catch (error) {
    console.log(error);
  } 
    };
    fetchArtists();
  }, [id]);

  return (
    <div className='exploreDiv'>
      {artists.songs && (
        <div>
      <h2>{artists.name}</h2>
      <h2>Albums</h2>
      <div className='albumsDisplay'>
      
      {albums.map((album, index) =>(
        <div className='albumSelect' onClick={() => handleAlbumClick(album.id)} key={album.id}>
          <img src={album.image}></img>
          <h3>{album.title}</h3>
          <p>{album.songs.length + " Titres - " + album.albumtype.name}</p>
        </div>
      ))}
      </div>
      <h2>{"Chansons (" + artists.songs.length + " Titres)"}</h2>
      <table>
        <thead>
          <tr>
            <th align='left'>#</th>
            <th align='left'>Title</th>
            <th align='left'>Artiste</th>
            <th align='left'>Duration</th>
          </tr>
        </thead>
        <tbody>
        {songs.map((song, index) => (
              
                <tr>
                  <td>{index + 1}</td>
                  <td onClick={() => handleSongClick("iframe" + song.id, song.youtube)}>{song.title}</td>
                  <td >{artists.name}</td>
                  <td>{song.length}</td>
                </tr>
          ))
        }
        </tbody>
      </table>
      </div>
      )}
    </div>
  );
};

export default Artists;
