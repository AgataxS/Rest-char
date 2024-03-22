import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CategoriaList.css';

function CategoriaList() {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [nombreCategoriaModificar, setNombreCategoriaModificar] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const obtenerCategorias = () => {
    axios.get('https://proyecto.forcewillcode.website/api/categorias')
      .then(response => {
        setCategorias(response.data);
      })
      .catch(error => {
        console.error('Error al obtener las categorías:', error);
      });
  };

  const agregarCategoria = () => {
    axios.post('https://proyecto.forcewillcode.website/api/categorias', { nombre: nuevaCategoria })
      .then(response => {
        setNuevaCategoria('');
        obtenerCategorias();
      })
      .catch(error => {
        console.error('Error al agregar la categoría:', error);
      });
  };

  const eliminarCategoria = (id) => {
    axios.delete(`https://proyecto.forcewillcode.website/api/categorias/${id}`)
      .then(response => {
        obtenerCategorias();
      })
      .catch(error => {
        console.error('Error al eliminar la categoría:', error);
      });
  };

  const modificarCategoria = (id) => {
    axios.put(`https://proyecto.forcewillcode.website/api/categorias/${id}`, { nombre: nombreCategoriaModificar })
      .then(response => {
        setCategoriaSeleccionada(null);
        setModoEdicion(false);
        obtenerCategorias();
      })
      .catch(error => {
        console.error('Error al modificar la categoría:', error);
      });
  };

  return (
    <div className="container">
      <h1>Categorías</h1>

      <div className="form-container">
        <h2>{modoEdicion ? 'Modificar Categoría' : 'Agregar Nueva Categoría'}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (modoEdicion && categoriaSeleccionada) {
              modificarCategoria(categoriaSeleccionada.id);
            } else {
              agregarCategoria();
            }
          }}
        >
          <div className="form-group">
            <input
              type="text"
              value={modoEdicion ? nombreCategoriaModificar : nuevaCategoria}
              onChange={(e) => {
                if (modoEdicion) {
                  setNombreCategoriaModificar(e.target.value);
                } else {
                  setNuevaCategoria(e.target.value);
                }
              }}
              placeholder={modoEdicion ? 'Nuevo nombre de categoría' : 'Nueva categoría'}
            />
            <button type="submit">{modoEdicion ? 'Guardar' : 'Agregar'}</button>
          </div>
        </form>
      </div>

      <div className="categoria-lista">
        <table>
          <thead>
            <tr>
              <th>Identificador</th>
              <th>Nombre de la Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(categoria => (
              <tr key={categoria.id}>
                <td>{categoria.id}</td>
                <td>{categoria.nombre}</td>
                <td>
                  <button onClick={() => eliminarCategoria(categoria.id)}>Eliminar</button>
                  <button
                    onClick={() => {
                      setCategoriaSeleccionada(categoria);
                      setNombreCategoriaModificar(categoria.nombre);
                      setModoEdicion(true);
                    }}
                  >
                    Modificar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CategoriaList;
