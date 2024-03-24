import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DetalleComprasList.css';

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
        console.log('Producto agregado a la compra:', compra);
        setAlerta('Producto agregado a la compra.');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleDownloadPDF = () => {
        // Implementa la lógica para descargar los productos en formato PDF
        console.log('Descargar PDF');
    };

    const handleDownloadExcel = () => {
        // Implementa la lógica para descargar los productos en formato Excel
        console.log('Descargar Excel');
    };

    const handlePrint = () => {
        // Implementa la lógica para imprimir los productos
        console.log('Imprimir');
    };

    return (
        <div className="detalle-compras-container">
            <h1>Detalle de Compras</h1>
            <div className="search-add-container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                <div className="add-compra">
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
                <div className="download-options">
                    <button onClick={handleDownloadPDF}>Descargar PDF</button>
                    <button onClick={handleDownloadExcel}>Descargar Excel</button>
                    <button onClick={handlePrint}>Imprimir</button>
                </div>
            </div>
            <ul className="productos-list">
                {productosFiltrados.map(producto => (
                    <li key={producto.id} className="producto-item">
                        <div>
                            Nombre: {producto.nombre}<br />
                            Descripción: {producto.descripcion}<br />
                            Precio: {producto.precio}<br />
                            Stock: {producto.stock}<br />
                        </div>
                    </li>
                ))}
            </ul>
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