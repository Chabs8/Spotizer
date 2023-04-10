    import { useState, useEffect } from 'react';
    import axios from 'axios';
    import { useParams } from 'react-router-dom';
    
    const Artists = () => {
    const { id } = useParams();
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);

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
        const fetchAlbums = async () => {
        try {
            const response = await axios.get(
            `https://mmi.unilim.fr/~morap01/L250/public/index.php/api/albums/${id}`
            );
            setAlbums(response.data);
            const artistPromises = response.data.artist.map(artist => {
              return axios.get(`https://mmi.unilim.fr/${artist}`);
            });
            const artistResponses = await Promise.all(artistPromises);
            const artistsData = artistResponses.map(response => response.data);
            setArtists(artistsData);
            console.log("Hi" + response.data);
        } catch (error) {
            console.log(error);
        } 
        };
        fetchAlbums();
    }, [id]);



    return (
        <div className='exploreDiv'>
          {albums && (
            <div>
              <div className='headeralbum'>
                <div>
                  <img src={albums.image}></img>
                </div>
                <div className=''>
                  <p className='albumname'>Album</p>
                  <p className='albumtitle'>{albums.title}</p>
                  <div>
                  {albums.albumtype && albums.artist &&(
                    <p>{albums.artist.id + " - " + albums.albumtype.name + " - " + albums.songs.length +" titres"}</p>
                  )}
                  </div>
                </div>
              </div>
              <table>
                <thead>
                      <tr>
                        <th align='left'>#</th>
                        <th align='left'>Title</th>
                        <th align='left'>Duration</th>
                      </tr>
                </thead>
                <tbody>
              {albums.songs && (
                albums.songs.map((song, index) => (
                    
                      <tr>
                        <td>{index + 1}</td>
                        <td onClick={() => handleSongClick("iframe"+song.id, song.youtube)} >{song.title}</td>
                        <td>{song.length}</td>
                      </tr>
                ))
              )}
              </tbody>
            </table>
            </div>
          )}
        </div>
      );
      
    };

    export default Artists;
