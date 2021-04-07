function FilterButton(props) {
  return (
    <>
      <li>
        <button
          onClick={() => {
            props.setFilter(props.name);
            props.setFilterByButton(false);
          }}
          type="button"
          className="control__li-butt"
          aria-pressed={props.isPressed}
          aria-label={`filter by ${props.name}`}
        >
          {props.name}
        </button>
      </li>
    </>
  );
}

export default FilterButton;
