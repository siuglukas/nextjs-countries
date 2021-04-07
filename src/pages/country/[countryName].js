import GoogleMaps from "../../components/GoogleApis/GoogleMaps";
import GooglePlacesApi from "../../components/GoogleApis/GooglePlacesApi";
import CountryParameter from "../../components/CountryParameter";
import anthemsJSON from "../../../public/anthems.json";
import GoBackButton from "./../../components/Buttons/GoBackButton";
import HomeButton from "./../../components/Buttons/HomeButton";
import BorderCountries from "../../components/BorderCountries";
import Anthem from "../../components/Anthem";
import Header from "../../components/Header";

import React from "react";
import Link from "next/link";
import Head from "next/head";

import { useRouter } from "next/router";

function CountryDetails({ allCountries, photoUrls, anthemUrl }) {
  //From 1000000 to 1,000,000
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const { countryName } = useRouter().query;

  const getCountry = allCountries.filter(
    (country) => country.name === countryName
  );

  const displayCountry = getCountry.map((country) => {
    const [lat, lng] = country.latlng;
    const bordersArray = country.borders.map((border) =>
      allCountries.filter((country) => country.alpha3Code === border)
    );

    const countryBorders = bordersArray.map((borderCountry) => (
      <Link
        className="button"
        key={borderCountry[0].name}
        href={`/country/${borderCountry[0].name}`}
      >
        <button
          aria-label="border country"
          key={borderCountry[0].name}
          className="button"
        >
          {borderCountry[0].name}
        </button>
      </Link>
    ));

    const currencies = country.currencies.map((currency) => {
      return currency.name;
    });

    const languages = country.languages.map((language) => {
      return language.name;
    });

    const topLevelDomain = country.topLevelDomain.join(", ");

    return (
      <React.Fragment key={country.name}>
        <Head>
          <title>{country.name}</title>
          <link
            rel="icon"
            type="image/jpg"
            href={`https://www.countryflags.io/${country.alpha2Code}/flat/32.png`}
          />
        </Head>
        <div className="country-details">
          <div
            style={{ backgroundImage: `url(${country.flag})` }}
            className="country-details__flag"
          ></div>
          <div className="country-details__content-flex-i">
            <h3 className="country-details__country-name">{country.name}</h3>
            <div className="country-details__parameters-wrapper">
              <div className="country-details__param-first-col">
                <CountryParameter
                  static="Native Name: "
                  dynamic={country.nativeName}
                />
                <CountryParameter
                  static="Capital: "
                  dynamic={country.capital}
                />
                <CountryParameter
                  static="Population: "
                  dynamic={
                    country.population
                      ? numberWithCommas(country.population)
                      : ""
                  }
                />
                <CountryParameter
                  static="Area: "
                  dynamic={
                    country.area ? `${numberWithCommas(country.area)} km²` : ""
                  }
                />
                <CountryParameter static="Region: " dynamic={country.region} />
                <CountryParameter
                  static="Sub Region: "
                  dynamic={country.subregion}
                />
              </div>
              <div className="country-details__param-second-col">
                <CountryParameter
                  static="Top Level Domain: "
                  dynamic={topLevelDomain}
                />
                <CountryParameter
                  static="Currencies: "
                  dynamic={currencies.join(", ")}
                />
                <CountryParameter
                  static="Languages: "
                  dynamic={languages.join(", ")}
                />
              </div>
            </div>
            <BorderCountries countryBorders={countryBorders} />
            <Anthem anthemUrl={anthemUrl} />
          </div>
        </div>
        <GoogleMaps
          lat={lat}
          lng={lng}
          countryName={country.name}
          countryArea={country.area}
        />
      </React.Fragment>
    );
  });

  return (
    <>
      <Header />
      <div className="app-wrapper">
        <GoBackButton />
        <HomeButton />
        {displayCountry}
        <GooglePlacesApi photoUrls={photoUrls} />
      </div>
    </>
  );
}
export default CountryDetails;

