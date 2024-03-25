import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ComprasList.css';

function ComprasList() {
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [nuevaCompra, setNuevaCompra] = useState({
    proveedorId: '',
    cantidad: 0,
    fecha: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [comprasPorPagina, setComprasPorPagina] = useState(5);
  const [showProductForm, setShowProductForm] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria_id: '',
  });

  useEffect(() => {
    obtenerCompras();
    obtenerProveedores();
  }, []);

  const obtenerCompras = () => {
    axios
      .get('https://proyecto.forcewillcode.website/api/compras')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCompras(response.data);
        } else {
          console.error('La respuesta de la API no contiene un array de compras:', response.data);
          setAlertMessage('Error al obtener las compras');
          setShowAlert(true);
        }
      })
      .catch((error) => {
        console.error('Error al obtener las compras:', error);
        setAlertMessage('Error al obtener las compras');
        setShowAlert(true);
      });
  };

  const obtenerProveedores = () => {
    axios
      .get('https://proyecto.forcewillcode.website/api/proveedores')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProveedores(response.data);
        } else {
          console.error('La respuesta de la API no contiene un array de proveedores:', response.data);
          setAlertMessage('Error al obtener los proveedores');
          setShowAlert(true);
        }
      })
      .catch((error) => {
        console.error('Error al obtener los proveedores:', error);
        setAlertMessage('Error al obtener los proveedores');
        setShowAlert(true);
      });
  };

  const agregarCompra = (e) => {
    e.preventDefault();
    axios
      .post('https://proyecto.forcewillcode.website/api/compras', nuevaCompra)
      .then((response) => {
        setNuevaCompra({
          proveedorId: '',
          cantidad: 0,
          fecha: '',
        });
        setShowModal(false);
        obtenerCompras();
        setAlertMessage('Compra agregada correctamente');
        setShowAlert(true);
      })
      .catch((error) => {
        console.error('Error al agregar la compra:', error);
        setAlertMessage('Error al agregar la compra');
        setShowAlert(true);
      });
  };

  const eliminarCompra = (id) => {
    axios
      .delete(`https://proyecto.forcewillcode.website/api/compras/${id}`)
      .then((response) => {
        obtenerCompras();
        setAlertMessage('Compra eliminada correctamente');
        setShowAlert(true);
      })
      .catch((error) => {
        console.error('Error al eliminar la compra:', error);
        setAlertMessage('Error al eliminar la compra');
        setShowAlert(true);
      });
  };

  const modificarCompra = (id, cantidad) => {
    axios
      .put(`https://proyecto.forcewillcode.website/api/compras/${id}`, { cantidad })
      .then((response) => {
        obtenerCompras();
        setAlertMessage('Compra modificada correctamente');
        setShowAlert(true);
      })
      .catch((error) => {
        console.error('Error al modificar la compra:', error);
        setAlertMessage('Error al modificar la compra');
        setShowAlert(true);
      });
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
  };

  const agregarProducto = (e) => {
    e.preventDefault();
    // Agregar la lógica para enviar el nuevo producto a la API
    console.log('Nuevo producto:', nuevoProducto);
    setNuevoProducto({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoria_id: '',
    });
    setShowProductForm(false);
  };

  const handleNuevoProductoChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const indexOfLastCompra = currentPage * comprasPorPagina;
  const indexOfFirstCompra = indexOfLastCompra - comprasPorPagina;
  const comprasActuales = compras.slice(indexOfFirstCompra, indexOfLastCompra);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h1>Dashboard de Compras</h1>

      {showAlert && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseAlert}>
              &times;
            </span>
            <p>{alertMessage}</p>
          </div>
        </div>
      )}

      <div className="nueva-compra">
        <button className="btn" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus"></i> Nueva Compra
        </button>
        <button className="btn" onClick={() => setShowProductForm(true)}>
          <i className="fas fa-plus"></i> Nuevo Producto
        </button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>Nueva Compra</h2>
            <form onSubmit={agregarCompra}>
              <div>
                <select
                  value={nuevaCompra.proveedorId}
                  onChange={(e) => setNuevaCompra({ ...nuevaCompra, proveedorId: e.target.value })}
                >
                  <option value="">Seleccionar Proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombres} {proveedor.apellidos}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="number"
                  value={nuevaCompra.cantidad}
                  onChange={(e) => setNuevaCompra({ ...nuevaCompra, cantidad: e.target.value })}
                  placeholder="Cantidad"
                />
              </div>
              <div>
                <input
                  type="date"
                  value={nuevaCompra.fecha}
                  onChange={(e) => setNuevaCompra({ ...nuevaCompra, fecha: e.target.value })}
                />
              </div>
              <div>
                <button type="submit" className="btn">
                  <i className="fas fa-plus"></i> Agregar Compra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProductForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowProductForm(false)}>
              &times;
            </span>
            <h2>Nuevo Producto</h2>
            <form onSubmit={agregarProducto}>
              <div>
                <input
                  type="text"
                  name="nombre"
                  value={nuevoProducto.nombre}
                  placeholder="Nombre"
                  onChange={handleNuevoProductoChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="descripcion"
                  value={nuevoProducto.descripcion}
                  placeholder="Descripción"
                  onChange={handleNuevoProductoChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="precio"
                  value={nuevoProducto.precio}
                  placeholder="Precio"
                  onChange={handleNuevoProductoChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="stock"
                  value={nuevoProducto.stock}
                  placeholder="Stock"
                  onChange={handleNuevoProductoChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="categoria_id"
                  value={nuevoProducto.categoria_id}
                  placeholder="Categoría ID"
                  onChange={handleNuevoProductoChange}
                />
              </div>
              <div>
                <button type="submit" className="btn">
                  <i className="fas fa-plus"></i> Agregar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="lista-compras">
        <h2>
          <i className="fas fa-list"></i> Compras Realizadas
        </h2>
        <ul>
          {comprasActuales.length > 0 ? (
            comprasActuales.map((compra) => (
              <li key={compra.id} className="compra-item">
                <div>
                  <strong>Proveedor ID:</strong> {compra.proveedorId}
                  <br />
                  <strong>Cantidad:</strong> {compra.cantidad}
                  <br />
                  <strong>Fecha:</strong> {compra.fecha}
                </div>
                <div className="acciones-compra">
                  <button onClick={() => eliminarCompra(compra.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                  <input
                    type="number"
                    value={compra.cantidad}
                    onChange={(e) => modificarCompra(compra.id, e.target.value)}
                  />
                  <button onClick={() => modificarCompra(compra.id, compra.cantidad)}>
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li>No hay compras disponibles</li>
          )}
        </ul>
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          {Array.from(Array(Math.ceil(compras.length / comprasPorPagina)), (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastCompra >= compras.length}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComprasList;