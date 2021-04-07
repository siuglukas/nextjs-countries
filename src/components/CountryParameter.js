function CountryParameter(props) {
  return (
    <p className="country-details__parameter">
      <span className="country-details__paramater-static">{props.static}</span>
      <span className="country-details-parameter-dynamic">
        {props.dynamic ? props.dynamic : "-"}
      </span>
    </p>
  );
}

export default CountryParameter;
