import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProveedoresList.css';

function ProveedoresList() {
    const [proveedores, setProveedores] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [proveedorEnEdicion, setProveedorEnEdicion] = useState(null);

    useEffect(() => {
        obtenerProveedores();
    }, []);

    const obtenerProveedores = () => {
        axios.get('https://proyecto.forcewillcode.website/api/proveedores')
            .then(response => {
                setProveedores(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los proveedores:', error);
            });
    };

    const eliminarProveedor = (id) => {
        axios.delete(`https://proyecto.forcewillcode.website/api/proveedores/${id}`)
            .then(response => {
                obtenerProveedores();
            })
            .catch(error => {
                console.error('Error al eliminar el proveedor:', error);
            });
    };

    const iniciarEdicionProveedor = (proveedor) => {
        setProveedorEnEdicion(proveedor);
    };

    const cancelarEdicionProveedor = () => {
        setProveedorEnEdicion(null);
    };

    const modificarProveedor = (proveedorModificado) => {
        axios.put(`https://proyecto.forcewillcode.website/api/proveedores/${proveedorModificado.id}`, proveedorModificado)
            .then(response => {
                obtenerProveedores();
                setProveedorEnEdicion(null);
            })
            .catch(error => {
                console.error('Error al modificar el proveedor:', error);
            });
    };

    const handleInputChange = (e, fieldName, id) => {
        const newValue = e.target.value;
        setProveedores(prevState =>
            prevState.map(proveedor => {
                if (proveedor.id === id) {
                    return { ...proveedor, [fieldName]: newValue };
                }
                return proveedor;
            })
        );
    };

    const guardarCambios = (id) => {
        const proveedorModificado = proveedores.find(proveedor => proveedor.id === id);
        if (proveedorModificado) {
            modificarProveedor(proveedorModificado);
        }
    };

    const clientesFiltrados = proveedores.filter(
        (proveedor) =>
            proveedor.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
            proveedor.apellidos.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="container">
            <h1>Listado de Proveedores</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar proveedor..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>
            <div className="proveedor-lista">
                <table>
                    <thead>
                        <tr>
                            <th>Nombres</th>
                            <th>Apellidos</th>
                            <th>Dirección</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientesFiltrados.map((proveedor) => (
                            <tr key={proveedor.id}>
                                <td>
                                    {proveedorEnEdicion && proveedorEnEdicion.id === proveedor.id ? (
                                        <input
                                            type="text"
                                            value={proveedor.nombres}
                                            onChange={(e) => handleInputChange(e, 'nombres', proveedor.id)}
                                        />
                                    ) : (
                                        proveedor.nombres
                                    )}
                                </td>
                                <td>
                                    {proveedorEnEdicion && proveedorEnEdicion.id === proveedor.id ? (
                                        <input
                                            type="text"
                                            value={proveedor.apellidos}
                                            onChange={(e) => handleInputChange(e, 'apellidos', proveedor.id)}
                                        />
                                    ) : (
                                        proveedor.apellidos
                                    )}
                                </td>
                                <td>
                                    {proveedorEnEdicion && proveedorEnEdicion.id === proveedor.id ? (
                                        <input
                                            type="text"
                                            value={proveedor.direccion}
                                            onChange={(e) => handleInputChange(e, 'direccion', proveedor.id)}
                                        />
                                    ) : (
                                        proveedor.direccion
                                    )}
                                </td>
                                <td>
                                    {proveedorEnEdicion && proveedorEnEdicion.id === proveedor.id ? (
                                        <input
                                            type="text"
                                            value={proveedor.telefono}
                                            onChange={(e) => handleInputChange(e, 'telefono', proveedor.id)}
                                        />
                                    ) : (
                                        proveedor.telefono
                                    )}
                                </td>
                                <td>
                                    {proveedorEnEdicion && proveedorEnEdicion.id === proveedor.id ? (
                                        <input
                                            type="email"
                                            value={proveedor.email}
                                            onChange={(e) => handleInputChange(e, 'email', proveedor.id)}
                                        />
                                    ) : (
                                        proveedor.email
                                    )}
                                </td>
                                <td>
                                    {proveedorEnEdicion && proveedorEnEdicion.id === proveedor.id ? (
                                        <>
                                            <button onClick={() => guardarCambios(proveedor.id)}>Guardar</button>
                                            <button onClick={cancelarEdicionProveedor}>Cancelar</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => eliminarProveedor(proveedor.id)}>Eliminar</button>
                                            <button onClick={() => iniciarEdicionProveedor(proveedor)}>Editar</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProveedoresList;
