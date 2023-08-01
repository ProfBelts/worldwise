import PropTypes from "prop-types";
import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";
import { useCity } from "../context/CityContext";

// function handleClick(e) {
//   e.preventDefault();
// }

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

export default function CityItems({ city }) {
  // console.log(city);

  const { currentCity, flagemojiToPNG, deleteCity } = useCity();
  const { cityName, emoji, date, id, position } = city;

  // console.log(position);

  function handleClick(e) {
    e.preventDefault();

    deleteCity(id);
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{flagemojiToPNG(emoji)}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handleClick}>
          x
        </button>
      </Link>
    </li>
  );
}

CityItems.propTypes = {
  city: PropTypes.shape({
    id: PropTypes.string.isRequired,
    cityName: PropTypes.string.isRequired,
    emoji: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    position: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    }).isRequired,
    // Add any other required props for the city object
  }).isRequired,
};
