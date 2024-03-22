import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BonificacionesList.css';

function BonificacionesList() {
    const [bonificaciones, setBonificaciones] = useState([]);
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

    return (
        <div>
            <h1 className="titulo">Bonificaciones</h1>
            <div className="bonificaciones-container">
                <div className="bonificaciones-lista">
                    <ul>
                        {bonificaciones.map(bonificacion => (
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
                </div>
                <div className="bonificacion-form">
                    <h2>Agregar Nueva Bonificación</h2>
                    <form onSubmit={agregarBonificacion}>
                        <input type="text" name="nombres" value={nuevaBonificacion.nombres} onChange={handleChange} placeholder="Nombres" />
                        <input type="text" name="apellidos" value={nuevaBonificacion.apellidos} onChange={handleChange} placeholder="Apellidos" />
                        <input type="text" name="direccion" value={nuevaBonificacion.direccion} onChange={handleChange} placeholder="Dirección" />
                        <input type="text" name="telefono" value={nuevaBonificacion.telefono} onChange={handleChange} placeholder="Teléfono" />
                        <input type="email" name="email" value={nuevaBonificacion.email} onChange={handleChange} placeholder="Email" />
                        <button type="submit">Agregar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BonificacionesList;