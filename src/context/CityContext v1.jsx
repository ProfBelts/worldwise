/* eslint-disable no-unused-vars */ // Ignore warnings for unused variables

// Import required dependencies from React
import { createContext, useEffect, useState, useContext } from "react";

const BASE_URL = "http://localhost:8000"; // Base URL for the API

// Create a new React context called CityContext
const CityContext = createContext();

// CityProvider component responsible for fetching and providing city data
// eslint-disable-next-line react/prop-types
function CityProvider({ children }) {
  // State variables for holding city data and loading status
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  // useEffect hook to fetch city data when the component mounts
  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true); //
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch {
        alert("There was an error loading data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []); // Empty dependency array ensures this effect runs only once, on component mount

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch (error) {
      console.error("Error fetching city data:", error);
      alert("There was an error loading data");
    } finally {
      setIsLoading(false);
    }
  }

  async function createCity(city) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/`, {
        method: "POST",
        body: JSON.stringify(city),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      setCities((cities) => [...cities, data]);
      // console.log(data);
    } catch (error) {
      console.error("Error fetching city data:", error);
      alert("There was an error creating city");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(id) {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/cities/`, {
        method: "DELETE",
      });
      setCities((cities) => cities.filter((city) => city.id !== id));
      // console.log(data);
    } catch (error) {
      console.error("Error fetching city data:", error);
      alert("There was an error deleting city");
    } finally {
      setIsLoading(false);
    }
  }

  // console.log("Current City in CityProvider:", currentCity);

  const flagemojiToPNG = (flag) => {
    if (!flag) {
      // Return a fallback image if the flag is not provided
      return <img src={`fallback-image-url.png`} alt="flag" />;
    }

    var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
      .map((char) => String.fromCharCode(char - 127397).toLowerCase())
      .join("");
    return (
      <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
    );
  };

  // Return the CityContext.Provider with cities and isLoading values provided to consuming components
  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        flagemojiToPNG,
        createCity,
        deleteCity,
      }}
    >
      {children} {/* Render the child components wrapped by CityProvider */}
    </CityContext.Provider>
  );
}

// Custom hook to consume the CityContext value
function useCity() {
  const context = useContext(CityContext); // Get the CityContext value using useContext
  if (context === undefined)
    throw new Error("CityContext was used outside the CityProvider"); // Throw an error if CityContext is undefined (i.e., useCity is used outside CityProvider)
  return context; // Return the cities and isLoading values provided by CityProvider
}

// Export the useCity hook and CityProvider component to use in other parts of the application
// eslint-disable-next-line react-refresh/only-export-components
export { useCity, CityProvider };
