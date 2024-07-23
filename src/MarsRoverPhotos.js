import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './MarsRoverPhotos.css';

const API_URL_BASE = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos';
const API_KEY = '5a8eeoqisxw1hQZuLMKAk1j0BMiEXtPzt6aXG2Wa';

const MarsRoverPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL_BASE}?sol=1000&page=${currentPage}&api_key=${API_KEY}`);
        const newPhotos = response.data.photos.map(photo => ({
          ...photo,
          id: uuidv4()
        }));
        setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
      } catch (error) {
        console.error('Error fetching photos: ', error);
      }
      setLoading(false);
    };

    fetchPhotos();
  }, [currentPage]);

  const loadMorePhotos = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const openModal = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <div>
      <h1>Mars Rover Photos</h1>
      <div className="photos-container">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-item" onClick={() => openModal(photo)}>
            <img src={photo.img_src} alt={photo.camera.full_name} />
            <div className="overlay">
              <p>{photo.camera.full_name}</p>
              <p>{photo.rover.name}</p>
            </div>
          </div>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {!loading && (
        <button className="load-more-button" onClick={loadMorePhotos} disabled={loading}>
          Load More Photos
        </button>
      )}
      {selectedPhoto && (
        <div className={`modal ${selectedPhoto ? 'visible' : ''}`} onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <img src={selectedPhoto.img_src} alt={selectedPhoto.camera.full_name} className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MarsRoverPhotos;
