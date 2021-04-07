import ArrowLeft from "./../Icons/ArrowLeft";
import { useRouter } from "next/router";
function GoBackButton() {
  const router = useRouter();
  return (
    <button
      className="button button--go-back"
      type="button"
      onClick={() => router.back()}
      aria-label="go back one page"
    >
      <ArrowLeft />
      <span className="text-back">Back</span>
    </button>
  );
}

export default GoBackButton;
