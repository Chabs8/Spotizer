import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header>
            <h2><Link to="/">Spotizer</Link></h2>

            <nav>
                <li><Link to="/">Explore</Link></li>
                <li><Link to="/playlists">Playlists</Link></li>
            </nav>
        </header>
    );
}

export default Header;
