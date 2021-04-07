import ControlButton from "../components/Buttons/ControlButton";
import FilterButton from "../components/Buttons/FilterButton";
import SortButton from "../components/Buttons/SortButton";
import InputBar from "../components/InputBar";
import CountryCard from "../components/CountryCard";
import InfiniteScroll from "react-infinite-scroll-component";
import QueryNotFound from "../components/QueryNotFound";
import Header from "../components/Header";

import Head from "next/head";
import { useState } from "react";

const FILTER_MAP = {
  All: () => true,
  America: (country) => country.region === "Americas",
  Africa: (country) => country.region === "Africa",
  Asia: (country) => country.region === "Asia",
  Europe: (country) => country.region === "Europe",
  Oceania: (country) => country.region === "Oceania",
};

const SORT_MAP = {
  Alphabetical: (countriesList) =>
    countriesList.sort((a, b) => a.name.localeCompare(b.name)),
  Area: (countriesList) => countriesList.sort((a, b) => b.area - a.area),
  PopulationAsc: (countriesList) =>
    countriesList.sort((a, b) => b.population - a.population),
  PopulationDesc: (countriesList) =>
    countriesList.sort((a, b) => a.population - b.population),
};

const SORT_NAMES = Object.keys(SORT_MAP);
const FILTER_NAMES = Object.keys(FILTER_MAP);

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function App({ allCountries }) {
  const [countriesData, setCountriesData] = useState(allCountries);
  const [countriesDataForLiveSearch, setCountriesDataForLiveSearch] = useState([
    ...countriesData,
  ]);
  const [filterByButton, setFilterByButton] = useState(false);
  const [sortByButton, setSortByButton] = useState(false);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Alphabetical");
  const [searchInputValue, setSearchInputValue] = useState("");

  // ========
  // SORTING AND FILTERING DATA
  // ========

  //Sort the countries. Default is in alphabetical order
  const sortedCountries = SORT_MAP[sortBy](countriesData);

  //From sorted countries filter them by the filter that the user applied. Default is All.
  const filteredCountriesByButton = sortedCountries.filter(FILTER_MAP[filter]);

  // Possible filters
  const filterList = FILTER_NAMES.map((filterName) => {
    return (
      <FilterButton
        key={filterName}
        name={filterName}
        isPressed={filterName === filter}
        setFilter={setFilter}
        setFilterByButton={setFilterByButton}
      />
    );
  });

  // Possible sorts
  const sortList = SORT_NAMES.map((filterName) => {
    return (
      <SortButton
        key={filterName}
        name={filterName}
        isPressed={filterName === sortBy}
        setSortBy={setSortBy}
        setSortByButton={setSortByButton}
      />
    );
  });

  // ========
  // DISPLAYING DATA
  // ========

  const [hasMore, updateHasMore] = useState(true);
  const [sliceNumber, setSliceNumber] = useState(25);

  const loadMoreData = () => {
    if (filteredCountriesByButton.slice(0, sliceNumber).length >= 250) {
      updateHasMore(false);
      return;
    }
    setSliceNumber(sliceNumber + 25);
  };

  const displayCountries = (
    <InfiniteScroll
      dataLength={filteredCountriesByButton.slice(0, sliceNumber).length}
      next={loadMoreData}
      hasMore={hasMore}
    >
      <main className="cards-wrapper">
        {filteredCountriesByButton.slice(0, sliceNumber).map((country) => {
          return (
            <CountryCard
              key={country.name}
              countryName={country.name}
              countryFlag={country.flag}
              countryArea={country.area}
              countryPopulation={country.population}
              countryRegion={country.region}
              countryCapital={country.capital}
              numberWithCommas={numberWithCommas}
            />
          );
        })}
      </main>
    </InfiniteScroll>
  );

  function resetState() {
    setCountriesData(allCountries);
    setFilterByButton(false);
    setSortByButton(false);
    setFilter("All");
    setSortBy("Alphabetical");
    setSearchInputValue("");
  }

  return (
    <>
      <Header resetState={resetState} />
      <div className="app-wrapper">
        <Head>
          <title>Where in the world?</title>
          <link rel="icon" type="image/jpg" href="/earth-icon.png" />
        </Head>

        <div className="filtering-wrapper">
          <InputBar
            searchInputValue={searchInputValue}
            setSearchInputValue={setSearchInputValue}
            setCountriesData={setCountriesData}
            countriesDataForInput={countriesDataForLiveSearch}
          />
          <div className="filter-sort-container">
            <ControlButton
              name="sort-by"
              actionUpdate={setSortByButton}
              action={sortByButton}
              list={sortList}
            />
            <ControlButton
              name="filter-by"
              actionUpdate={setFilterByButton}
              action={filterByButton}
              list={filterList}
            />
          </div>
        </div>
        {displayCountries.props.dataLength === 0 ? (
          <QueryNotFound />
        ) : (
          displayCountries
        )}
      </div>
    </>
  );
}

export default App;

export async function getStaticProps() {
  const countriesFetch = await fetch("https://restcountries.eu/rest/v2");
  const allCountries = await countriesFetch.json();
  return {
    props: {
      allCountries,
    },
  };
}
