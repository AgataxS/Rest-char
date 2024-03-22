import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './IngresosList.css'; // Importar el archivo CSS

function IngresosList() {
    const [ingresos, setIngresos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [lineasAMostrar, setLineasAMostrar] = useState(5);
    const [paginaActual, setPaginaActual] = useState(1);

    useEffect(() => {
        obtenerIngresos();
    }, []);

    const obtenerIngresos = () => {
        axios.get('https://proyecto.forcewillcode.website/api/ingresos')
            .then(response => {
                console.log('Respuesta de la API (Ingresos):', response.data);
                setIngresos(response.data.ingresos);
            })
            .catch(error => {
                console.error('Error al obtener los ingresos:', error);
            });
    };

    // Función para filtrar los ingresos según la búsqueda
    const ingresosFiltrados = ingresos.filter(ingreso =>
        ingreso.fecha_venta.toLowerCase().includes(busqueda.toLowerCase()) ||
        ingreso.cliente_id.toLowerCase().includes(busqueda.toLowerCase()) ||
        ingreso.vendedor_id.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Función para obtener los ingresos que se mostrarán en la tabla según la paginación
    const obtenerIngresosPaginados = () => {
        const indiceInicio = (paginaActual - 1) * lineasAMostrar;
        const indiceFinal = indiceInicio + lineasAMostrar;
        return ingresosFiltrados.slice(indiceInicio, indiceFinal);
    };

    // Función para manejar el cambio en el número de líneas a mostrar
    const handleLineasAMostrarChange = (e) => {
        setLineasAMostrar(Number(e.target.value));
        setPaginaActual(1); // Reiniciar la página actual al cambiar el número de líneas a mostrar
    };

    return (
        <div className="ingresos-container">
            <h1 className="ingresos-header">Listado de Ingresos</h1>
            <div className="search-add-container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar ingreso..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
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
            <div className="ingresos-lista">
                <table className="tabla-ingresos">
                    <thead>
                        <tr>
                            <th>Fecha de Venta</th>
                            <th>Total</th>
                            <th>Cliente ID</th>
                            <th>Vendedor ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {obtenerIngresosPaginados().map(ingreso => (
                            <tr key={ingreso.id}>
                                <td>{ingreso.fecha_venta}</td>
                                <td>{ingreso.total}</td>
                                <td>{ingreso.cliente_id}</td>
                                <td>{ingreso.vendedor_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="paginacion">
                    <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>Anterior</button>
                    <span>Página {paginaActual}</span>
                    <button disabled={obtenerIngresosPaginados().length < lineasAMostrar} onClick={() => setPaginaActual(paginaActual + 1)}>Siguiente</button>
                </div>
            </div>
        </div>
    );
}

export default IngresosList;
