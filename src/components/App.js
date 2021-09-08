import React from "react";
import Header from "./Header";
import Main from "./Main";
import {Route, Switch, useHistory} from 'react-router-dom';
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import CurrentUserContext from "../contexts/CurrentUserContext";
import AddPlacePopup from "../components/AddPlacePopup";
import EditProfilePopup from "../components/EditProfilePopup";
import EditAvatarPopup from "../components/EditAvatarPopup";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import * as auth from "../utils/auth"
import done from "../images/done.svg";
import fail from "../images/fail.svg";

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
	const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
	const [userEmail, setUserEmail] = React.useState('');
  const [isInfoTooltipOpen, setInfoTooltipOpen] = React.useState({ opened: false, success: false });
  const [currentPath, setCurrentPath] = React.useState('/')
  const history = useHistory();

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
		setInfoTooltipOpen({ opened: false, success: false})
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

	const handlePathChange = (newPath) => {
		setCurrentPath(newPath);
	 }

	// Проверка токена:
	React.useEffect(() => {
    auth.tokenCheck(localStorage.getItem('token'))
    .then(result => {
      if (result) {
        setUserEmail(result.data.email);
        setLoggedIn(true);
        history.push('/');
        setCurrentPath('/');
      } else {
        throw new Error ('Ошибка текущего сеанса. Необходимо заново авторизироваться')
      }
    })
    .catch (err => {
      console.log(`Ошибка входа по токену ${err}`);
      history.push('/sign-in');
    })
  }, [])

	 // Обработчик завершения:
	 const handleLogout = () => {
		localStorage.removeItem('token');
		setUserEmail('');
		setLoggedIn(false);
		history.push('/sign-in');
		setCurrentPath('/sign-in');
	}

	 // Обработчик регистрации:
	 const handleSignupSubmit = (email, password) => {
		 auth.register (email, password)
		 .then(result => {
			 if (result) {
				 setUserEmail(result.data.email);
				 setInfoTooltipOpen({ opened: true, success: true })
				 setLoggedIn(true);
				 history.push('/sign-in');
				 setCurrentPath('/sign-in');
			 }
			 else {
				 throw new Error('Не удалось пройти регистрацию');
			 }
		 })
		 .catch( err => {
		 console.log(`Ошибка регистрацииЖ ${err}`);
		 setInfoTooltipOpen({ opened: true, success: false })
	 })
 }

	 // Обработчик авторизации:
	 const handleSigninSubmit = (email, password) => {
		 auth.authorization (email, password)
		 .then(data => {
			 if (data.token) {
				 localStorage.setItem('token', data.token);
				 setUserEmail(email);
				 setLoggedIn(true);
				 history.push('/');
				 setCurrentPath('/');
			 }
			 else {
				 throw new Error('Не удалось получить токен от сервера');
			 }
		 })
		 .catch( err => {
			 console.log(alert(`Ошибка авторизации ${err}. Проверьте корректность данных`))
	 })
	 }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header
			userEmail={userEmail}
			onLogout={handleLogout}
			path={currentPath} />

			<Switch>
        <Route path='/sign-in'>
          <Login onSignin={handleSigninSubmit} onPathChange={handlePathChange}/>
        </Route>
        <Route path='/sign-up'>
          <Register onSignup={handleSignupSubmit} onPathChange={handlePathChange} />
        </Route>


				<ProtectedRoute path='/'
      		loggedIn={loggedIn}
					component={Main}
        	onEditAvatar={handleEditAvatarClick}
        	onEditProfile={handleEditProfileClick}
        	onAddPlace={handleAddPlaceClick}
        	onCardClick={handleCardClick}
        	onCardLike={handleCardLike}
        	onCardDelete={handleCardDelete}
        	cards={cards}
        	onSubmit={handleAddPlaceSubmit}
				/>
			</Switch>
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

			<InfoTooltip
        isOpen={isInfoTooltipOpen.opened}
        onClose={closeAllPopups}
        statusImage={isInfoTooltipOpen.success ? done : fail}
        title={isInfoTooltipOpen.success ? 'Вы успешно зарегистрировались!':'Что-то пошло не так! Попробуйте ещё раз'} />

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
