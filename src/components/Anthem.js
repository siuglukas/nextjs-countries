function Anthem(props) {
  return (
    <>
      {props.anthemUrl == "None" ? (
        ""
      ) : (
        <div className="country-details__paramater-static country-details--anthem-param  ">
          <p>Anthem:</p>
          <audio
            style={{ marginLeft: "20px" }}
            src={props.anthemUrl}
            type="audio/mpeg"
            controls
            controlsList="nodownload"
          >
            {" "}
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </>
  );
}

export default Anthem;
