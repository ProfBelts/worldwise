/* eslint-disable no-unused-vars */ // Ignore warnings for unused variables

// Import required dependencies from React
import {
  createContext,
  useEffect,
  useState,
  useContext,
  useReducer,
  useCallback,
} from "react";

const BASE_URL = "http://localhost:8000"; // Base URL for the API

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };

    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
      };

    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "rejected":
      return {
        ...state,
        error: action.payload,
      };

    default:
      throw new Error("Action type unkown");
  }
}

// Create a new React context called CityContext
const CityContext = createContext();

// CityProvider component responsible for fetching and providing city data
// eslint-disable-next-line react/prop-types
function CityProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // useEffect hook to fetch city data when the component mounts
  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading data",
        });
      }
    }

    fetchCities();
  }, []); // Empty dependency array ensures this effect runs only once, on component mount

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;

      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch (error) {
        console.error("Error fetching city data:", error);
        dispatch({
          type: "rejected",
          payload: "There was an error loading data",
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(city) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/`, {
        method: "POST",
        body: JSON.stringify(city),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
      // console.log(data);
    } catch (error) {
      console.error("Error fetching city data:", error);
      dispatch({
        type: "rejected",
        payload: "There was an error creating city",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
      // console.log(data);
    } catch (error) {
      console.error("Error fetching city data:", error);
      dispatch({
        type: "rejected",
        payload: "There was an error deleting city",
      });
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
