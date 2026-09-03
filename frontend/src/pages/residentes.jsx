import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function RegistroInternos() {
  const [residentes, setResidentes] = useState([]);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    fechaNacimiento: '',
    familiarContacto: '',
    fichaPsicopatologica: ''
  });

  const [loading, setLoading] = useState(false);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [mensajeExito, setMensajeExito] = useState(false);
  const [errorServidor, setErrorServidor] = useState('');

  const API_URL = 'http://localhost:8080/api/v1/internos';

  // 1. Cargar residentes reales desde PostgreSQL al entrar a la página
  const cargarResidentes = async () => {
    try {
      setCargandoLista(true);
      setErrorServidor('');
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error en servidor: ${response.status}`);
      }
      const data = await response.json();
      setResidentes(data);
    } catch (err) {
      console.error('Error al consultar residentes:', err);
      setErrorServidor('No se pudo conectar con el backend (puerto 8080).');
    } finally {
      setCargandoLista(false);
    }
  };

  useEffect(() => {
    cargarResidentes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Guardar residente vía HTTP POST hacia Spring Boot
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorServidor('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('No se pudo guardar el residente.');
      }

      const nuevoInterno = await response.json();

      // Agrega el residente recién creado a la tabla
      setResidentes((prev) => [...prev, nuevoInterno]);
      setMensajeExito(true);

      // Limpia el formulario
      setFormData({
        nombreCompleto: '',
        fechaNacimiento: '',
        familiarContacto: '',
        fichaPsicopatologica: ''
      });

      setTimeout(() => setMensajeExito(false), 4000);
    } catch (err) {
      console.error('Error al guardar:', err);
      setErrorServidor('Ocurrió un fallo al comunicarse con la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-2">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <h3 className="fw-bold text-primary mb-0">Gestión de Residentes - Asilo Cabeza de Algodón</h3>
          <span className="badge bg-light text-dark border">Módulo Clínico</span>
        </div>

        {mensajeExito && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            ✅ <strong>¡Registro guardado en PostgreSQL!</strong> El interno fue registrado en el expediente general.
          </div>
        )}

        {errorServidor && (
          <div className="alert alert-danger" role="alert">
            ❌ <strong>Problema de conexión:</strong> {errorServidor}
          </div>
        )}

        <div className="row g-4">
          {/* Formulario conectado a Spring Boot */}
          <div className="col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-primary text-white py-3">
                <h5 className="card-title mb-0">Nuevo Ingreso de Residente</h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <h6 className="text-secondary fw-bold mb-3 border-bottom pb-1">1. Datos Personales</h6>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Nombre Completo</label>
                    <input
                      type="text"
                      name="nombreCompleto"
                      className="form-control"
                      value={formData.nombreCompleto}
                      onChange={handleChange}
                      placeholder="Ej. Francisca Pérez"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      className="form-control"
                      value={formData.fechaNacimiento}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <h6 className="text-secondary fw-bold mt-4 mb-3 border-bottom pb-1">2. Contacto de Emergencia</h6>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Correo Familiar Responsable</label>
                    <input
                      type="email"
                      name="familiarContacto"
                      className="form-control"
                      value={formData.familiarContacto}
                      onChange={handleChange}
                      placeholder="correo@familiar.com"
                      required
                    />
                  </div>

                  <h6 className="text-secondary fw-bold mt-4 mb-3 border-bottom pb-1">3. Ficha Médica / Observaciones</h6>
                  <div className="mb-3">
                    <textarea
                      name="fichaPsicopatologica"
                      className="form-control"
                      rows="2"
                      value={formData.fichaPsicopatologica}
                      onChange={handleChange}
                      placeholder="Condiciones preexistentes, alergias o psicopatologías..."
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Persistiendo en Base de Datos...
                      </>
                    ) : (
                      'Registrar e Ingresar al Sistema'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Tabla de Residentes */}
          <div className="col-lg-7">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0 fw-bold">Listado de Residentes Activos</h5>
                <button 
                  className="btn btn-sm btn-outline-secondary" 
                  onClick={cargarResidentes}
                  disabled={cargandoLista}
                >
                  🔄 Recargar
                </button>
              </div>
              <div className="card-body p-0">
                {cargandoLista ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="small text-muted mt-2 mb-0">Consultando PostgreSQL...</p>
                  </div>
                ) : residentes.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    No hay residentes registrados aún en la base de datos.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="ps-3">ID</th>
                          <th>Nombre</th>
                          <th>Nacimiento</th>
                          <th>Familiar</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {residentes.map((r) => (
                          <tr key={r.id}>
                            <td className="ps-3 fw-bold text-muted">#{r.id}</td>
                            <td className="fw-semibold">{r.nombreCompleto}</td>
                            <td className="small">{r.fechaNacimiento}</td>
                            <td className="small text-muted">{r.familiarContacto}</td>
                            <td>
                              <span className="badge bg-success-subtle text-success border border-success-subtle">
                                {r.estado}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}