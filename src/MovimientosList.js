import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MovimientosList.css'; // Importa el archivo CSS

function MovimientosList() {
    const [movimientos, setMovimientos] = useState([]);

    useEffect(() => {
        obtenerMovimientos();
    }, []);

    const obtenerMovimientos = () => {
        axios.get('https://proyecto.forcewillcode.website/api/movimientos')
            .then(response => {
                setMovimientos(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los movimientos:', error);
            });
    };

    return (
        <div>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Movimientos</h1>
            <div className="movimientos-lista">
                <ul>
                    {movimientos.map(movimiento => (
                        <li key={movimiento.id}>
                            <div className="movimiento-item">
                                {/* Agrega aquí la información del movimiento */}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MovimientosList;
