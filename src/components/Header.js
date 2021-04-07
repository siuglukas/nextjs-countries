import Link from "next/link";
import Moon from "./Icons/Moon";
import Sun from "./Icons/Sun";
import { useEffect } from "react";
import { useRouter } from "next/router";
function Header(props) {
  const router = useRouter();
  useEffect(() => {
    const prefferedTheme = localStorage.getItem("theme");
    const addTheme = (theme) => {
      document.body.classList.add(theme);
    };
    if (prefferedTheme) {
      addTheme(prefferedTheme);
    } else {
      addTheme("dark");
    }
  }, []);
  return (
    <nav>
      <header className="header">
        <div className="header__content-wrapper">
          {router.pathname === "/" ? (
            <h1 onClick={props.resetState} className="header__heading">
              Where in the world?
            </h1>
          ) : (
            <Link href="/">
              <h1 onClick={props.resetState} className="header__heading">
                Where in the world?
              </h1>
            </Link>
          )}

          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                const body = document.body;

                function switchBackgrounds(replaceFrom, replaceTo) {
                  body.classList.replace(replaceFrom, replaceTo);
                  localStorage.setItem("theme", replaceTo);
                }

                if (body.classList.contains("dark")) {
                  switchBackgrounds("dark", "light");
                } else {
                  switchBackgrounds("light", "dark");
                }
              }
            }}
            style={{ border: "none", background: "none", cursor: "pointer" }}
            aria-label="change theme"
          >
            <Moon />
            <Sun />
          </button>
        </div>
      </header>
    </nav>
  );
}

export default Header;
