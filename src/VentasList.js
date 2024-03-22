import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VentasList.css'; // Importa el archivo CSS

function VentasList() {
    const [ventas, setVentas] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [nuevaVenta, setNuevaVenta] = useState({
        fecha_venta: '',
        total: 0,
        cliente_id: '',
        vendedor_id: '',
    });
    const [ventaEnEdicion, setVentaEnEdicion] = useState(null);
    const [lineasAMostrar, setLineasAMostrar] = useState(5);
    const [paginaActual, setPaginaActual] = useState(1);

    useEffect(() => {
        obtenerVentas();
    }, []);

    const obtenerVentas = () => {
        axios.get('https://proyecto.forcewillcode.website/api/ventas')
            .then(response => {
                setVentas(response.data.ventas);
            })
            .catch(error => {
                console.error('Error al obtener las ventas:', error);
            });
    };

    const eliminarVenta = (id) => {
        axios.delete(`https://proyecto.forcewillcode.website/api/ventas/${id}`)
            .then(response => {
                obtenerVentas();
            })
            .catch(error => {
                console.error('Error al eliminar la venta:', error);
            });
    };

    const agregarVenta = () => {
        axios.post('https://proyecto.forcewillcode.website/api/ventas', nuevaVenta)
            .then((response) => {
                setNuevaVenta({
                    fecha_venta: '',
                    total: 0,
                    cliente_id: '',
                    vendedor_id: '',
                });
                obtenerVentas(); // Actualizar la lista de ventas después de agregar una nueva
                setShowModal(false); // Cerrar la ventana modal después de agregar la venta
            })
            .catch((error) => {
                console.error('Error al agregar la venta:', error);
            });
    };

    const modificarVenta = (ventaModificada) => {
        axios.put(`https://proyecto.forcewillcode.website/api/ventas/${ventaModificada.id}`, ventaModificada)
            .then(response => {
                obtenerVentas();
                setVentaEnEdicion(null);
            })
            .catch(error => {
                console.error('Error al modificar la venta:', error);
            });
    };

    const handleInputChange = (e, fieldName) => {
        const value = e.target.value;
        setNuevaVenta(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
    };

    // Función para obtener las ventas que se mostrarán en la tabla según la paginación
    const obtenerVentasPaginadas = () => {
        const indiceInicio = (paginaActual - 1) * lineasAMostrar;
        const indiceFinal = indiceInicio + lineasAMostrar;
        return ventas.slice(indiceInicio, indiceFinal);
    };

    // Función para manejar el cambio en el número de líneas a mostrar
    const handleLineasAMostrarChange = (e) => {
        setLineasAMostrar(Number(e.target.value));
        setPaginaActual(1); // Reiniciar la página actual al cambiar el número de líneas a mostrar
    };

    return (
        <div className="container">
            <h1 className="ventas-header">Listado de Ventas</h1>
            <div className="search-add-container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar venta..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                <div className="add-venta">
                    <button className="btn" onClick={() => setShowModal(true)}>Agregar Venta</button>
                </div>
                <div className="lineas-a-mostrar">
                    <span>Líneas a mostrar:</span>
                    <select value={lineasAMostrar} onChange={handleLineasAMostrarChange}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                    </select>
                </div>
            </div>
            {/* Agregar Venta Modal */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>Agregar Nueva Venta</h2>
                        <input type="date" value={nuevaVenta.fecha_venta} onChange={(e) => handleInputChange(e, 'fecha_venta')} />
                        <input type="number" value={nuevaVenta.total} placeholder="Total" onChange={(e) => handleInputChange(e, 'total')} />
                        <input type="text" value={nuevaVenta.cliente_id} placeholder="Cliente ID" onChange={(e) => handleInputChange(e, 'cliente_id')} />
                        <input type="text" value={nuevaVenta.vendedor_id} placeholder="Vendedor ID" onChange={(e) => handleInputChange(e, 'vendedor_id')} />
                        <button onClick={agregarVenta}>Agregar Venta</button>
                    </div>
                </div>
            )}
            <div className="ventas-lista">
                <table className="tabla-ventas">
                    <thead>
                        <tr>
                            <th>Fecha de Venta</th>
                            <th>Total</th>
                            <th>Cliente ID</th>
                            <th>Vendedor ID</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {obtenerVentasPaginadas().map(venta => (
                            <tr key={venta.id}>
                                <td>{venta.fecha_venta}</td>
                                <td>{venta.total}</td>
                                <td>{venta.cliente_id}</td>
                                <td>{venta.vendedor_id}</td>
                                <td>
                                    <button onClick={() => eliminarVenta(venta.id)}>Eliminar</button>
                                    <button onClick={() => setVentaEnEdicion(venta)}>Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="paginacion">
                    <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>Anterior</button>
                    <span>Página {paginaActual}</span>
                    <button disabled={obtenerVentasPaginadas().length < lineasAMostrar} onClick={() => setPaginaActual(paginaActual + 1)}>Siguiente</button>
                </div>
            </div>
        </div>
    );
}

export default VentasList;
