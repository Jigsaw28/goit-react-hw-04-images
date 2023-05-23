import { useState, useEffect } from 'react';
import Notiflix from 'notiflix';
import { Searchbar } from './Searchbar/Searchbar';
import { imagesApi } from 'api/imagesApi';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';

export const App = () => {
  const [searchText, setSearchText] = useState('');
  const [hits, setHits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  useEffect(() => {
    const text = searchText.trim();
    if (searchText) {
      setIsLoading(true);
      imagesApi(text, page)
        .then(({ hits }) => {
          if (hits.length === 0) {
            Notiflix.Notify.failure(
              'Sorry, there are no images matching your search query. Please try again.'
            );
          }
          setHits(prev => [...prev, ...hits]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [page, searchText]);

  const toggleModal = modalImageUrl => {
    setShowModal(prev => !showModal);
    setModalImageUrl(modalImageUrl);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleLoad = () => {
    setPage(prev => prev + 1);
  };

  const handleSearch = searchText => {
    setSearchText(searchText);
    setPage(1);
    setHits([]);
  };

  return (
    <div className="App">
      {showModal && <Modal openModal={modalImageUrl} closeModal={closeModal} />}
      <Searchbar onSubmit={handleSearch} />
      <ImageGallery hits={hits} showModal={toggleModal} />
      <Loader visible={isLoading} />
      {hits.length > 0 && !isLoading && <Button onClick={handleLoad} />}
    </div>
  );
};
