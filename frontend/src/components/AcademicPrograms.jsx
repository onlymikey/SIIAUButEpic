import React from "react";
import { Card, Select, Table } from "@nextui-org/react";

const AcademicOffer = () => {
  return (
    <div className="p-10 max-w-6xl mx-auto bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-lg w-full ">
      {/* Título */}
      <h1 className="text-foreground font-sans font-extrabold text-3xl justify-center items-center text-center mb-6">Oferta Académica</h1>

      {/* Select de Carrera */}
      <Card
        style={{
          backgroundColor: "#1B1F3A",
          color: "#FFFFFF",
          marginBottom: "20px",
          padding: "10px",
        }}
      >
        <Select label="Carrera" placeholder="Selecciona una carrera" variant='bordered' className="bg-transparent text-white rounded-md">
                        {/* Carreras */}
                    </Select>
      </Card>

        {/* Tabla */}
        <Card style={{ backgroundColor: "#1B1F3A", color: "#FFFFFF" }}>
        <table
            style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
            color: "white",
            }}
        >
            <thead>
            <tr style={{ borderBottom: "1px solid white" }}>
                <th style={{ padding: "10px" }}>CLAVE</th>
                <th>MATERIA</th>
                <th>CUPOS</th>
                <th>PROFESOR</th>
                <th>HORARIO</th>
                <th>AULA</th>
            </tr>
            </thead>
            <tbody>
            {[...Array(4)].map((_, index) => (
                <tr key={index} style={{ borderBottom: "1px solid white" }}>
                <td style={{ padding: "10px" }}>Text</td>
                <td>Text</td>
                <td>Text</td>
                <td>Text</td>
                <td>Text</td>
                <td>Text</td>
                </tr>
            ))}
            </tbody>
        </table>
        </Card>

    </div>
  );
};

export default AcademicOffer;
