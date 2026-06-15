import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/api";
import "../styles/realizar.css";

export default function EditProject() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos del proyecto
  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        setForm(response.data);
      } catch (error) {
        console.error("Error cargando proyecto:", error);
        alert("Error cargando proyecto");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await api.put(`/projects/${id}`, form);
      alert("Proyecto actualizado correctamente");
      navigate("/app/proyectos");
    } catch (error) {
      console.error("Error actualizando proyecto:", error);
      alert("Error al actualizar el proyecto");
    }
  };

  if (loading || !form) {
    return <div className="page">Cargando proyecto...</div>;
  }

  return (
    <div className="page">

      {/* Barra superior */}
      <div className="top-bar">
        <h1>Editar proyecto</h1>

        <button className="back-btn" onClick={() => navigate("/")}>
          ← Volver al menú principal
        </button>
      </div>

      <p className="subtitle">Modifica los valores del proyecto seleccionado.</p>

      {/* Formulario */}
      <div className="form-grid">

        <div className="field">
          <label>Nombre del proyecto</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Longitud del muro (m)</label>
          <input
            type="number"
            step="0.01"
            name="wall_length_m"
            value={form.wall_length_m}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Altura del muro (m)</label>
          <input
            type="number"
            step="0.01"
            name="wall_height_m"
            value={form.wall_height_m}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Espesor del muro (m)</label>
          <input
            type="number"
            step="0.01"
            name="wall_thickness_m"
            value={form.wall_thickness_m}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Longitud del ladrillo (m)</label>
          <input
            type="number"
            step="0.001"
            name="brick_length_m"
            value={form.brick_length_m}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Altura del ladrillo (m)</label>
          <input
            type="number"
            step="0.001"
            name="brick_height_m"
            value={form.brick_height_m}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Espesor del ladrillo (m)</label>
          <input
            type="number"
            step="0.001"
            name="brick_thickness_m"
            value={form.brick_thickness_m}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Botellas por kg de PET</label>
          <input
            type="number"
            name="bottles_per_kg_pet"
            value={form.bottles_per_kg_pet}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="actions">
        <button className="primary-btn" onClick={handleSave}>
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
