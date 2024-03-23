import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import './BonificacionesList.css';
import Modal from 'react-modal';

function BonificacionesList() {
    const [bonificaciones, setBonificaciones] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [lineasAMostrar, setLineasAMostrar] = useState(5);
    const [paginaActual, setPaginaActual] = useState(1);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [nuevaBonificacion, setNuevaBonificacion] = useState({
        nombres: '',
        apellidos: '',
        direccion: '',
        telefono: '',
        email: ''
    });

    useEffect(() => {
        obtenerBonificaciones();
    }, []);

    const obtenerBonificaciones = () => {
        axios.get('https://proyecto.forcewillcode.website/api/bonificaciones')
            .then(response => {
                setBonificaciones(response.data);
            })
            .catch(error => {
                console.error('Error al obtener las bonificaciones:', error);
            });
    };

    const agregarBonificacion = () => {
        axios.post('https://proyecto.forcewillcode.website/api/bonificaciones', nuevaBonificacion)
            .then(response => {
                setNuevaBonificacion({
                    nombres: '',
                    apellidos: '',
                    direccion: '',
                    telefono: '',
                    email: ''
                });
                obtenerBonificaciones();
                setModalAbierto(false);
            })
            .catch(error => {
                console.error('Error al agregar la bonificación:', error);
            });
    };

    const eliminarBonificacion = (id) => {
        axios.delete(`https://proyecto.forcewillcode.website/api/bonificaciones/${id}`)
            .then(response => {
                obtenerBonificaciones();
            })
            .catch(error => {
                console.error('Error al eliminar la bonificación:', error);
            });
    };

    const modificarBonificacion = (id, bonificacionModificada) => {
        axios.put(`https://proyecto.forcewillcode.website/api/bonificaciones/${id}`, bonificacionModificada)
            .then(response => {
                obtenerBonificaciones();
            })
            .catch(error => {
                console.error('Error al modificar la bonificación:', error);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevaBonificacion(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const bonificacionesFiltradas = useMemo(
        () =>
            bonificaciones.filter(
                (bonificacion) =>
                    bonificacion.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
                    bonificacion.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
                    bonificacion.direccion.toLowerCase().includes(busqueda.toLowerCase()) ||
                    bonificacion.telefono.toLowerCase().includes(busqueda.toLowerCase()) ||
                    bonificacion.email.toLowerCase().includes(busqueda.toLowerCase())
            ),
        [bonificaciones, busqueda]
    );

    const obtenerBonificacionesPaginadas = useMemo(() => {
        const indiceInicio = (paginaActual - 1) * lineasAMostrar;
        const indiceFinal = indiceInicio + lineasAMostrar;
        return bonificacionesFiltradas.slice(indiceInicio, indiceFinal);
    }, [bonificacionesFiltradas, paginaActual, lineasAMostrar]);

    const handleLineasAMostrarChange = (e) => {
        setLineasAMostrar(Number(e.target.value));
        setPaginaActual(1);
    };

    return (
        <div className="bonificaciones-container">
            <h1 className="bonificaciones-header">Listado de Bonificaciones</h1>
            <div className="search-add-container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar bonificación..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                <div className="add-button">
                    <button onClick={() => setModalAbierto(true)}>Agregar Bonificación</button>
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
            <div className="bonificaciones-lista">
                <ul>
                    {obtenerBonificacionesPaginadas.map(bonificacion => (
                        <li key={bonificacion.id}>
                            <div className="bonificacion-item">
                                <div className="bonificacion-info">
                                    <div>ID: {bonificacion.id}</div>
                                    <div>Nombres: {bonificacion.nombres}</div>
                                    <div>Apellidos: {bonificacion.apellidos}</div>
                                    <div>Dirección: {bonificacion.direccion}</div>
                                    <div>Teléfono: {bonificacion.telefono}</div>
                                    <div>Email: {bonificacion.email}</div>
                                </div>
                                <div className="bonificacion-buttons">
                                    <button onClick={() => eliminarBonificacion(bonificacion.id)}>Eliminar</button>
                                    <button onClick={() => modificarBonificacion(bonificacion.id, { nombres: 'Nuevo nombre' })}>Modificar</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="paginacion">
                    <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>
                        Anterior
                    </button>
                    <span>Página {paginaActual}</span>
                    <button
                        disabled={obtenerBonificacionesPaginadas.length < lineasAMostrar}
                        onClick={() => setPaginaActual(paginaActual + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
            <Modal
                isOpen={modalAbierto}
                onRequestClose={() => setModalAbierto(false)}
                contentLabel="Agregar Bonificación"
            >
                <h2>Agregar Nueva Bonificación</h2>
                <form onSubmit={agregarBonificacion}>
                    <input type="text" name="nombres" value={nuevaBonificacion.nombres} onChange={handleChange} placeholder="Nombres" />
                    <input type="text" name="apellidos" value={nuevaBonificacion.apellidos} onChange={handleChange} placeholder="Apellidos" />
                    <input type="text" name="direccion" value={nuevaBonificacion.direccion} onChange={handleChange} placeholder="Dirección" />
                    <input type="text" name="telefono" value={nuevaBonificacion.telefono} onChange={handleChange} placeholder="Teléfono" />
                    <input type="email" name="email" value={nuevaBonificacion.email} onChange={handleChange} placeholder="Email" />
                    <button type="submit">Agregar</button>
                </form>
            </Modal>
        </div>
    );
}

export default BonificacionesList;