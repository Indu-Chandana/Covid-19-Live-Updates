import React, {useState} from "react";
import "./Map.css";
import {MapContainer, TileLayer } from "react-leaflet";
import { showDataOnMap } from "./util";

// import ChangeMapView from './ChangeMapView';


function Map({countries, casesType, center, zoom}) {

  const [map, setmap] = useState(null);
  if(map)
  {
    map.flyTo(center);
  }
  return (
    <div className="map" id="map">
      <MapContainer center={center} zoom={zoom} whenCreated={setmap} maxZoom={8}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {(countries)?showDataOnMap(countries, casesType):null}
      </MapContainer>
    </div>
  );
}

export default Map;