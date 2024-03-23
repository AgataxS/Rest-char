import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './ProveedoresList.css';

function ProveedoresList() {
    const [proveedores, setProveedores] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [proveedorEnEdicion, setProveedorEnEdicion] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [nuevoProveedor, setNuevoProveedor] = useState({
        nombres: '',
        apellidos: '',
        direccion: '',
        telefono: '',
        email: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Cambia el número de elementos por página según tus necesidades

    useEffect(() => {
        obtenerProveedores();
    }, [currentPage, itemsPerPage]); // Actualiza la lista de proveedores cuando cambia la página o la cantidad de elementos por página

    const obtenerProveedores = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        axios.get(`https://proyecto.forcewillcode.website/api/proveedores?_start=${startIndex}&_limit=${itemsPerPage}`)
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

    const handleNuevoProveedorChange = (e) => {
        const { name, value } = e.target;
        setNuevoProveedor(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const agregarProveedor = (e) => {
        e.preventDefault();
        axios.post('https://proyecto.forcewillcode.website/api/proveedores', nuevoProveedor)
            .then(response => {
                setNuevoProveedor({
                    nombres: '',
                    apellidos: '',
                    direccion: '',
                    telefono: '',
                    email: ''
                });
                obtenerProveedores();
                setModalAbierto(false);
            })
            .catch(error => {
                console.error('Error al agregar el proveedor:', error);
            });
    };

    const proveedoresFiltrados = useMemo(() => {
        return proveedores.filter(
            (proveedor) =>
                proveedor.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
                proveedor.apellidos.toLowerCase().includes(busqueda.toLowerCase())
        );
    }, [proveedores, busqueda]);

    const totalPages = Math.ceil(proveedoresFiltrados.length / itemsPerPage);

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reinicia la página al cambiar la cantidad de elementos por página
    };

    const obtenerProveedoresPaginados = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return proveedoresFiltrados.slice(startIndex, startIndex + itemsPerPage);
    }, [currentPage, itemsPerPage, proveedoresFiltrados]);

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
                <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                    <option value={5}>5 por página</option>
                    <option value={10}>10 por página</option>
                    <option value={15}>15 por página</option>
                </select>
                <button onClick={() => setModalAbierto(true)}>Añadir Proveedor</button>
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
                        {obtenerProveedoresPaginados.map((proveedor) => (
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
                                    {proveedorEnEdicion && proveedorEnEdicion.id === proveedor.id
                                    ? (
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
            <div className="pagination">
                <button onClick={() => setCurrentPage(prevPage => prevPage > 1 ? prevPage - 1 : prevPage)}>Anterior</button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={() => setCurrentPage(prevPage => prevPage < totalPages ? prevPage + 1 : prevPage)}>Siguiente</button>
            </div>
            <Modal
                isOpen={modalAbierto}
                onRequestClose={() => setModalAbierto(false)}
                contentLabel="Agregar Proveedor"
            >
                <h2>Agregar Nuevo Proveedor</h2>
                <form onSubmit={agregarProveedor}>
                    <input type="text" name="nombres" value={nuevoProveedor.nombres} onChange={handleNuevoProveedorChange} placeholder="Nombres" />
                    <input type="text" name="apellidos" value={nuevoProveedor.apellidos} onChange={handleNuevoProveedorChange} placeholder="Apellidos" />
                    <input type="text" name="direccion" value={nuevoProveedor.direccion} onChange={handleNuevoProveedorChange} placeholder="Dirección" />
                    <input type="text" name="telefono" value={nuevoProveedor.telefono} onChange={handleNuevoProveedorChange} placeholder="Teléfono" />
                    <input type="email" name="email" value={nuevoProveedor.email} onChange={handleNuevoProveedorChange} placeholder="Email" />
                    <button type="submit">Agregar</button>
                </form>
            </Modal>
        </div>
    );
}

export default ProveedoresList;
