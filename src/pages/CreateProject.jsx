import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import "../styles/realizar.css";

export default function CreateProject() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    wall_length_m: "",
    wall_height_m: "",
    wall_thickness_m: "",
    brick_length_m: "",
    brick_height_m: "",
    brick_thickness_m: "",
    mix_preset_id: 0,
    pet_percent: "",
    sand_percent: "",
    cement_percent: "",
    water_percent: "",
    bottles_per_kg_pet: 25,
    name: "", // ← corregido
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // Convertir valores a número
      const wall_length = parseFloat(form.wall_length_m);
      const wall_height = parseFloat(form.wall_height_m);
      const wall_thickness = parseFloat(form.wall_thickness_m);

      const brick_length = parseFloat(form.brick_length_m);
      const brick_height = parseFloat(form.brick_height_m);
      const brick_thickness = parseFloat(form.brick_thickness_m);

      const pet_percent = parseFloat(form.pet_percent);
      const sand_percent = parseFloat(form.sand_percent);
      const cement_percent = parseFloat(form.cement_percent);

      const bottles_per_kg_pet = parseFloat(form.bottles_per_kg_pet);

      // Cálculos
      const wallArea = wall_length * wall_height;
      const brickArea = brick_length * brick_height;

      const total_bricks = Math.ceil(wallArea / brickArea);

      const total_mix_volume_m3 =
        wall_length * wall_height * wall_thickness;

      const pet_kg = (pet_percent / 100) * total_mix_volume_m3 * 1000;
      const sand_kg = (sand_percent / 100) * total_mix_volume_m3 * 1000;
      const cement_kg = (cement_percent / 100) * total_mix_volume_m3 * 1000;

      const bottles_needed = pet_kg * bottles_per_kg_pet;

      // Enviar al backend EXACTAMENTE lo que espera
    await api.post("/projects", {
        name: form.name,
        wall_length_m: parseFloat(form.wall_length_m),
        wall_height_m: parseFloat(form.wall_height_m),
        wall_thickness_m: parseFloat(form.wall_thickness_m),
        brick_length_m: parseFloat(form.brick_length_m),
        brick_height_m: parseFloat(form.brick_height_m),
        brick_thickness_m: parseFloat(form.brick_thickness_m),
        mix_preset_id: parseInt(form.mix_preset_id),
        pet_percent: parseFloat(form.pet_percent),
        sand_percent: parseFloat(form.sand_percent),
        cement_percent: parseFloat(form.cement_percent),
        water_percent: parseFloat(form.water_percent), // ← FALTABA
        bottles_per_kg_pet: parseFloat(form.bottles_per_kg_pet)
    });



      alert("Proyecto creado correctamente");
      navigate("/app/proyectos");

    } catch (error) {
      console.error(error);
      alert("Error al crear el proyecto");
    }
  };

  return (
    <div className="page">
      <div className="top-bar">
        <h1>Realizar un proyecto</h1>
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Volver al menú principal
        </button>
      </div>

      <p className="subtitle">
        Define las dimensiones del muro, del ladrillo y la mezcla para calcular tu proyecto.
      </p>

      {/* Dimensiones del muro */}
      <div className="section-title">Dimensiones del muro</div>
      <div className="form-grid">
        <div className="field">
          <label>Longitud del muro (m)</label>
          <input type="number" step="0.01" name="wall_length_m" value={form.wall_length_m} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Altura del muro (m)</label>
          <input type="number" step="0.01" name="wall_height_m" value={form.wall_height_m} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Espesor del muro (m)</label>
          <input type="number" step="0.01" name="wall_thickness_m" value={form.wall_thickness_m} onChange={handleChange} />
        </div>
      </div>

      {/* Dimensiones del ladrillo */}
      <div className="section-title">Dimensiones del ladrillo</div>
      <div className="form-grid">
        <div className="field">
          <label>Longitud del ladrillo (m)</label>
          <input type="number" step="0.001" name="brick_length_m" value={form.brick_length_m} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Altura del ladrillo (m)</label>
          <input type="number" step="0.001" name="brick_height_m" value={form.brick_height_m} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Espesor del ladrillo (m)</label>
          <input type="number" step="0.001" name="brick_thickness_m" value={form.brick_thickness_m} onChange={handleChange} />
        </div>
      </div>

      {/* Mezcla */}
      <div className="section-title">Mezcla y PET</div>
      <div className="form-grid">
        <div className="field">
          <label>Preset de mezcla</label>
          <select name="mix_preset_id" value={form.mix_preset_id} onChange={handleChange}>
            <option value="0">Personalizada</option>
            <option value="1">Preset 1</option>
            <option value="2">Preset 2</option>
          </select>
        </div>

        <div className="field">
          <label>% PET</label>
          <input type="number" step="0.1" name="pet_percent" value={form.pet_percent} onChange={handleChange} />
        </div>

        <div className="field">
          <label>% Arena</label>
          <input type="number" step="0.1" name="sand_percent" value={form.sand_percent} onChange={handleChange} />
        </div>

        <div className="field">
          <label>% Cemento</label>
          <input type="number" step="0.1" name="cement_percent" value={form.cement_percent} onChange={handleChange} />
        </div>

        <div className="field">
          <label>% Agua</label>
          <input type="number" step="0.1" name="water_percent" value={form.water_percent} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Botellas por kg de PET</label>
          <input type="number" name="bottles_per_kg_pet" value={form.bottles_per_kg_pet} onChange={handleChange} />
        </div>
      </div>

      {/* Nombre */}
      <div className="section-title">Nombre del proyecto</div>
      <div className="form-grid">
        <div className="field">
          <label>Nombre</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Ej. Muro perimetral patio" />
        </div>
      </div>

      <div className="actions">
        <button className="primary-btn" onClick={handleSubmit}>
          Calcular y guardar proyecto
        </button>
      </div>
    </div>
  );
}
