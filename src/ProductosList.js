import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductosList.css';

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
    const [ventaProducto, setVentaProducto] = useState({
        producto: null,
        cantidad: 1,
        descuento: 0
    });
    const [totalVenta, setTotalVenta] = useState(0);

    useEffect(() => {
        obtenerProductos();
    }, []);

    const obtenerProductos = () => {
        axios.get('https://proyecto.forcewillcode.website/api/productos')
            .then(response => {
                setProductos(response.data.productos);
            })
            .catch(error => {
                console.error('Error al obtener los productos:', error);
            });
    };

    const agregarProducto = () => {
        axios.post('https://proyecto.forcewillcode.website/api/productos', nuevoProducto)
            .then(response => {
                setNuevoProducto({
                    nombre: '',
                    descripcion: '',
                    precio: '',
                    stock: '',
                    categoria_id: ''
                });
                obtenerProductos();
                setShowModal(false);
            })
            .catch(error => {
                console.error('Error al agregar el producto:', error);
            });
    };

    const eliminarProducto = (id) => {
        axios.delete(`https://proyecto.forcewillcode.website/api/productos/${id}`)
            .then(response => {
                obtenerProductos();
            })
            .catch(error => {
                console.error('Error al eliminar el producto:', error);
            });
    };

    const handleInputChange = (e) => {
        setBusqueda(e.target.value);
    };

    const handleNuevoProductoChange = (e) => {
        setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
    };

    const handleVentaProductoChange = (e, field) => {
        setVentaProducto({ ...ventaProducto, [field]: e.target.value });
    };

    const calcularTotalVenta = () => {
        const { producto, cantidad, descuento } = ventaProducto;
        if (producto) {
            const precioTotal = producto.precio * cantidad;
            const descuentoAplicado = precioTotal * (descuento / 100);
            const totalConDescuento = precioTotal - descuentoAplicado;
            setTotalVenta(totalConDescuento);
        } else {
            setTotalVenta(0);
        }
    };

    const realizarVenta = () => {
        // Aquí debes enviar la información de la venta a tu componente VentasList
        const ventaRealizada = {
            producto: ventaProducto.producto,
            cantidad: ventaProducto.cantidad,
            descuento: ventaProducto.descuento,
            total: totalVenta
        };
        console.log('Venta realizada:', ventaRealizada);

        // Resetear el formulario de venta
        setVentaProducto({
            producto: null,
            cantidad: 1,
            descuento: 0
        });
        setTotalVenta(0);
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
                <button onClick={() => setShowModal(true)}>Agregar Producto</button>
            </div>
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
                        {productos.filter(producto =>
                            producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
                        ).map(producto => (
                            <tr key={producto.id}>
                                <td>{producto.nombre}</td>
                                <td>{producto.descripcion}</td>
                                <td>{producto.precio}</td>
                                <td>{producto.stock}</td>
                                <td>{producto.categoria_id}</td>
                                <td>
                                    <button onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>Agregar Nuevo Producto</h2>
                        <input
                            type="text"
                            name="nombre"
                            value={nuevoProducto.nombre}
                            placeholder="Nombre"
                            onChange={handleNuevoProductoChange}
                        />
                        <input
                            type="text"
                            name="descripcion"
                            value={nuevoProducto.descripcion}
                            placeholder="Descripción"
                            onChange={handleNuevoProductoChange}
                        />
                        <input
                            type="text"
                            name="precio"
                            value={nuevoProducto.precio}
                            placeholder="Precio"
                            onChange={handleNuevoProductoChange}
                        />
                        <input
                            type="text"
                            name="stock"
                            value={nuevoProducto.stock}
                            placeholder="Stock"
                            onChange={handleNuevoProductoChange}
                        />
                        <input
                            type="text"
                            name="categoria_id"
                            value={nuevoProducto.categoria_id}
                            placeholder="Categoría ID"
                            onChange={handleNuevoProductoChange}
                        />
                        <button onClick={agregarProducto}>Agregar Producto</button>
                    </div>
                </div>
            )}

            <div className="venta-producto-container">
                <h2>Realizar Venta</h2>
                <div className="producto-navigation-container">
                    <label>
                        Producto:
                        <select value={ventaProducto.producto ? ventaProducto.producto.id : ''} onChange={(e) => handleVentaProductoChange(e, 'producto')}>
                            <option value="">Selecciona un producto</option>
                            {productos.map(producto => (
                                <option key={producto.id} value={producto.id}>{producto.nombre}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="cantidad-container">
                    <label>
                        Cantidad:
                        <input type="number" value={ventaProducto.cantidad} onChange={(e) => handleVentaProductoChange(e, 'cantidad')} />
                    </label>
                </div>
                <div className="decuento-container">
                    <label>
                        Descuento (%):
                        <input type="number" value={ventaProducto.descuento} onChange={(e) => handleVentaProductoChange(e, 'descuento')} />
                    </label>
                </div>
                <button onClick={calcularTotalVenta}>Calcular Total</button>
                <div className="total-container">
                    <label>
                        Total:
                        <input type="text" value={totalVenta} disabled />
                    </label>
                </div>
                <button onClick={realizarVenta}>Realizar Venta</button>
            </div>
        </div>
    );
}

export default ProductosList;