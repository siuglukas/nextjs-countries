import OutsideClickHandler from "react-outside-click-handler";

function ControlButton(props) {
  return (
    <div
      className={`control ${
        props.name === "filter-by" ? "control--filter-by" : ""
      }`}
    >
      <OutsideClickHandler
        onOutsideClick={() => {
          if (props.action) {
            props.actionUpdate(!props.action);
          }
        }}
      >
        <button
          onClick={() => props.actionUpdate(!props.action)}
          className={`control__button-as-heading  control__button-as-heading--${props.name}`}
          aria-expanded="false"
          aria-controls="section-list"
          aria-label="open menu"
        >
          <span>
            {props.name === "sort-by" ? "Sort By" : "Filter By Region"}
          </span>
          <svg
            className={`control__arrow-down ${
              props.action ? "control__arrow-down--active" : ""
            }`}
            width="13"
            height="10"
            viewBox="0 0 20 10"
          >
            <path
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M1.58.95L10 9.05m8.42-8.1L10 9.05"
            ></path>
          </svg>
        </button>
      </OutsideClickHandler>
      <ul
        className={`control__list-ul control__list-ul--${props.name} ${
          props.action ? "control__list-ul--active" : "control__list-ul--hidden"
        }`}
      >
        {props.list}
      </ul>
    </div>
  );
}

export default ControlButton;
