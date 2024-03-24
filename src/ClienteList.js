import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClienteList.css';
import AgregarCliente from './AgregarCliente';

function ClienteList() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [clienteEnEdicion, setClienteEnEdicion] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const clientesPorPagina = 10;

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = () => {
    axios
      .get('https://proyecto.forcewillcode.website/api/clientes')
      .then((response) => {
        setClientes(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los clientes:', error);
      });
  };

  const eliminarCliente = (id) => {
    axios
      .delete(`https://proyecto.forcewillcode.website/api/clientes/${id}`)
      .then((response) => {
        obtenerClientes();
      })
      .catch((error) => {
        console.error('Error al eliminar el cliente:', error);
      });
  };

  const iniciarEdicionCliente = (cliente) => {
    setClienteEnEdicion(cliente);
  };

  const cancelarEdicionCliente = () => {
    setClienteEnEdicion(null);
  };

  const modificarCliente = (clienteModificado) => {
    axios
      .put(`https://proyecto.forcewillcode.website/api/clientes/${clienteModificado.id}`, clienteModificado)
      .then((response) => {
        obtenerClientes();
        setClienteEnEdicion(null);
        cerrarModal();
      })
      .catch((error) => {
        console.error('Error al modificar el cliente:', error);
      });
  };

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.apellidos.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indiceInicial = (paginaActual - 1) * clientesPorPagina;
  const indiceFinal = indiceInicial + clientesPorPagina;
  const clientesActuales = clientesFiltrados.slice(indiceInicial, indiceFinal);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const abrirModal = (cliente, accion) => {
    setClienteSeleccionado(cliente);
    if (accion === 'editar') {
      setClienteEnEdicion(cliente);
    } else {
      setClienteEnEdicion(null);
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setClienteSeleccionado(null);
    setClienteEnEdicion(null);
  };

  return (
    <div className="container">
      <h1>Clientes</h1>
      <div className="search-add-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="add-cliente">
          <button onClick={() => abrirModal(null, 'agregar')}>Agregar Nuevo Cliente</button>
        </div>
      </div>
      <div className="cliente-lista">
        <table>
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesActuales.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nombres}</td>
                <td>{cliente.apellidos}</td>
                <td>{cliente.telefono}</td>
                <td>
                  <button onClick={() => abrirModal(cliente, 'ver')}>Más información</button>
                  <button onClick={() => abrirModal(cliente, 'editar')}>Editar</button>
                  <button onClick={() => eliminarCliente(cliente.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
        >
          Anterior
        </button>
        <span>
          Página {paginaActual} de {Math.ceil(clientesFiltrados.length / clientesPorPagina)}
        </span>
        <button
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={
            paginaActual ===
            Math.ceil(clientesFiltrados.length / clientesPorPagina)
          }
        >
          Siguiente
        </button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={cerrarModal}>
              &times;
            </span>
            {clienteEnEdicion ? (
              <div>
                <h2>Editar Cliente</h2>
                <p>
                  <label>
                    Nombres:
                    <input
                      type="text"
                      value={clienteEnEdicion.nombres}
                      onChange={(e) =>
                        setClienteEnEdicion({
                          ...clienteEnEdicion,
                          nombres: e.target.value,
                        })
                      }
                    />
                  </label>
                </p>
                <p>
                  <label>
                    Apellidos:
                    <input
                      type="text"
                      value={clienteEnEdicion.apellidos}
                      onChange={(e) =>
                        setClienteEnEdicion({
                          ...clienteEnEdicion,
                          apellidos: e.target.value,
                        })
                      }
                    />
                  </label>
                </p>
                <p>
                  <label>
                    Dirección:
                    <input
                      type="text"
                      value={clienteEnEdicion.direccion}
                      onChange={(e) =>
                        setClienteEnEdicion({
                          ...clienteEnEdicion,
                          direccion: e.target.value,
                        })
                      }
                    />
                  </label>
                </p>
                <p>
                  <label>
                    Teléfono:
                    <input
                      type="text"
                      value={clienteEnEdicion.telefono}
                      onChange={(e) =>
                        setClienteEnEdicion({
                          ...clienteEnEdicion,
                          telefono: e.target.value,
                        })
                      }
                    />
                  </label>
                </p>
                <p>
                  <label>
                    Email:
                    <input
                      type="email"
                      value={clienteEnEdicion.email}
                      onChange={(e) =>
                        setClienteEnEdicion({
                          ...clienteEnEdicion,
                          email: e.target.value,
                        })
                      }
                    />
                  </label>
                </p>
                <div>
                  <button onClick={() => modificarCliente(clienteEnEdicion)}>Guardar</button>
                  <button onClick={cancelarEdicionCliente}>Cancelar</button>
                </div>
              </div>
            ) : clienteSeleccionado ? (
              <div>
                <h2>{`${clienteSeleccionado.nombres} ${clienteSeleccionado.apellidos}`}</h2>
                <p>Teléfono: {clienteSeleccionado.telefono}</p>
                <p>Dirección: {clienteSeleccionado.direccion}</p>
                <p>Email: {clienteSeleccionado.email}</p>
                <button onClick={() => abrirModal(clienteSeleccionado, 'editar')}>Editar</button>
              </div>
            ) : (
              <AgregarCliente onClose={cerrarModal} onClienteAgregado={obtenerClientes} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ClienteList;