export async function getStaticProps(context) {
  const countriesFetch = await fetch("https://restcountries.eu/rest/v2");
  const allCountries = await countriesFetch.json();

  // ========
  // Images from Google API.
  // ========

  const photoUrls = [];
  const apiKey = process.env.NEXT_SERVER_GOOGLE;
  const countryName = context.params.countryName;

  // Getting the placeID
  const placeIdFetch = await fetch(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      countryName
    )}&inputtype=textquery&fields=place_id&key=${apiKey}`
  );
  const placeIDJson = await placeIdFetch.json();

  if (placeIDJson.status === "OK") {
    const placeID = placeIDJson.candidates[0].place_id;

    // With placeId we can request all photo_references for a place.
    const placeAllPhotosFetch = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&fields=photo&key=${apiKey}`
    );

    const photoIdsArray = [];

    const placeAllPhotosJson = await placeAllPhotosFetch.json();
    if (placeAllPhotosJson.result.photos) {
      placeAllPhotosJson.result.photos.map((obj) => {
        // placeAllPhotosJson returns one big object, so we parse it and put all the photo_reference ids into the array.
        photoIdsArray.push(obj.photo_reference);
      });
    }

    // With the array that has photo_reference ids we can get the url for each photo.
    await Promise.all(
      photoIdsArray.map((photoId) =>
        fetch(
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=400&photoreference=${photoId}&key=${apiKey}`
        )
          .then((response) => response.url)
          .catch((err) => console.error(err))
      )
    ).then((allPhotoUrls) =>
      allPhotoUrls.forEach((photoUrl) => photoUrls.push(photoUrl))
    );
  }

  // ========
  // Find anthem URL to put in <audio/> src attribute.
  // ========

  let countryNameForAnthem;
  let splitUrlBy = 79;
  let anthemUrl = "None";

  // When country names from the CDN don't match with names provided by the API.
  switch (countryName) {
    case "United States of America":
      countryNameForAnthem = "united-states";
      break;
    case "Holy See":
      countryNameForAnthem = "vatican-city";
      break;
    case "United Kingdom of Great Britain and Northern Ireland":
      countryNameForAnthem = "united-kingdom";
      break;
    case "Macedonia (the former Yugoslav Republic of)":
      countryNameForAnthem = "north-macedonia";
      break;
    case "Gambia":
      countryNameForAnthem = "the-gambia";
      break;
    case "Timor-Leste":
      countryNameForAnthem = "east-timor";
      break;
    case "Côte d'Ivoire":
      countryNameForAnthem = "cote-divoire";
      break;
    case "Congo (Democratic Republic of the)":
      countryNameForAnthem = "democratic-republic-of-the-congo";
      break;
    case "Bahamas":
      countryNameForAnthem = "the-bahamas";
      break;
    case "Italy":
      countryNameForAnthem = "inno-di-mameli-lyrics-music-goffredo-italy";
      splitUrlBy = 50;
      break;
    case "Australia":
      countryNameForAnthem =
        "advance-australia-fair-sydney-philharmonia-choir-australian";
      splitUrlBy = 50;
      break;
    case "Canada":
      countryNameForAnthem = "o-canada-version-canadian";
      splitUrlBy = 50;
      break;
    case "Greece":
      countryNameForAnthem =
        "anthem-version-cyprus-greece-turkey-turkish-cypriots";
      splitUrlBy = 50;
      break;
    case "Cyprus":
      countryNameForAnthem =
        "anthem-version-cyprus-greece-turkey-turkish-cypriots";
      splitUrlBy = 50;
      break;
    case "Korea (Republic of)":
      countryNameForAnthem = "anthem-south-korea";
      splitUrlBy = 50;
      break;
    case "Bolivia (Plurinational State of)":
      countryNameForAnthem = "bolivia";
      break;
    case "Brunei Darussalam":
      countryNameForAnthem = "brunei";
      break;
    case "Lao People's Democratic Republic":
      countryNameForAnthem = "laos";
      break;
    case "Micronesia (Federated States of)":
      countryNameForAnthem = "micronesia";
      break;
    case "Moldova (Republic of)":
      countryNameForAnthem = "moldova";
      break;
    case "Republic of Kosovo":
      countryNameForAnthem = "kosovo";
      break;
    case "Russian Federation":
      countryNameForAnthem = "russia";
      break;
    case "Syrian Arab Republic":
      countryNameForAnthem = "syria";
      break;
    case "Tanzania, United Republic of":
      countryNameForAnthem = "tanzania";
      break;
    case "Venezuela (Bolivarian Republic of)":
      countryNameForAnthem = "venezuela";
      break;
    case "Viet Nam":
      countryNameForAnthem = "vietnam";
      break;
    default:
      // E.G
      //From: United Kingdom
      //To: united-kingdom
      countryNameForAnthem = countryName.split(" ").join("-").toLowerCase();
  }

  anthemsJSON.map((url) => {
    // From full url getting only the name part.
    // E.G
    // From: https://cdn.britannica.com/44/145644-005-3286B266/instrumental-national-anthem-United-States.mp3
    // To: united-states
    const countryNameFromUrl = url
      .substring(splitUrlBy)
      .split(".")[0]
      .toLowerCase();
    if (countryNameForAnthem === countryNameFromUrl) {
      anthemUrl = url;
    }
  });

  return {
    props: {
      allCountries,
      photoUrls,
      anthemUrl,
    },
  };
}

export const getStaticPaths = async () => {
  const countriesFetch = await fetch(`https://restcountries.eu/rest/v2/all`);

  const allCountries = await countriesFetch.json();

  const countryNames = allCountries.map((country) => country.name);
  const paths = countryNames.map((countryName) => ({
    params: { countryName: countryName.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};
