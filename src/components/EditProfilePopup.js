import React from "react";
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";

function EditProfilePopup ({isOpen, onClose, onUpdateUser})  {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen])

  const onChangeName = (event) => {
    setName(event.target.value)
  }
  const onChangeDescription = (event) => {
    setDescription(event.target.value)
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdateUser({
      name,
      about: description,
    })
  }

	return (
    <PopupWithForm
      title="Редактирование профиля"
      name="profile"
      submitText="Сохранить"
			onSubmit = {handleSubmit}
      isOpen={isOpen}
  		onClose={onClose}
    >
      <input
        onChange={onChangeName}
				value={name || ""}
				type="text"
        className="popup__input"
        name="name"
        id="input-popup-title"
        placeholder="Имя"
        minLength={2}
        maxLength={40}
        required
      />
      <span className="popup__error-message input-popup-title-error" />
      <input
				onChange={onChangeDescription}
				value={description || ""}
        type="text"
        className="popup__input"
        name="about"
        id="input-popup-subtitle"
        placeholder="Вид деятельности"
        minLength={2}
        maxLength={200}
        required
      />
      <span className="popup__error-message input-popup-subtitle-error" />
    </PopupWithForm>
  );
}

export default EditProfilePopup