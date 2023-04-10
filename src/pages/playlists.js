import React, { useState, useEffect } from 'react';

const fetchSongDetails = async (songUrl) => {
  songUrl = `https://mmi.unilim.fr/~morap01/L250/public/index.php` + songUrl;
  try {
    const response = await fetch(songUrl);
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const message = await response.text();
      return { success: false, message };
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des détails de la chanson :", error);
    return { success: false, message: error.message };
  }
};
const PlaylistSongs = ({ songUrls }) => {
  const [songDetails, setSongDetails] = useState([]);
  useEffect(() => {
    const fetchAndDisplaySongDetails = async () => {
      const songDetailsPromises = songUrls.map((songUrl) => fetchSongDetails(songUrl));
      const songDetailsResults = await Promise.all(songDetailsPromises);
      const fetchedSongDetails = songDetailsResults
        .filter((result) => result.success)
        .map((result) => result.data);
      setSongDetails(fetchedSongDetails);
    };

    fetchAndDisplaySongDetails();
  }, [songUrls]);
  return (
    <>
      {songDetails
        .map((song) => `${song.title} (${song.id}) (${song.length} , ${song.youtube})`)
        .join(", ")}
    </>
  );
};


function Form() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [songs, setSongs] = useState([]);
  const [songOptions, setSongOptions] = useState([]);
  const [selectedSongIds, setSelectedSongIds] = useState([]);
  const [formDataList, setFormDataList] = useState([]);
  const [inputFields, setInputFields] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('Créer une playlist');

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(inputFields);

    if (!editMode) {
      // Créer une nouvelle playlist
      const formData = {
        name,
        songs: inputFields.map((inputField) => `/api/songs/${inputField.key}`)
          .filter((iri) => iri),
      };
      const response = await createPlaylist(formData);
      console.log(response);

      if (response.success) {
        setId(response.data.id);
        setFormDataList([...formDataList, response.data]);
        localStorage.setItem('formDataList', JSON.stringify([...formDataList, response.data]));
        alert('Playlist créée avec succès');
      } else {
        console.log(response);
        alert(`Erreur lors de la création de la playlist : ${response.message}`);
      }
    } else {
      // Mettre à jour la playlist existante
      const formData = {
        id,
        name,
        songs: inputFields
          .map((inputField) => `/api/songs/${inputField.key}`)
          .filter((iri) => iri),
      };

      const response = await updatePlaylist(formData);
      console.log(response);
      if (response.success) {
        const updatedPlaylists = formDataList.map((playlist) =>
          playlist.id === formData.id ? formData : playlist
        );
        setFormDataList(updatedPlaylists);
        localStorage.setItem('formDataList', JSON.stringify(updatedPlaylists));
        alert('Playlist mise à jour avec succès');
      } else {
        console.log(response);
        alert(`Erreur lors de la mise à jour de la playlist : ${response.message}`);
      }
      setTitle('Créer une playlist');
      setEditMode(false);
    }

    setId('');
    setName('');
    setInputFields([]);
  };

  const createPlaylist = async (playlist) => {
    console.log(playlist);
    try {
      const response = await fetch('https://mmi.unilim.fr/~morap01/L250/public/index.php/api/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playlist),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return { success: true, data };
      } else {
        const message = await response.text();
        return { success: false, message };
      }
    } catch (error) {
      console.error('Erreur lors de la création de la playlist:', error);
      return { success: false, message: error.message };
    }
  };

  const updatePlaylist = async (playlist) => {
    try {
      const response = await fetch(`https://mmi.unilim.fr/~morap01/L250/public/index.php/api/playlists/${playlist.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playlist),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return { success: true, data };
      } else {
        const message = await response.text();
        return { success: false, message };
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la playlist:', error);
      return { success: false, message: error.message };
    }
  };

  const handleIdChange = (event) => {
    setId(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSongSelect = (event) => {
    const selectedSongId = event.target.value;
    const selectedSong = songOptions.find((song) => song.title === selectedSongId);
    if (selectedSong && !inputFields.some((inputField) => inputField.key === selectedSong.id)) {
      setInputFields([...inputFields, { value: selectedSong.title, key: selectedSong.id }]);
      event.target.value = '';
    }
  };
  const handleSongCheck = (event) => {
    const selectedSongId = event.target.name;
    const selectedSong = songOptions.find((song) => song.id === selectedSongId);
    const newInputFields = inputFields.map((inputField) =>
      inputField.key === selectedSongId ? { ...inputField, value: event.target.value } : inputField
    );
    setInputFields(newInputFields);

    const newSongs = newInputFields.map((inputField) => inputField.value);
    setSongs(newSongs);
  };

  const handleNewInputBlur = (event) => {
    if (!event.target.value) {
      const updatedInputFields = inputFields.filter(
        (inputField) => inputField.key !== event.target.name
      );
      setInputFields(updatedInputFields);
    }
  };

  const handleRemoveInput = (songId) => {
    const updatedInputFields = inputFields.filter(
      (inputField) => inputField.key !== songId
    );
    setInputFields(updatedInputFields);

    const selectedSong = songOptions.find((song) => song.id === songId);
    const newSongs = songs.filter((song) => song !== selectedSong.title);
    setSongs(newSongs);
  };

  // Charger les playlists existantes depuis le localStorage
  useEffect(() => {
    const storedFormDataList = JSON.parse(localStorage.getItem("formDataList"));
    if (storedFormDataList) {
      setFormDataList(storedFormDataList);
    }
  }, []);

  useEffect(() => {
    fetch('https://mmi.unilim.fr/~morap01/L250/public/index.php/api/songs')
      .then(response => response.json())
      .then(data => {
        const options = data.map(song => ({
          id: song.id,
          title: song.title,
          length: song.length,
          youtube: song.youtube
        }));
        setSongOptions(options);
      })
      .catch(error => console.error(error));
  }, []);


  // Fonction pour supprimer une playlist
  const deletePlaylist = (id) => {
    // Suppression dans le localStorage
    const formDataListCopy = formDataList.filter((formData) => formData.id !== id);
    setFormDataList(formDataListCopy);
    localStorage.setItem("formDataList", JSON.stringify(formDataListCopy));
  };

  const handleDeletePlaylist = (id) => {
    // Mettre à jour les playlists dans le localStorage et l'état local
    const updatedPlaylists = formDataList.filter((playlist) => playlist.id !== id);
    setFormDataList(updatedPlaylists);
    localStorage.setItem('formDataList', JSON.stringify(updatedPlaylists));

    // Informer l'utilisateur que la playlist a été supprimée localement, mais pas de l'API
    alert("La playlist a été supprimée localement, mais n'a pas été supprimée de l'API.");
  };

  const handleEditPlaylist = (id) => {
    window.scrollTo(0, 0);
    setTitle('Modifier une playlist');

    const playlistToEdit = formDataList.find((playlist) => playlist.id === id);

    if (playlistToEdit) {
      setId(playlistToEdit.id);
      setName(playlistToEdit.name);
      setInputFields(playlistToEdit.songs.map((songId) => {
        const song = songOptions.find(song => song.id === songId);
        return song ? { value: song.title, key: songId } : { value: `Unknown song (ID: ${songId})`, key: songId };
      }));
      setEditMode(true);
    }
  };

  return (
    <>
      <div className="playlists">
        <form onSubmit={handleSubmit}>
          <h2>{title}</h2>

          <input type="hidden" value={id} onChange={handleIdChange} />
          <div>
            <label htmlFor="name">Nom : </label>
            <input id="name" type="text" value={name} onChange={handleNameChange} />
          </div>

          <div>
            <label>Ajouter des sons : </label>
            <input
              type="text"
              list="songs"
              name="song"
              onChange={handleSongSelect}
              autoComplete="off"
            />
            <datalist id="songs">
              {songOptions.map((song) => (
                <option key={song.id} value={song.title} />
              ))}
            </datalist>
            {inputFields.map((inputField) => (
              <div key={inputField.key} className="selected-song-container">
                <input
                  type="text"
                  key={inputField.key}
                  name={inputField.key}
                  value={inputField.value}
                  onChange={handleSongCheck}
                  onBlur={handleNewInputBlur}
                  className="selected-song-input"
                />
                <button type="button" onClick={() => handleRemoveInput(inputField.key)} className="remove-song-button">Supprimer</button>
              </div>
            ))}
          </div>

          <button type="submit">Enregistrer</button>
        </form>

        <div>
          <h2>Vos playlists:</h2>
          {formDataList.length > 0 ? (
            <ul>
              {formDataList.map((formData, index) => (
                <li key={index}>
                  <p>ID: {formData.id}</p>
                  <p>Name: {formData.name}</p>
                  <p>
                    Songs: <PlaylistSongs songUrls={formData.songs} />
                  </p>
                  <button onClick={() => handleEditPlaylist(formData.id)}>Modifier</button>
                  <button onClick={() => handleDeletePlaylist(formData.id)}>Supprimer</button>
                </li>
              ))}

            </ul>
          ) : (
            <p>Pas de playlists</p>
          )}
        </div>
      </div >
    </>
  );
}

export default Form;
