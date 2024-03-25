import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AgregarCliente.css';

function AgregarCliente({ onClose, onClienteAgregado }) {
  const navigate = useNavigate();
  const [nuevoCliente, setNuevoCliente] = useState({
    nombres: '',
    apellidos: '',
    direccion: '',
    telefono: '',
    email: '',
  });

  const agregarCliente = (e) => {
    e.preventDefault();
    axios
      .post('https://proyecto.forcewillcode.website/api/clientes', nuevoCliente)
      .then((response) => {
        setNuevoCliente({
          nombres: '',
          apellidos: '',
          direccion: '',
          telefono: '',
          email: '',
        });
        onClienteAgregado(); // Llamar a la función para actualizar la lista de clientes
        onClose(); // Cerrar la ventana modal
      })
      .catch((error) => {
        console.error('Error al agregar el cliente:', error);
      });
  };

  return (
    <div className="container">
      <h2>Agregar Nuevo Cliente</h2>
      <form onSubmit={agregarCliente}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombres"
            value={nuevoCliente.nombres}
            onChange={(e) =>
              setNuevoCliente({ ...nuevoCliente, nombres: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Apellidos"
            value={nuevoCliente.apellidos}
            onChange={(e) =>
              setNuevoCliente({ ...nuevoCliente, apellidos: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Dirección"
            value={nuevoCliente.direccion}
            onChange={(e) =>
              setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={nuevoCliente.telefono}
            onChange={(e) =>
              setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={nuevoCliente.email}
            onChange={(e) =>
              setNuevoCliente({ ...nuevoCliente, email: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <button type="submit">Agregar</button>
        </div>
      </form>
    </div>
  );
}

export default AgregarCliente;