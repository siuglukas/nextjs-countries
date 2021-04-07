function GooglePlacesApi({ photoUrls }) {
  const showPhotos = photoUrls.map((photoUrl) => (
    <img key={photoUrl} src={photoUrl} />
  ));
  return <section id="photos">{photoUrls ? showPhotos : ""}</section>;
}

export default GooglePlacesApi;
