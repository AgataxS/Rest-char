import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EgresosList.css'; // Asegúrate de tener el archivo CSS correspondiente

function EgresosList() {
    const [egresos, setEgresos] = useState([]);
    const [nuevoEgreso, setNuevoEgreso] = useState({
        descripcion: '',
        monto: 0
    });
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        obtenerEgresos();
    }, []);

    const obtenerEgresos = () => {
        axios.get('https://proyecto.forcewillcode.website/api/egresos')
            .then(response => {
                console.log('Respuesta de la API (Egresos):', response.data);
                setEgresos(response.data.egresos);
            })
            .catch(error => {
                console.error('Error al obtener los egresos:', error);
            });
    };

    const agregarEgreso = (e) => {
        e.preventDefault();
        axios.post('https://proyecto.forcewillcode.website/api/egresos', nuevoEgreso)
            .then(response => {
                console.log('Egreso agregado:', response.data);
                setNuevoEgreso({
                    descripcion: '',
                    monto: 0
                });
                obtenerEgresos();
                setShowModal(false);
                setAlertMessage('Egreso agregado correctamente');
                setShowAlert(true);
            })
            .catch(error => {
                console.error('Error al agregar el egreso:', error);
                setAlertMessage('Error al agregar el egreso');
                setShowAlert(true);
            });
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
        setAlertMessage('');
    };

    return (
        <div className="container">
            <div className="content">
                <h1>Registro de Egresos</h1>

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

                <div className="nuevo-egreso">
                    <button className="btn" onClick={() => setShowModal(true)}>
                        <i className="fas fa-plus"></i> Nuevo Egreso
                    </button>
                </div>

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setShowModal(false)}>
                                &times;
                            </span>
                            <h2>Nuevo Egreso</h2>
                            <form onSubmit={agregarEgreso}>
                                <input
                                    type="text"
                                    value={nuevoEgreso.descripcion}
                                    onChange={(e) => setNuevoEgreso({ ...nuevoEgreso, descripcion: e.target.value })}
                                    placeholder="Descripción"
                                />
                                <input
                                    type="number"
                                    value={nuevoEgreso.monto}
                                    onChange={(e) => setNuevoEgreso({ ...nuevoEgreso, monto: e.target.value })}
                                    placeholder="Monto"
                                />
                                <button type="submit" className="btn">
                                    <i className="fas fa-plus"></i> Agregar Egreso
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="lista-egresos">
                    <h2>Egresos Registrados</h2>
                    <ul>
                        {egresos.map(egreso => (
                            <li key={egreso.id}>
                                <div>
                                    Descripción: {egreso.descripcion}<br />
                                    Monto: {egreso.monto}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default EgresosList;
