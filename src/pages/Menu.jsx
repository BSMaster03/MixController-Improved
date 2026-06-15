import { useNavigate } from "react-router-dom";
import "../styles/menu.css";

export default function Menu() {
  const navigate = useNavigate();

  return (
    <div className="page">

      <h1>Eco‑Ladrillos PET</h1>
      <p className="subtitle">Construcción sostenible con PET reciclado</p>

      <button className="menu-btn" onClick={() => navigate("/app/proyecto")}>
        Realizar un proyecto
      </button>

      <button className="menu-btn" onClick={() => navigate("/app/proyectos")}>
        Ver proyectos guardados
      </button>

      <button className="menu-btn" onClick={() => navigate("/app/modificar")}>
        Modificar proyectos guardados
      </button>

    </div>
  );
}
