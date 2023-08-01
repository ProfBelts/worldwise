/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";

import styles from "./Map.module.css";
import { useCity } from "../context/CityContext";
import { useGeoLocation } from "../hooks/useGeoLocation";
import { useUrlPosition } from "../hooks/useUrlPosition";

import Button from "./Button";

export default function Map() {
  const { cities, flagemojiToPNG } = useCity();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeoLocation();

  const [mapLat, mapLng] = useUrlPosition();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(() => {
    if (geoLocationPosition)
      setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
  }, [geoLocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading Position" : "Get your location"}
        </Button>
      )}

      <MapContainer
        center={mapPosition}
        // center={[mapLat, mapLng]}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span> {flagemojiToPNG(city.emoji)} </span>
              <span> {city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

// function DetectClick() {
//   const navigate = useNavigate();
//   useMapEvents({
//     click: (e) => navigate(`form/?lat=${e.latlng.lat}&lng=${e.latlng.lng}`), console.log(e)
//   });
// }

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      console.log(e); // You can log the event object here to see its values
      navigate(`form/?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });

  // Return null if you don't need any UI elements from this component
  return null;
}
