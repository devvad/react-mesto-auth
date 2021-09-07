import React from "react";

function PopupWithForm ({isOpen, name, title, children, onClose, submitText, onSubmit}) {
  return (
    <div
      className={
        isOpen
          ? `popup popup_type_${name} popup_opened`
          : `popup popup_type_${name}`
      }
      onClick={() => {
        onClose();
      }}
    >
      <div
        className="popup__container"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <h2 className="popup__name">{title}</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(event);
          }}
          className="popup__form"
          name={name}
        >
          {children}
          <button type="submit" className="popup__button">
            {submitText}
          </button>
        </form>
        <button
          type="button"
          className="popup__closed"
          onClick={() => {
            onClose();
          }}
        />
      </div>
    </div>
  );
}

export default PopupWithForm