import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import CurrentUserContext from "../contexts/CurrentUserContext";
import AddPlacePopup from "../components/AddPlacePopup";
import EditProfilePopup from "../components/EditProfilePopup";
import EditAvatarPopup from "../components/EditAvatarPopup";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  React.useEffect(() => {
    api
      .getUserInfo()
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  React.useEffect(() => {
    api
      .getInitialCards()
      .then((cards) => {
        setCards(cards);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleCardDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
    		const newCards = cards.filter((item) => {
          return item._id !== card._id;
        });
				setCards(newCards);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
  };

  React.useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeAllPopups();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

	function handleAddPlaceSubmit(card) {
    api
      .addCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
				closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      });
  }

	function handleUpdateUser(userData) {
    api.addProfileInfo(userData)
    .then((data) => {
      setCurrentUser(data)
      closeAllPopups()
    })
    .catch((err) => {
			console.error(err);
		});
  }

	function handleUpdateAvatar(data) {
		api.newAvatar(data)
		.then((item) => {
			setCurrentUser({...currentUser, avatar: item.avatar});
			closeAllPopups();
		})
		.catch((err) => {
			console.error(err);
		});
	}

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header></Header>
      <Main
        onEditAvatar={handleEditAvatarClick}
        onEditProfile={handleEditProfileClick}
        onAddPlace={handleAddPlaceClick}
        onCardClick={handleCardClick}
        onCardLike={handleCardLike}
        onCardDelete={handleCardDelete}
        cards={cards}
        onSubmit={handleAddPlaceSubmit}
      ></Main>
      <Footer></Footer>

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />

      <ImagePopup
        card={selectedCard}
        onClose={() => {
          closeAllPopups();
        }}
      ></ImagePopup>

      <PopupWithForm
        title="Вы уверены?"
        name="confirm"
        submitText="Да"
      ></PopupWithForm>

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
				onUpdateAvatar={handleUpdateAvatar}
      ></EditAvatarPopup>

      <AddPlacePopup
        isAddPlacePopupOpen={isAddPlacePopupOpen}
        closeAllPopups={closeAllPopups}
        onSubmit={handleAddPlaceSubmit}
      ></AddPlacePopup>
    </CurrentUserContext.Provider>
  );
}

export default App;
