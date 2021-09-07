import React from "react";
import PopupWithForm from "../components/PopupWithForm";

function AddPlacePopup({ isAddPlacePopupOpen, closeAllPopups, onSubmit }) {
	const [name, setName] = React.useState("");
	const [link, setLink] = React.useState("");

	return (
    <PopupWithForm
      title="Новое место"
      name="place"
      submitText="Добавить место"
      isOpen={isAddPlacePopupOpen}
      onClose={closeAllPopups}
			onSubmit={() => {
				onSubmit({ name, link });
			}}
    >
      <input
        onChange={(event) => {
					setName(event.target.value);
				}}
				value={name}
				type="text"
        id="card-name"
        name="name"
        className="popup__input popup__input_type_name"
        placeholder="Название"
        minLength={2}
        maxLength={30}
        required
      />
      <span className="popup__error-message card-name-error" />
      <input
        onChange={(event) => {
					setLink(event.target.value);
				}}
				value={link}
				type="URL"
        id="link"
        name="link"
        className="popup__input popup__input_type_link-url"
        placeholder="Ссылка на картинку"
        required
      />
      <span className="popup__error-message link-error" />
    </PopupWithForm>
  );
}

export default AddPlacePopup;