function SortButton(props) {
  let buttonLabel;
  switch (props.name) {
    case "Alphabetical":
      buttonLabel = "Alphabet";
      break;
    case "Area":
      buttonLabel = "Area";
      break;
    case "PopulationAsc":
      buttonLabel = "Population (High To Low)";
      break;
    case "PopulationDesc":
      buttonLabel = "Population (Low To High)";
      break;
    default:
      buttonLabel = "sort";
  }
  return (
    <>
      <li>
        <button
          onClick={() => {
            props.setSortBy(props.name);
            props.setSortByButton(false);
          }}
          type="button"
          className="control__li-butt"
          aria-pressed={props.isPressed}
          aria-label={`sort by ${props.name}`}
        >
          {buttonLabel}
        </button>
      </li>
    </>
  );
}

export default SortButton;
