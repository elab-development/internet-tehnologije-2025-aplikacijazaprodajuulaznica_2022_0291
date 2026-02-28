import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const Mapa = () => {
  const position = [44.81855, 20.413054]; 

  return (
    <MapContainer 
      center={position} 
      zoom={16} 
      scrollWheelZoom={false} 
      style={{ height: '100%', width: '100%' }} 
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>Teatar Maska, Bulevar umetnosti 10</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Mapa;