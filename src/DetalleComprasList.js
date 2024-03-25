import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import './DetalleComprasList.css';

function DetalleComprasList() {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState('');

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

    // Función para descargar los productos en formato PDF
    const handleDownloadPDF = () => {
        const pdfData = {
            productos: productosFiltrados,
            fecha: new Date().toLocaleDateString(),
        };

        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Lista de Productos', 20, 20);
        doc.setFontSize(12);

        let y = 30;
        pdfData.productos.forEach((producto) => {
            doc.text(`Nombre: ${producto.nombre}`, 20, y);
            y += 10;
            doc.text(`Descripción: ${producto.descripcion}`, 20, y);
            y += 10;
            doc.text(`Precio: ${producto.precio}`, 20, y);
            y += 10;
            doc.text(`Stock: ${producto.stock}`, 20, y);
            y += 15;
        });

        doc.save('lista-productos.pdf');
    };

    // Función para descargar los productos en formato Excel
    const handleDownloadExcel = () => {
        const excelData = [
            ['Nombre', 'Descripción', 'Precio', 'Stock'],
            ...productosFiltrados.map((producto) => [
                producto.nombre,
                producto.descripcion,
                producto.precio,
                producto.stock,
            ]),
        ];

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Productos');
        XLSX.writeFile(workbook, 'lista-productos.xlsx');
    };

    // Función para imprimir los productos
    const handlePrint = () => {
        const printData = `
            <h1>Lista de Productos</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    ${productosFiltrados
                        .map(
                            (producto) => `
                            <tr>
                                <td>${producto.nombre}</td>
                                <td>${producto.descripcion}</td>
                                <td>${producto.precio}</td>
                                <td>${producto.stock}</td>
                            </tr>
                        `
                        )
                        .join('')}
                </tbody>
            </table>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(printData);
        printWindow.document.close();
        printWindow.print();
    };

    // Filtra los productos según la búsqueda
    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="detalle-compras-container">
            <h1>Detalle de Compras</h1>
            <div className="search-download-container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                <div className="download-options">
                    <button onClick={handleDownloadPDF}>Descargar PDF</button>
                    <button onClick={handleDownloadExcel}>Descargar Excel</button>
                    <button onClick={handlePrint}>Imprimir</button>
                </div>
            </div>
            <ul className="productos-list">
                {productosFiltrados.map(producto => (
                    <li key={producto.id} className="producto-item">
                        <div>
                            Nombre: {producto.nombre}<br />
                            Descripción: {producto.descripcion}<br />
                            Precio: {producto.precio}<br />
                            Stock: {producto.stock}<br />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DetalleComprasList;
