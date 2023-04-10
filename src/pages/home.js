import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>Ravi de vous revoir !</h1>
            <nav>
                <ul>
                    <li><Link to="/explore">Explore</Link></li>
                    <li><Link to="/albums">Albums</Link></li>
                    <li><Link to="/playlists">Playlists</Link></li>
                    <li><Link to="/artists">Artistes</Link></li>
                    <li><Link to="/songs">Musiques</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default Home;
