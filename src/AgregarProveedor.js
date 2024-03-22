import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AgregarProveedor.css';

function AgregarProveedor() {
    const navigate = useNavigate();
    const [nuevoProveedor, setNuevoProveedor] = useState({
        nombres: '',
        apellidos: '',
        direccion: '',
        telefono: '',
        email: '',
    });

    const agregarProveedor = (e) => {
        e.preventDefault();
        axios
            .post('https://proyecto.forcewillcode.website/api/proveedores', nuevoProveedor)
            .then((response) => {
                setNuevoProveedor({
                    nombres: '',
                    apellidos: '',
                    direccion: '',
                    telefono: '',
                    email: '',
                });
                // Redirección después de agregar el proveedor
                navigate('/proveedores');
            })
            .catch((error) => {
                console.error('Error al agregar el proveedor:', error);
            });
    };

    return (
        <div className="container">
            <h2>Agregar Nuevo Proveedor</h2>
            <form onSubmit={agregarProveedor}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Nombres"
                        value={nuevoProveedor.nombres}
                        onChange={(e) =>
                            setNuevoProveedor({ ...nuevoProveedor, nombres: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        placeholder="Apellidos"
                        value={nuevoProveedor.apellidos}
                        onChange={(e) =>
                            setNuevoProveedor({ ...nuevoProveedor, apellidos: e.target.value })
                        }
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Dirección"
                        value={nuevoProveedor.direccion}
                        onChange={(e) =>
                            setNuevoProveedor({ ...nuevoProveedor, direccion: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        placeholder="Teléfono"
                        value={nuevoProveedor.telefono}
                        onChange={(e) =>
                            setNuevoProveedor({ ...nuevoProveedor, telefono: e.target.value })
                        }
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={nuevoProveedor.email}
                        onChange={(e) =>
                            setNuevoProveedor({ ...nuevoProveedor, email: e.target.value })
                        }
                    />
                </div>
                <div className="form-group">
                    <button type="submit">Agregar</button>
                </div>
            </form>
        </div>
    );
}

export default AgregarProveedor;