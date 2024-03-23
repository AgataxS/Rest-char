import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DetalleComprasList.css'; // Importa el archivo CSS

function DetalleComprasList() {
    const [productos, setProductos] = useState([]);
    const [compra, setCompra] = useState({
        productoId: '',
        cantidad: 1 
    });
    const [busqueda, setBusqueda] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [alerta, setAlerta] = useState('');

    useEffect(() => {
        obtenerProductos();
    }, []);

    const obtenerProductos = () => {
        axios.get('https://proyecto.forcewillcode.website/api/productos')
            .then(response => {
                console.log('Respuesta de la API (Productos):', response.data);
                setProductos(response.data.productos);
            })
            .catch(error => {
                console.error('Error al obtener los productos:', error);
            });
    };

    const agregarProductoACompra = () => {
        // Aquí puedes implementar la lógica para agregar el producto a la compra
        console.log('Producto agregado a la compra:', compra);
        // Aquí puedes enviar la compra al backend o hacer cualquier otra acción necesaria
        setAlerta('Producto agregado a la compra.');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Función para filtrar los productos según la búsqueda
    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="detalle-compras-container">
            <h1>Detalle de Compras</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>
            <ul className="productos-list">
                {productosFiltrados.map(producto => (
                    <li key={producto.id} className="producto-item">
                        <div>
                            Nombre: {producto.nombre}<br />
                            Descripción: {producto.descripcion}<br />
                            Precio: {producto.precio}<br />
                            Stock: {producto.stock}<br />
                            <button onClick={() => setCompra({ productoId: producto.id, cantidad: 1 })}>
                                Agregar a Compra
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="compra-actual">
                <h2>Compra Actual</h2>
                <label>Producto:</label>
                <select
                    value={compra.productoId}
                    onChange={(e) => setCompra({ ...compra, productoId: e.target.value })}
                >
                    <option value="">Seleccionar Producto</option>
                    {productos.map(producto => (
                        <option key={producto.id} value={producto.id}>{producto.nombre}</option>
                    ))}
                </select>
                <label>Cantidad:</label>
                <input
                    type="number"
                    value={compra.cantidad}
                    onChange={(e) => setCompra({ ...compra, cantidad: e.target.value })}
                />
                <button onClick={agregarProductoACompra}>Agregar a Compra</button>
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <p>{alerta}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DetalleComprasList;
