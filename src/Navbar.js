import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { FaBars, FaTimes, FaHome, FaList, FaUserFriends, FaMoneyBillWave, FaShoppingCart, FaFileInvoiceDollar, FaMoneyCheckAlt, FaMoneyBillAlt, FaBoxOpen, FaTruckMoving, FaHandHoldingUsd } from 'react-icons/fa';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-toggle" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>
      <ul className={isOpen ? "navbar-links active" : "navbar-links"}>
        <li>
          <Link to="/">
            <FaHome /> Inicio
          </Link>
        </li>
        <li>
          <Link to="/categorias">
            <FaList /> Categorías
          </Link>
        </li>
        <li>
          <Link to="/clientes">
            <FaUserFriends /> Clientes
          </Link>
        </li>
        <li>
          <Link to="/movimientos">
            <FaMoneyBillWave /> Movimientos
          </Link>
        </li>
        <li>
          <Link to="/bonificaciones">
            <FaMoneyCheckAlt /> Bonificaciones
          </Link>
        </li>
        <li>
          <Link to="/compras">
            <FaShoppingCart /> Compras
          </Link>
        </li>
        <li>
          <Link to="/detalle-compras">
            <FaFileInvoiceDollar /> Detalle Compras
          </Link>
        </li>
        <li>
          <Link to="/egresos">
            <FaMoneyBillAlt /> Egresos
          </Link>
        </li>
        <li>
          <Link to="/ingresos">
            <FaMoneyBillAlt /> Ingresos
          </Link>
        </li>
        <li>
          <Link to="/productos">
            <FaBoxOpen /> Productos
          </Link>
        </li>
        <li>
          <Link to="/proveedores">
            <FaTruckMoving /> Proveedores
          </Link>
        </li>
        <li>
          <Link to="/ventas">
            <FaHandHoldingUsd /> Ventas
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
