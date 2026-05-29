import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ComplaintMap({ complaints }) {

  return (

    <MapContainer
      center={[15.3173, 75.7139]}
      zoom={5}
      scrollWheelZoom={true}
      className="h-[500px] w-full rounded-2xl"
    >

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {complaints.map((complaint) => (

        complaint.latitude &&
        complaint.longitude && (

          <Marker
            key={complaint.id}
            position={[
              complaint.latitude,
              complaint.longitude,
            ]}
          >

            <Popup>

              <div className="text-black">

                <h1 className="font-bold">
                  {complaint.title}
                </h1>

                <p>
                  {complaint.description}
                </p>

                <p>
                  Status: {complaint.status}
                </p>

              </div>

            </Popup>

          </Marker>

        )
      ))}

    </MapContainer>
  );
}

export default ComplaintMap;