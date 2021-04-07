import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  margin: "0 auto",
};

function GoogleMaps(props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE,
    libraries,
  });

  const center = {
    lat: parseFloat(props.lat),
    lng: parseFloat(props.lng),
  };

  // Zoom countries based on their size.
  let zoom;
  const bigCountries = ["Russian Federation", "Greenland", "Antarctica"];
  if (bigCountries.includes(props.countryName)) {
    zoom = 2;
  } else if (props.countryArea > 3000000) {
    zoom = 3;
  } else {
    zoom = 5;
  }

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps..";
  return (
    <>
      {/* If there are no coordinates provided by the API, don't show map. */}
      {!props.lat && !props.lng ? (
        ""
      ) : (
        <div className="map">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={zoom}
            center={center}
          >
            <Marker position={center} />
          </GoogleMap>
        </div>
      )}
    </>
  );
}

export default GoogleMaps;
