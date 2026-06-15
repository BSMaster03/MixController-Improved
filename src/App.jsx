import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu";
import CreateProject from "./pages/CreateProject";
import SavedProjects from "./pages/SavedProjects";
import ModifyProjects from "./pages/ModifyProjects";
import EditProject from "./pages/EditProject";
import ViewProject from "./pages/ViewProject";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/app" element={<Menu />} />
        <Route path="/app/proyecto" element={<CreateProject />} />
        <Route path="/app/proyectos" element={<SavedProjects />} />
        <Route path="/app/ver/:id" element={<ViewProject />} />
        <Route path="/app/modificar" element={<ModifyProjects />} />
        <Route path="/app/modificar/:id" element={<EditProject />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
