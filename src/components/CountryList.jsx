import Spinner from "./Spinner";
import styles from "./CountryList.module.css";
import CountryItems from "./CountryItems";
import Message from "./Message";
import { useCity } from "../context/CityContext";

function CountryList() {
  // console.log(cities);

  const { cities, isLoading } = useCity();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country)) {
      return [...arr, { country: city.country, emoji: city.emoji }];
    } else {
      return arr;
    }
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItems country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;
