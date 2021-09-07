import React from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

function Card({card, onCardClick, onCardLike, onCardDelete}) {
	const currentUser = React.useContext(CurrentUserContext);

	const handleLikeClick = () => {
    onCardLike(card)
  };

	const handleDeleteClick = () => {
    onCardDelete(card)
  };

	const isOwn = card.owner._id === currentUser._id;
	const cardDeleteButtonClassName = (
		`card__delete-icon ${isOwn ? '' : 'card__delete-icon_hidden'}`
	);

	const isLiked = card.likes.some((i) => i._id === currentUser._id);
	const cardLikeButtonClassName = (
		`card__like ${isLiked ? 'card__like_active' : ''}`
	);

	return (
    <li className="card">
      <img
        className="card__image"
        src={card.link}
        alt={card.name}
        onClick={() => {
          onCardClick(card);
        }}
      />
      <div className="card__info">
        <h2 className="card__title">{card.name}</h2>
        <div className="card__like-number">
          <button
            type="button"
            onClick={handleLikeClick}
            className={cardLikeButtonClassName}
          ></button>
          <span className="card__likes-container">{card.likes.length}</span>
        </div>
        <button
          type="button"
          onClick={handleDeleteClick}
          className={cardDeleteButtonClassName}
        ></button>
      </div>
    </li>
  );
}

export default Card;
