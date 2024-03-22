import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Corrige la importación de Routes
import Navbar from './Navbar';
import CategoriaList from './CategoriaList';
import ClienteList from './ClienteList';
import MovimientosList from './MovimientosList';
import BonificacionesList from './BonificacionesList';
import ComprasList from './ComprasList';
import DetalleComprasList from './DetalleComprasList';
import EgresosList from './EgresosList';
import IngresosList from './IngresosList';
import ProductosList from './ProductosList';
import ProveedoresList from './ProveedoresList';
import VentasList from './VentasList';
import ModificarCliente from './ModificarCliente';
import AgregarCliente from './AgregarCliente'; 
import AgregarProveedor from './AgregarProveedor'; 
function App() {
    return (
        <Router>
            <div className="">
                <Navbar />
                <Routes> {/* Mueve Routes dentro del div container */}
                    <Route path="/categorias" element={<CategoriaList />} /> {/* Usa element prop para pasar el componente */}
                    <Route path="/clientes" element={<ClienteList />} /> {/* Usa element prop para pasar el componente */}
                    <Route path="/movimientos" element={<MovimientosList/>} />
                    <Route path="/bonificaciones" element={<BonificacionesList/>} />
                    <Route path="/compras" element={<ComprasList/>} />
                    <Route path="/detalle-compras" element={<DetalleComprasList/>} />
                    <Route path="/egresos" element={<EgresosList/>} />
                    <Route path="/ingresos" element={<IngresosList/>} />
                    <Route path="/productos" element={<ProductosList/>} />
                    <Route path="/proveedores" element={<ProveedoresList/>} />
                    <Route path="/ventas" element={<VentasList/>} />
                    <Route path="/modificar-cliente/:id" element={<ModificarCliente />} />
                    <Route path="/agregar-cliente" element={<AgregarCliente />} />
                    <Route path="/agregar-proveedor" element={<AgregarProveedor />} />
                    
                </Routes>
            </div>
        </Router>
    );
}

export default App;
