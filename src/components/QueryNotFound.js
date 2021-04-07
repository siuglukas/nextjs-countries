import SearchNotFound from "./Icons/SearchNotFound";
function QueryNotFound() {
  return (
    <p className="query-not-found">
      <SearchNotFound />
      <span>
        No matching countries were found for the region you have selected.
      </span>
    </p>
  );
}

export default QueryNotFound;
