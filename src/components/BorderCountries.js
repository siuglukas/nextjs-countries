function BorderCountries(props) {
  return (
    <>
      <div className="country-details__paramater-static country-details--border-countries-param">
        Border Countries:
      </div>
      <div className="country-details__borders-wrap">
        {props.countryBorders.length > 0 ? (
          props.countryBorders
        ) : (
          <div style={{ cursor: "default" }} className="button">
            None
          </div>
        )}
      </div>
    </>
  );
}

export default BorderCountries;
