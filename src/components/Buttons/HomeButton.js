import House from "./../Icons/House";
import Link from "next/link";
function HomeButton() {
  return (
    <Link href="/">
      <button
        aria-label="go to homepage"
        className="button button--go-home"
        type="button"
      >
        <House />
        <span className="text-go-home">Home</span>
      </button>
    </Link>
  );
}

export default HomeButton;
