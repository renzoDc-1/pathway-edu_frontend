import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./CentroDeEstudios.css";

function CentroDeEstudios() {
  const [centros, setCentros] = useState([]);
  const [areas, setAreas] = useState([]);
  const [ubicaciones, setUbicaciones] = useState({});
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const areaSelected = new URLSearchParams(location.search).get("area");

  useEffect(() => {
    const fetchCentros = axios.get(
      `${import.meta.env.VITE_API_GATEWAY}/api/area-centro-de-estudios`
    );
    const fetchAreas = axios.get(
      `${import.meta.env.VITE_API_GATEWAY}/api/areas`
    );

    Promise.all([fetchCentros, fetchAreas])
      .then(([centrosResponse, areasResponse]) => {
        setCentros(centrosResponse.data);
        const areaList = areasResponse.data.map((area) => ({
          area_id: area.area_id,
          nombre: area.area_name,
        }));
        setAreas(areaList);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
        setLoading(false);
      });
  }, []);

  // Filtrar centros de estudio según el área seleccionada en la URL
  const filteredCentros = areaSelected
    ? centros.filter((centro) => centro.area_id === areaSelected)
    : centros.filter(
        (centro, index, self) =>
          index ===
          self.findIndex(
            (c) =>
              c.centroDeEstudio.centroDeEstudios_id ===
              centro.centroDeEstudio.centroDeEstudios_id
          )
      );

  // Obtener ubicaciones solo para los centros filtrados
  useEffect(() => {
    const fetchUbicaciones = async () => {
      const ubicacionPromises = filteredCentros
        .filter((centro) => !ubicaciones[centro.areaCentroDeEstudio_id]) // Evitar llamadas duplicadas
        .map((centro) =>
          axios
            .get(
              `${import.meta.env.VITE_API_GATEWAY}/api/ubigeo/${
                centro.ubicacion
              }`
            )
            .then((response) => ({
              id: centro.areaCentroDeEstudio_id,
              ubicacion: response.data.name || "Ubicación no disponible",
            }))
            .catch((error) => {
              console.error(
                `Error al obtener la ubicación para el centro ${centro.areaCentroDeEstudio_id}`,
                error
              );
              return {
                id: centro.areaCentroDeEstudio_id,
                ubicacion: "Error al obtener la ubicación",
              };
            })
        );

      const ubicacionData = await Promise.all(ubicacionPromises);
      const ubicacionMap = { ...ubicaciones }; // Copiar estado actual de ubicaciones
      ubicacionData.forEach(({ id, ubicacion }) => {
        ubicacionMap[id] = ubicacion;
      });
      setUbicaciones(ubicacionMap);
    };

    if (filteredCentros.length > 0) {
      fetchUbicaciones();
    }
  }, [filteredCentros, ubicaciones]);

  return (
    <div className="centro-de-estudios-container">
      <h1>Centro de Estudios</h1>

      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <>
          <label htmlFor="area-select">Selecciona un área:</label>
          <select
            id="area-select"
            value={areaSelected || ""}
            onChange={(e) =>
              (window.location.href = `/centro-de-estudios?area=${e.target.value}`)
            }
          >
            <option value="">Todas las áreas</option>
            {areas.map((area) => (
              <option key={area.area_id} value={area.area_id}>
                {area.nombre}
              </option>
            ))}
          </select>

          <div className="centros-list">
            {filteredCentros.map((centro) => (
              <div key={centro.areaCentroDeEstudio_id} className="centro-card">
                <img
                  src={centro.centroDeEstudio.image}
                  alt={`${centro.centroDeEstudio.nombre} logo`}
                  className="centro-image"
                />
                <div className="centro-info">
                  <h2>{centro.centroDeEstudio.nombre}</h2>
                  <p>
                    Ubicación:{" "}
                    {ubicaciones[centro.areaCentroDeEstudio_id] ||
                      "Cargando..."}
                  </p>
                  <p>
                    Área:{" "}
                    {
                      areas.find((area) => area.area_id === centro.area_id)
                        ?.nombre
                    }
                  </p>
                  <p>
                    Ranking Nacional: {centro.centroDeEstudio.nationalRanking}
                  </p>
                  <a
                    href={centro.centroDeEstudio.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="centro-link"
                  >
                    Visitar sitio web
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default CentroDeEstudios;
