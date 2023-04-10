import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
  const navigateTo = useNavigate();

  const [loading, setLoading] = useState(true);

  const citations = [
    {
      citation: "La musique est une révélation plus haute que toute sagesse et toute philosophie.",
      nom: "Ludwig van Beethoven"
    },
    {
      citation: "La musique est l'art le plus direct, l'expression la plus directe de l'âme.",
      nom: "Leonard Bernstein"
    },
    {
      citation: "La musique est une langue universelle qui transcende les frontières et les cultures.",
      nom: "Herbie Hancock"
    },
    {
      citation: "La musique est la force la plus puissante du monde, et elle peut nous unir tous en une seule voix.",
      nom: "Richard Guilliatt"
    },
    {
      citation: "La musique est le vin qui remplit la coupe du silence.",
      nom: "Robert Fripp"
    },
    {
      citation: "La musique est la seule chose qui peut nous transporter instantanément à un autre endroit et un autre temps.",
      nom: "Vera Nazarian"
    },
    {
      citation: "La musique est le langage de l'âme.",
      nom: "Max Heindel"
    },
    {
      citation: "La musique est la nourriture de l'amour.",
      nom: "William Shakespeare"
    },
    {
      citation: "La musique est la plus grande communication dans le monde. Même si les gens ne parlent pas la même langue, ils peuvent ressentir la même émotion en écoutant de la musique.",
      nom: "Yusuf Islam"
    },
    {
      citation: "La musique peut changer le monde parce qu'elle peut changer les gens.",
      nom: "Bono"
    },
    {
      citation: "La musique est la clé qui ouvre les portes de l'univers.",
      nom: "Ludwig van Beethoven"
    },
    {
      citation: "La musique est le remède de l'âme fatiguée.",
      nom: "John A. Logan"
    },
    {
      citation: "La musique est la langue des émotions.",
      nom: "Emmanuel Kant"
    },
    {
      citation: "La musique peut changer les vies des gens, elle peut les faire rire, pleurer ou danser.",
      nom: "Ed Sheeran"
    },
    {
      citation: "La musique est le souffle de l'art. Transpirez-le en musique.",
      nom: "Michael Jackson"
    },
    {
      citation: "La musique est la respiration de l'univers qui résonne en chacun de nous.",
      nom: "Yoko Ono"
    }
  ];
  


  function handleArtistClick(idArtist) {
    navigateTo(`/artist/${idArtist}`);
  }
  function handleAlbumClick(idAlbum) {
    navigateTo(`/album/${idAlbum}`);
  }
  function handlePlaylistClick() {
    navigateTo(`/playlists`);
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
  

  const [searchTerm, setSearchTerm] = useState('');
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentArtistPage, setCurrentArtistPage] = useState(1);
  const [currentSongPage, setCurrentSongPage] = useState(1);
  const [totalArtistPages, setTotalArtistPages] = useState(0);
  const [totalSongPages, setTotalSongPages] = useState(0);  


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    fetchAlbums(currentPage);
    fetchArtists(currentArtistPage);
    fetchSongs(currentSongPage);
    fetchPlaylists();
  }, []);

  useEffect(() => {
    fetchAlbums(currentPage);
  }, [currentPage]);
  
  useEffect(() => {
    fetchArtists(currentArtistPage);
  }, [currentArtistPage]);
  
  useEffect(() => {
    fetchSongs(currentSongPage);
  }, [currentSongPage]);

  const fetchAlbums = async () => {
    try {
      let allAlbums = [];
      let page = 1;
      let response = null;

      do {
        response = await axios.get(
          `https://mmi.unilim.fr/~morap01/L250/public/index.php/api/albums?page=${page}`
        );
        allAlbums = [...allAlbums, ...response.data];
        page++;
      } while (response.data.length > 0);

      console.log('Albums:');
      console.log(allAlbums.length);
      setAlbums(allAlbums);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchArtists = async () => {
    try {
      let allArtists = [];
      let page = 1;
      let response = null;

      do {
        response = await axios.get(
          `https://mmi.unilim.fr/~morap01/L250/public/index.php/api/artists?page=${page}`
        );
        allArtists = [...allArtists, ...response.data];
        page++;
      } while (response.data.length > 0);

      console.log('Artistes:');
      console.log(allArtists.length);
      setArtists(allArtists);
    } catch (error) {
      console.log(error);
    }
  };
  
  
  const fetchSongs = async () => {
    try {
      let allSongs = [];
      let page = 1;
      let response = null;

      do {
        response = await axios.get(
          `https://mmi.unilim.fr/~morap01/L250/public/index.php/api/songs?page=${page}`
        );
        allSongs = [...allSongs, ...response.data];
        page++;
      } while (response.data.length > 0);

      console.log('Songs:');
      console.log(allSongs.length);
      setSongs(allSongs);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPlaylists = async () => {
    let allPlaylists = [];
    let id = 1;
    let hasMore = true;

    while (hasMore) {
      const playlist = await getPlaylist(id);
      
      if (playlist) {
        allPlaylists.push(playlist);
        id++;
      } else {
        hasMore = false;
      }
    }
    setPlaylists(allPlaylists);
  };

  const getPlaylist = async (id) => {
    try {
      const response = await fetch(`https://mmi.unilim.fr/~morap01/L250/public/index.php/api/playlists/${id}`);
      if (!response.ok) {
        return null;
      }
      const playlist = await response.json();
      return playlist;
    } catch (error) {
      console.error("Erreur lors de la récupération de la playlist :", error);
      return null;
    }
  }


  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleArtistNext = () => {
    setCurrentArtistPage(currentArtistPage + 1);
  };

  const handleArtistPrevious = () => {
    if (currentArtistPage > 1) {
      setCurrentArtistPage(currentArtistPage - 1);
    }
  };

  const handleSongNext = () => {
    setCurrentSongPage(currentSongPage + 1);
  };

  const handleSongPrevious = () => {
    if (currentSongPage > 1) {
      setCurrentSongPage(currentSongPage - 1);
    }
  };


  const filteredAlbums = albums
    ? albums.filter((album) =>
      album.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const filteredArtists = artists
    ? artists.filter((artist) =>
      artist.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];
  
  const filteredPlaylists = playlists
  ? playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  : [];

  const filteredSongs = songs
    ? songs.filter((song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];
    const index = Math.floor(Math.random() * citations.length); // Sélectionne un index aléatoire
    const citation = citations[index]; // Récupère la citation correspondante

  return (
    <div>
    {loading ? (
      <div className="loader">Chargement de notre catalogue...<br /><span className='citations'>{citation.citation}<br />{citation.nom}</span></div>
    ) : (
    <div className='exploreDiv'>
      
      <div className='homeSearch'>
        <label id="searchbarLabel" htmlFor="searchbar">Écoutez sans interruption</label>
        <input id="searchbar" placeholder='Rechercher un album, un son, un artiste, une playlist...' name="searchbar" type="search" value={searchTerm} onChange={handleSearch} />
      </div>

      <div className='container'>
        <h2>Albums</h2>
        <div className='albumsDisplay'>
          {filteredAlbums.map((album) => (
            <div className='albumSelect' onClick={() => handleAlbumClick(album.id)} key={album.id}>
              <img src={album.image}></img>
              <h3>{album.title}</h3>
              <p>{album.songs.length + " Titres - " + album.albumtype.name}</p>
            </div>
          ))}
        </div>
        <div className='pagination'>
          <p>Page {currentPage} sur {totalPages}</p>
          <button onClick={handlePrevious} disabled={currentPage <= 1}>&#8249;</button>
          <button onClick={handleNext} disabled={currentPage >= totalPages}>&#8250;</button>
        </div>
      </div>

      <div className='container'>
        <h2>Artistes</h2>
        <div className='albumsDisplay'>
          {filteredArtists.map((artist) => (
            <div className='albumSelect' onClick={() => handleArtistClick(artist.id)} key={artist.id}>
              <div className='pp'>
                <img className='ppImg' src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"></img>
              </div>

              <h3>{artist.name}</h3>
            </div>
          ))}
        </div>
        <div className='pagination'>
          <button onClick={handleArtistPrevious} disabled={currentArtistPage <= 1}>&#8249;</button>
          <button onClick={handleArtistNext} disabled={currentArtistPage >= totalArtistPages}>&#8250;</button>
          <p>Page {currentArtistPage} sur {totalArtistPages}</p>
        </div>
      </div>

      <div className='container'>
        <h2>Playlists</h2>
        <div className='albumsDisplay'>
          {filteredPlaylists.map((playlist) => (
            <div className='albumSelect' onClick={() => handlePlaylistClick(playlist.id)} key={playlist.id}>

              <h3>{playlist.name}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className='container'>
        <h2>Songs</h2>
        <table>
          <thead>
            <tr>
              <th align='left'>#</th>
              <th align='left'>Title</th>
              <th align='left'>Artist</th>
              <th align='left'>Duration</th>
            </tr>
          </thead>
          <tbody>
            {filteredSongs.map((song, index) => (
              <tr key={song.id}>
                <td>{index + 1}</td>
                <td onClick={() => handleSongClick("iframe" + song.id, song.youtube)}>{song.title}</td>
                <td>{song.artist}</td>
                <td>{song.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='pagination'>
          <button onClick={handleSongPrevious} disabled={currentSongPage <= 1}>&#8249;</button>
          <button onClick={handleSongNext} disabled={currentSongPage >= totalSongPages}>&#8250;</button>
          <p>Page {currentSongPage} sur {totalSongPages}</p>
        </div>
      </div>
      </div>
      )}
    </div>
  );
};

export default Explore;
