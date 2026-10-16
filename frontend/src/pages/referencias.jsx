import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AccesoDenegado from '../components/AccesoDenegado';
import { apiFetch } from '../services/api';

export default function ReferenciasMedicas() {
  // 1. Estados de Seguridad RBAC
  const [sesion, setSesion] = useState(null);
  const [autorizado, setAutorizado] = useState(false);
  const [comprobando, setComprobando] = useState(true);

  // Módulo 2: Permitido para Administradores, Médicos y Coordinación de Fundación
  const ROLES_PERMITIDOS = ['ADMINISTRADOR', 'MEDICO_GENERAL', 'ENFERMERO', 'COORD_FUNDACION'];

  // 2. Estados de datos del Módulo 2
  const [referencias, setReferencias] = useState([]);
  const [internosDisponibles, setInternosDisponibles] = useState([]);
  const [formData, setFormData] = useState({
    nombreInterno: '',
    especialidad: 'Geriatria',
    correoFamiliar: '',
    motivo: ''
  });

  const [loading, setLoading] = useState(false);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [mensajeExito, setMensajeExito] = useState(false);
  const [errorServidor, setErrorServidor] = useState('');

  // 3. Validación de sesión en el navegador
  useEffect(() => {
    const sesionStr = localStorage.getItem('usuario_sesion');
    if (!sesionStr) {
      window.location.href = '/';
      return;
    }

    try {
      const user = JSON.parse(sesionStr);
      setSesion(user);
      if (ROLES_PERMITIDOS.includes(user.rol)) {
        setAutorizado(true);
      }
    } catch {
      window.location.href = '/';
    } finally {
      setComprobando(false);
    }
  }, []);

  // 4. Carga de datos desde Spring Boot (solo si está autorizado)
  const cargarDatosIniciales = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    try {
      setCargandoLista(true);
      setErrorServidor('');

      const [resReferencias, resInternos] = await Promise.all([
        apiFetch('/api/v1/referencias'),
        apiFetch('/api/v1/internos')
      ]);

      if (!resReferencias.ok || !resInternos.ok) {
        throw new Error('Error al consultar datos desde el servidor.');
      }

      const dataReferencias = await resReferencias.json();
      const dataInternos = await resInternos.json();

      setReferencias(dataReferencias);
      setInternosDisponibles(dataInternos);

      if (dataInternos.length > 0) {
        setFormData((prev) => ({
          ...prev,
          nombreInterno: dataInternos[0].nombreCompleto,
          correoFamiliar: dataInternos[0].familiarContacto
        }));
      }
    } catch (err) {
      console.error(err);
      setErrorServidor('No se pudo conectar con los endpoints de Spring Boot.');
    } finally {
      setCargandoLista(false);
    }
  };

  useEffect(() => {
    if (autorizado) {
      cargarDatosIniciales();
    }
  }, [autorizado]);

  // 5. Manejadores de eventos
  const handleSelectInterno = (e) => {
    const seleccionado = internosDisponibles.find((i) => i.nombreCompleto === e.target.value);
    if (seleccionado) {
      setFormData({
        ...formData,
        nombreInterno: seleccionado.nombreCompleto,
        correoFamiliar: seleccionado.familiarContacto
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorServidor('');

    try {
      const response = await apiFetch('/api/v1/referencias', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Fallo al emitir la referencia.');

      const nuevaReferencia = await response.json();
      setReferencias((prev) => [...prev, nuevaReferencia]);
      setMensajeExito(true);

      setFormData((prev) => ({
        ...prev,
        motivo: ''
      }));

      setTimeout(() => setMensajeExito(false), 4500);
    } catch (err) {
      console.error(err);
      setErrorServidor('Error al registrar la derivación médica.');
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      const res = await apiFetch(`/api/v1/referencias/${id}/estado?estado=${nuevoEstado}`, {
        method: 'PATCH'
      });
      if (res.ok) {
        const actualizada = await res.json();
        setReferencias(referencias.map((r) => (r.id === id ? actualizada : r)));
      }
    } catch (err) {
      console.error('Error al actualizar estado:', err);
    }
  };

  // 6. Intercepciones de renderizado
  if (comprobando) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted small">Verificando autorizaciones...</p>
      </div>
    );
  }

  if (!autorizado) {
    return (
      <>
        <Navbar />
        <AccesoDenegado modulo="Módulo de Referencias Médicas" rolActual={sesion?.rol} />
      </>
    );
  }

  // 7. Renderizado principal único
  return (
    <>
      <Navbar />
      <div className="container py-2">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <div>
            <h3 className="fw-bold text-primary mb-0">Referencias y Derivaciones Médicas</h3>
            <small className="text-muted">
              Módulo 2: Emisión Clínica y Notificaciones Automáticas (RF-003 / RNF-005)
            </small>
          </div>
          <span className="badge bg-warning text-dark fs-6 px-3 py-2 border">Módulo 2</span>
        </div>

        {mensajeExito && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            Solicitud emitida exitosamente. El correo de notificación fue despachado al familiar responsable.
          </div>
        )}

        {errorServidor && (
          <div className="alert alert-danger" role="alert">
            {errorServidor}
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-primary text-white py-3">
                <h5 className="card-title mb-0 fw-semibold">Nueva Derivación Médica</h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Seleccionar Residente</label>
                    {internosDisponibles.length === 0 ? (
                      <input
                        type="text"
                        className="form-control"
                        placeholder="No hay internos registrados en BD"
                        disabled
                      />
                    ) : (
                      <select
                        className="form-select"
                        value={formData.nombreInterno}
                        onChange={handleSelectInterno}
                        required
                      >
                        {internosDisponibles.map((i) => (
                          <option key={i.id} value={i.nombreCompleto}>
                            {i.nombreCompleto}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Especialidad Requerida</label>
                    <select
                      name="especialidad"
                      className="form-select"
                      value={formData.especialidad}
                      onChange={handleChange}
                      required
                    >
                      <option value="Geriatria">Geriatría</option>
                      <option value="Cardiologia">Cardiología</option>
                      <option value="Neurologia">Neurología</option>
                      <option value="Oftalmologia">Oftalmología</option>
                      <option value="Medicina Interna">Medicina Interna</option>
                      <option value="Psiquiatria">Psiquiatría</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Correo Familiar (Autoasignado)</label>
                    <input
                      type="email"
                      name="correoFamiliar"
                      className="form-control"
                      value={formData.correoFamiliar}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-semibold">Motivo Clínico de Derivación</label>
                    <textarea
                      name="motivo"
                      className="form-control"
                      rows="3"
                      value={formData.motivo}
                      onChange={handleChange}
                      placeholder="Justificación médica de la interconsulta..."
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-2 fw-semibold" 
                    disabled={loading || internosDisponibles.length === 0}
                  >
                    {loading ? 'Procesando y notificando...' : 'Emitir Referencia a Fundación'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0 fw-bold">Solicitudes Registradas</h5>
                <button 
                  className="btn btn-sm btn-outline-secondary" 
                  onClick={cargarDatosIniciales}
                  disabled={cargandoLista}
                >
                  Recargar
                </button>
              </div>
              <div className="card-body p-0">
                {cargandoLista ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="small text-muted mt-2 mb-0">Consultando PostgreSQL...</p>
                  </div>
                ) : referencias.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    No existen derivaciones registradas en el sistema.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="ps-3">ID</th>
                          <th>Residente</th>
                          <th>Especialidad / Motivo</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {referencias.map((ref) => (
                          <tr key={ref.id}>
                            <td className="ps-3 fw-bold text-muted">#{ref.id}</td>
                            <td>
                              <div className="fw-semibold">{ref.nombreInterno}</div>
                              <small className="text-muted">{ref.correoFamiliar}</small>
                            </td>
                            <td className="small">
                              <span className="badge bg-light text-primary border me-1">
                                {ref.especialidad}
                              </span>
                              <div className="text-muted mt-1 text-truncate" style={{ maxWidth: '180px' }}>
                                {ref.motivo}
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${
                                ref.estado === 'Agendada' 
                                  ? 'bg-success-subtle text-success border border-success-subtle' 
                                  : 'bg-warning-subtle text-warning border border-warning-subtle'
                              }`}>
                                {ref.estado}
                              </span>
                            </td>
                            <td>
                              {ref.estado === 'Pendiente' && (
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => handleCambiarEstado(ref.id, 'Agendada')}
                                >
                                  Agendar
                                </button>
                              )}
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