import React, { Component } from 'react';
import { fetchImages } from 'Helpers/Api';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';
import { AppDiv } from './App.syled';
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  state = {
    images: [],
    isLoading: false,
    error: null,
    query: '',
    page: 1,
    showModal: false,
    selectedImage: null,
    isLastPage: false,
  };

  async componentDidUpdate(_prevProps, prevState) {
    if (
      prevState.query !== this.state.query ||
      prevState.page !== this.state.page
    ) {
      this.setState({
        isLoading: true,
      });

      const { query, page } = this.state;
      try {
        const { hits, totalHits } = await fetchImages({
          q: query,
          page: page,
          per_page: 12,
        });
        this.setState(prevState => ({
          images: [...prevState.images, ...hits],
          totalHits,
        }));
      } catch (error) {
        toast.error(error.message);
      } finally {
        this.setState({ isLoading: false });
      }
    }
  }

  handleSearchSubmit = query => {
    if (this.state.query === query) {
      return;
    }

    this.setState({
      query: query,
      page: 1,
      images: [],
      error: null,
      isLastPage: false,
    });
  };

  handleImageClick = image => {
    this.setState({ selectedImage: image, showModal: true });
    document.body.style.overflow = 'hidden';
  };

  handleModalClose = () => {
    this.setState({ selectedImage: null, showModal: false });
    document.body.style.overflow = 'auto';
  };

  handleButtonMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  render() {
    const { images, isLoading, error, showModal, selectedImage, isLastPage } =
      this.state;

    return (
      <AppDiv>
        <ToastContainer transition={Flip} />
        <Searchbar onSubmit={this.handleSearchSubmit} />

        {error && <p>Error: {error}</p>}

        <ImageGallery images={images} onItemClick={this.handleImageClick} />

        {isLoading && <Loader />}

        {!isLoading && images.length > 0 && !isLastPage && (
          <Button onClick={this.handleButtonMore} />
        )}

        {showModal && (
          <Modal image={selectedImage} onClose={this.handleModalClose} />
        )}
      </AppDiv>
    );
  }
}

export default App;
