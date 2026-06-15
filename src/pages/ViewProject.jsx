import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/api";
import "../styles/realizar.css";

export default function ViewProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error("Error cargando proyecto:", err);
        alert("No se pudo cargar el proyecto");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <div className="page">Cargando...</div>;
  if (!project) return <div className="page">Proyecto no encontrado</div>;

  return (
    <div className="page">

      <div className="top-bar">
        <h1>Detalles del proyecto</h1>

        <button className="back-btn" onClick={() => navigate("/app/proyecto")}>
          ← Volver a Realizar Proyecto
        </button>
      </div>

      <p className="subtitle">Valores usados para generar este resultado.</p>

      <div className="form-grid">

        {/* Dimensiones del muro */}
        <div className="field">
          <label>Longitud del muro (m)</label>
          <input value={project.wall_length} readOnly />
        </div>

        <div className="field">
          <label>Altura del muro (m)</label>
          <input value={project.wall_height} readOnly />
        </div>

        <div className="field">
          <label>Espesor del muro (m)</label>
          <input value={project.wall_thickness} readOnly />
        </div>

        {/* Dimensiones del ladrillo */}
        <div className="field">
          <label>Longitud del ladrillo (m)</label>
          <input value={project.brick_length} readOnly />
        </div>

        <div className="field">
          <label>Altura del ladrillo (m)</label>
          <input value={project.brick_height} readOnly />
        </div>

        <div className="field">
          <label>Espesor del ladrillo (m)</label>
          <input value={project.brick_thickness} readOnly />
        </div>

        {/* Mezcla */}
        <div className="field">
          <label>% PET</label>
          <input value={project.pet_percent} readOnly />
        </div>

        <div className="field">
          <label>% Arena</label>
          <input value={project.sand_percent} readOnly />
        </div>

        <div className="field">
          <label>% Cemento</label>
          <input value={project.cement_percent} readOnly />
        </div>

        <div className="field">
          <label>% Agua</label>
          <input value={project.water_percent} readOnly />
        </div>

        <div className="field">
          <label>Botellas por kg PET</label>
          <input value={project.bottles_per_kg_pet} readOnly />
        </div>

        {/* Resultados */}
        <div className="field">
          <label>Total ladrillos</label>
          <input value={project.total_bricks} readOnly />
        </div>

        <div className="field">
          <label>PET requerido (kg)</label>
          <input value={project.pet_kg} readOnly />
        </div>

        <div className="field">
          <label>Botellas necesarias</label>
          <input value={project.bottles_needed} readOnly />
        </div>

      </div>
    </div>
  );
}
