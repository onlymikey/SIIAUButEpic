import React from "react";
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import { MdCalendarMonth, MdCalendarToday, MdAccountBalance , MdInsertDriveFile, MdLogin, MdNotificationImportant } from "react-icons/md";


const DashboardStudents = () => {
  return (
    <div className="p-10 max-w-6xl mx-auto bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-lg w-full ">
      {/* Título del Dashboard */}
      <h1 className="text-foreground font-sans font-extrabold text-3xl justify-center items-center text-center mb-6">Dashboard</h1>

      {/* Bienvenida */}
      <Card style={{ marginBottom: "20px", backgroundColor: "#192a56", color: "white" }}>
        <CardBody>
          <h2 className="text-foreground font-sans text-2xl justify-center items-center text-center mb-6">Bienvenido XXXXX (estudiante / profesor)</h2>
        </CardBody>
      </Card>

      {/* Contenedor de Mi horario y Avisos */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "20px" }}>
        {/* Mi Horario */}
        <Card style={{ backgroundColor: "#1B1F3A", color: "white" }}>
          <CardHeader>
            <div style={{ display: "flex", alignItems: "center" }}>
            <MdCalendarToday style={{ fontSize: "1.5rem", marginRight: "8px", color: "white" }} /> {/* Tamaño y color opcionales */}
            <h3 style={{ margin: 0, color: "white" }}>Mi horario</h3>
            </div>
          </CardHeader>
          <CardBody>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", color: "white" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid white" }}>
                  <th style={{ padding: "10px" }}>HORA</th>
                  <th>L</th>
                  <th>M</th>
                  <th>I</th>
                  <th>J</th>
                  <th>V</th>
                </tr>
              </thead>
              <tbody>
                {["07:00-09:00", "09:00-11:00", "11:00-13:00", "13:00-15:00"].map((hora) => (
                  <tr key={hora} style={{ borderBottom: "1px solid white" }}>
                    <td style={{ padding: "10px" }}>{hora}</td>
                    <td>Text</td>
                    <td>Text</td>
                    <td>Text</td>
                    <td>Text</td>
                    <td>Text</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        {/* Avisos */}
        <Card style={{ backgroundColor: "#1B1F3A", color: "white" }}>
          <CardHeader>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MdNotificationImportant style={{ fontSize: "1.5rem", marginRight: "5px", color: "white" }} /> {/* Tamaño y color opcionales */}
            <h3 style={{ margin: 0, color: "white" }}>AVISOS</h3>
            </div>
          </CardHeader>
          <CardBody>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              <li>AVISO 1</li>
              <li>AVISO 2</li>
              <li>AVISO 3</li>
            </ul>
          </CardBody>
        </Card>
      </div>

      {/* Botones */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
        {[
          { label: "Registrar materias", icon: <MdCalendarMonth />, color: "#007bff" }, 
          { label: "Oferta Académica", icon: <MdAccountBalance />, color: "#28a745", path: "/AcademicsPrograms" },
          { label: "Kardex", icon: <MdInsertDriveFile />, color: "#ffc107" }, 
          { label: "Cerrar Sesión", icon: <MdLogin />, color: "#dc3545" }, 
        ].map((button) => (
          <Link to={button.path || "#"} key={button.label} style={{ textDecoration: 'none' }}>
            <Button
              variant="flat"
              size="lg"
              style={{
                backgroundColor: "#1B1F3A",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: button.color,
                padding: "50px",
                width: "100%",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1px", color: "white" }}>
                {button.icon}
              </div>
              {button.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardStudents;
