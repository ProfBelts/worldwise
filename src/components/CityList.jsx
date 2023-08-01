import Spinner from "./Spinner";
import styles from "./CityList.module.css";
import CityItems from "./CityItems";
import Message from "./Message";
import { useCity } from "../context/CityContext";

function CityList() {
  const { cities, isLoading } = useCity();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItems city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
