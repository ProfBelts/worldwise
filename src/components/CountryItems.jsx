import PropTypes from "prop-types";
import styles from "./CountryItem.module.css";
import { useCity } from "../context/CityContext";

function CountryItem({ country }) {
  const { flagemojiToPNG } = useCity();

  return (
    <li className={styles.countryItem}>
      <span>{flagemojiToPNG(country.emoji)}</span>
      <span>{country.country}</span>
    </li>
  );
}

CountryItem.propTypes = {
  country: PropTypes.shape({
    emoji: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    // Add any other required props for the country object
  }).isRequired,
};

export default CountryItem;
