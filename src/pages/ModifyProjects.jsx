import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import "../styles/realizar.css";

export default function ModifyProjects() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    wall_length_m: "",
    wall_height_m: "",
    wall_thickness_m: "",
    brick_length_m: "",
    brick_height_m: "",
    brick_thickness_m: "",
    bottles_per_kg_pet: "25",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Obtener todos los proyectos y buscar por nombre (case-insensitive)
      const res = await api.get('/projects');
      const data = res.data;
      const list = Array.isArray(data) ? data : data?.projects ?? [];

      const nameToFind = (form.name || '').trim().toLowerCase();
      if (!nameToFind) {
        alert('Por favor ingresa el nombre del proyecto a modificar');
        setLoading(false);
        return;
      }

      const found = list.find(p => (p.name || '').trim().toLowerCase() === nameToFind);

      if (!found) {
        alert('No existe un proyecto con ese nombre. Ninguna modificación realizada.');
        setLoading(false);
        return;
      }

      // Preparar payload: convertir campos numéricos
      const payload = {
        ...form,
        wall_length_m: parseFloat(form.wall_length_m) || 0,
        wall_height_m: parseFloat(form.wall_height_m) || 0,
        wall_thickness_m: parseFloat(form.wall_thickness_m) || 0,
        brick_length_m: parseFloat(form.brick_length_m) || 0,
        brick_height_m: parseFloat(form.brick_height_m) || 0,
        brick_thickness_m: parseFloat(form.brick_thickness_m) || 0,
        bottles_per_kg_pet: parseFloat(form.bottles_per_kg_pet) || 25,
      };

      await api.put(`/projects/${found.id}`, payload);
      alert('Proyecto actualizado correctamente');
      navigate('/app/proyectos');

    } catch (error) {
      console.error('Error modificando proyecto:', error);
      alert('Error modificando proyecto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">

      {/* Barra superior */}
      <div className="top-bar">
        <h1>Modificar proyecto</h1>

        <button className="back-btn" onClick={() => navigate("/")}>
          ← Volver al menú principal
        </button>
      </div>

      <p className="subtitle">Edita los valores del proyecto y usa el mismo nombre del proyecto guardado para modificarlo.</p>

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
        <button className="primary-btn" onClick={handleSave} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}
