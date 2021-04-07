import Link from "next/link";
import ArrowRight from "./Icons/ArrowRight";
function CountryCard(props) {
  return (
    <article className="card">
      <div
        style={{ backgroundImage: `url(${props.countryFlag})` }}
        className="card__country-flag"
        role="img"
        alt={`flag of ${props.countryName}`}
      ></div>

      <div className="card__content-wrap">
        <h2 className="card__country-name">{props.countryName}</h2>
        <p className="card__country-info">
          <span className="card__heading">Area: </span>
          <span className="card__heading-value">
            {props.countryArea
              ? `${props.numberWithCommas(props.countryArea)} km² `
              : "-"}
          </span>
        </p>
        <p className="card__country-info">
          <span className="card__heading">Population: </span>
          <span className="card__heading-value">
            {props.numberWithCommas(props.countryPopulation)}
          </span>
        </p>
        <p className="card__country-info">
          <span className="card__heading">Region: </span>
          <span className="card__heading-value">
            {props.countryRegion ? props.countryRegion : "-"}
          </span>
        </p>
        <p className="card__country-info">
          <span className="card__heading">Capital: </span>
          <span className="card__heading-value">
            {props.countryCapital ? props.countryCapital : "-"}
          </span>
        </p>
        <p className="card__country-info card__arrow">
          <Link href={`country/${props.countryName}`}>
            <button
              aria-label="Learn more about country"
              className="card__heading card__arrow"
            >
              Learn More
              <ArrowRight />
            </button>
          </Link>
        </p>
      </div>
    </article>
  );
}

export default CountryCard;
