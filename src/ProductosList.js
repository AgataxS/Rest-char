import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductosList.css'; // Asegúrate de tener el archivo CSS para los estilos

function ProductosList() {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria_id: ''
    });

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

    const agregarProducto = () => {
        axios.post('https://proyecto.forcewillcode.website/api/productos', nuevoProducto)
            .then(response => {
                console.log('Producto agregado:', response.data);
                setNuevoProducto({
                    nombre: '',
                    descripcion: '',
                    precio: '',
                    stock: '',
                    categoria_id: ''
                });
                obtenerProductos(); // Actualizar la lista de productos después de agregar uno nuevo
                setShowModal(false); // Cerrar la ventana modal después de agregar el producto
            })
            .catch(error => {
                console.error('Error al agregar el producto:', error);
            });
    };

    const eliminarProducto = (id) => {
        axios.delete(`https://proyecto.forcewillcode.website/api/productos/${id}`)
            .then(response => {
                console.log('Producto eliminado:', response.data);
                obtenerProductos(); // Actualizar la lista de productos después de eliminar uno
            })
            .catch(error => {
                console.error('Error al eliminar el producto:', error);
            });
    };

    const handleInputChange = (e) => {
        setBusqueda(e.target.value);
    };

    return (
        <div className="container">
            <h1>Listado de Productos</h1>
            <div className="search-add-container">
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={handleInputChange}
                />
                <button className="btn" onClick={() => setShowModal(true)}>Agregar Producto</button>
            </div>
            {/* Ventana modal para agregar un nuevo producto */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>Agregar Nuevo Producto</h2>
                        <input type="text" value={nuevoProducto.nombre} placeholder="Nombre" onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })} />
                        <input type="text" value={nuevoProducto.descripcion} placeholder="Descripción" onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })} />
                        <input type="text" value={nuevoProducto.precio} placeholder="Precio" onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })} />
                        <input type="text" value={nuevoProducto.stock} placeholder="Stock" onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })} />
                        <input type="text" value={nuevoProducto.categoria_id} placeholder="Categoría ID" onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria_id: e.target.value })} />
                        <button onClick={agregarProducto}>Agregar Producto</button>
                    </div>
                </div>
            )}
            {}
            <div className="producto-lista">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Categoría ID</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map(producto => (
                            <tr key={producto.id}>
                                <td>{producto.nombre}</td>
                                <td>{producto.descripcion}</td>
                                <td>{producto.precio}</td>
                                <td>{producto.stock}</td>
                                <td>{producto.categoria_id}</td>
                                <td>
                                    <button onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
                                    {}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductosList;
