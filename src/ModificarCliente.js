import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ModificarCliente.css';

function ModificarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState({
    nombres: '',
    apellidos: '',
    direccion: '',
    telefono: '',
    email: '',
  });

  useEffect(() => {
    obtenerCliente(id);
  }, [id]);

  const obtenerCliente = (id) => {
    axios
      .get(`https://proyecto.forcewillcode.website/api/clientes/${id}`)
      .then((response) => {
        setCliente(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener el cliente:', error);
      });
  };

  const modificarCliente = (e) => {
    e.preventDefault();
    const url = `https://proyecto.forcewillcode.website/api/clientes/${id}`;
    axios
      .put(url, cliente)
      .then((response) => {
        // Redirección después de modificar el cliente
        navigate('/clientes');
      })
      .catch((error) => {
        console.error('Error al modificar el cliente:', error);
      });
  };

  return (
    <div className="container">
      <h2>Modificar Cliente</h2>
      <form onSubmit={modificarCliente}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombres"
            value={cliente.nombres}
            onChange={(e) => setCliente({ ...cliente, nombres: e.target.value })}
          />
          <input
            type="text"
            placeholder="Apellidos"
            value={cliente.apellidos}
            onChange={(e) => setCliente({ ...cliente, apellidos: e.target.value })}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Dirección"
            value={cliente.direccion}
            onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={cliente.telefono}
            onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={cliente.email}
            onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <button type="submit">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
}

export default ModificarCliente;