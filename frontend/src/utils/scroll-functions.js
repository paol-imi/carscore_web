import { useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const ScrollToHashElement = () => {
  let location = useLocation();
  let hashElement = useMemo(() => {
    let hash = location.hash;
    const removeHashCharacter = (str) => {
      const result = str.slice(1);
      return result;
    };
    async function getSection(hash) {
      await sleep(10);
      if (hash) {
        let element = document.getElementById(removeHashCharacter(hash));
        return element;
      } else {
        return null;
      }
    }
    return getSection(hash);
  }, [location]);

  useEffect(() => {
    async function foo(hashElementPromise) {
      let hashElement = await hashElementPromise;
      if (hashElement) {
        hashElement.scrollIntoView({
          behavior: "smooth",
          // block: "end",
          inline: "nearest",
        });
      }
    }
    foo(hashElement);
  }, [hashElement]);

  return null;
};

export { ScrollToHashElement };
