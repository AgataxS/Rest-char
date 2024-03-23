import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import './IngresosList.css';

function IngresosList() {
    const [ingresos, setIngresos] = useState([]);
    const [ventas, setVentas] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [lineasAMostrar, setLineasAMostrar] = useState(5);
    const [paginaActual, setPaginaActual] = useState(1);
    const [error, setError] = useState(null);

    useEffect(() => {
        obtenerDatos();
    }, []);

    const obtenerDatos = async () => {
        try {
            const respuesta = await axios.get('https://proyecto.forcewillcode.website/api/ingresos');

            if (respuesta.data && Array.isArray(respuesta.data.ingresos) && Array.isArray(respuesta.data.ventas)) {
                setIngresos(respuesta.data.ingresos);
                setVentas(respuesta.data.ventas);
            } else {
                setError('La respuesta de la API no tiene el formato esperado');
            }
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setError('Error al obtener los datos');
        }
    };

    // Función para filtrar los ingresos y ventas según la búsqueda
    const datos = useMemo(
        () =>
            [...ingresos, ...ventas].filter(
                (dato) =>
                    dato.fecha_venta.toLowerCase().includes(busqueda.toLowerCase()) ||
                    dato.cliente_id.toString().toLowerCase().includes(busqueda.toLowerCase()) ||
                    dato.vendedor_id.toString().toLowerCase().includes(busqueda.toLowerCase())
            ),
        [ingresos, ventas, busqueda]
    );

    // Función para obtener los datos que se mostrarán en la tabla según la paginación
    const obtenerDatosPaginados = useMemo(() => {
        const indiceInicio = (paginaActual - 1) * lineasAMostrar;
        const indiceFinal = indiceInicio + lineasAMostrar;
        return datos.slice(indiceInicio, indiceFinal);
    }, [datos, paginaActual, lineasAMostrar]);

    // Función para manejar el cambio en el número de líneas a mostrar
    const handleLineasAMostrarChange = (e) => {
        setLineasAMostrar(Number(e.target.value));
        setPaginaActual(1); // Reiniciar la página actual al cambiar el número de líneas a mostrar
    };

    return (
        <div className="ingresos-container">
            <h1 className="ingresos-header">Listado de Ingresos y Ventas</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="search-add-container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar ingreso o venta..."
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
                        {obtenerDatosPaginados.map((dato) => (
                            <tr key={dato.id}>
                                <td>{dato.fecha_venta}</td>
                                <td>{dato.total}</td>
                                <td>{dato.cliente_id}</td>
                                <td>{dato.vendedor_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="paginacion">
                    <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>
                        Anterior
                    </button>
                    <span>Página {paginaActual}</span>
                    <button
                        disabled={obtenerDatosPaginados.length < lineasAMostrar}
                        onClick={() => setPaginaActual(paginaActual + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}

export default IngresosList;