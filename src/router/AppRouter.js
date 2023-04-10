import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Explore from "../pages/explore";
import Artist from "../pages/artists";
import Album from "../pages/albums";
import Playlist from "../pages/playlists";
import Header from '../pages/header';
import Footer from "../pages/footer";

class AppRouter extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Header />
                <div className="main">
                    <Routes>
                        <Route exact path="/" element={<Explore />} />
                        <Route exact path="/artist/:id" element={<Artist />} />
                        <Route exact path="/album/:id" element={<Album />} />
                        <Route exact path="/playlists" element={<Playlist />} />
                    </Routes>
                </div>
                <Footer />
            </BrowserRouter>
        );
    }
}
export default AppRouter;