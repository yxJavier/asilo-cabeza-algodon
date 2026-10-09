import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { API_BASE } from '../config/api';

export default function RegistroResidentes() {
  const [residentes, setResidentes] = useState([]);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    fechaNacimiento: '',
    familiarContacto: '',
    fichaPsicopatologica: ''
  });

  const [medicinaActual, setMedicinaActual] = useState({
    nombreMedicamento: '',
    dosisDiaria: '',
    frecuencia: ''
  });

  const [listaMedicinas, setListaMedicinas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [mensajeExito, setMensajeExito] = useState(false);
  const [errorServidor, setErrorServidor] = useState('');

  const API_URL = `${API_BASE}/api/v1/internos`;

  const cargarResidentes = async () => {
    try {
      setCargandoLista(true);
      setErrorServidor('');
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      setResidentes(data);
    } catch (err) {
      console.error('Error al consultar residentes:', err);
      setErrorServidor('No se pudo conectar con el servidor.');
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

  const handleMedicinaChange = (e) => {
    setMedicinaActual({ ...medicinaActual, [e.target.name]: e.target.value });
  };

  const handleAgregarMedicina = () => {
    if (!medicinaActual.nombreMedicamento.trim() || !medicinaActual.dosisDiaria.trim()) {
      alert('Debe ingresar al menos el nombre del fármaco y la dosis diaria.');
      return;
    }

    setListaMedicinas([...listaMedicinas, medicinaActual]);
    setMedicinaActual({ nombreMedicamento: '', dosisDiaria: '', frecuencia: '' });
  };

  const handleQuitarMedicina = (index) => {
    setListaMedicinas(listaMedicinas.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorServidor('');

    const payload = {
      ...formData,
      medicinasCajon: listaMedicinas
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Error al registrar en la base de datos.');

      const nuevo = await response.json();
      setResidentes((prev) => [...prev, nuevo]);
      setMensajeExito(true);

      setFormData({
        nombreCompleto: '',
        fechaNacimiento: '',
        familiarContacto: '',
        fichaPsicopatologica: ''
      });
      setListaMedicinas([]);

      setTimeout(() => setMensajeExito(false), 4000);
    } catch (err) {
      console.error(err);
      setErrorServidor('Ocurrió un fallo al comunicarse con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-3">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 pb-2 border-bottom gap-2">
          <div>
            <h3 className="fw-bold text-primary mb-0">Gestión de Residentes</h3>
            <small className="text-muted">Expediente Clínico y Medicamentos de Uso Diario</small>
          </div>
          <span className="badge bg-primary px-3 py-2">Módulo Clínico</span>
        </div>

        {mensajeExito && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Expediente guardado:</strong> El residente y sus medicamentos quedaron registrados correctamente.
          </div>
        )}

        {errorServidor && (
          <div className="alert alert-danger" role="alert">
            <strong>Aviso:</strong> {errorServidor}
          </div>
        )}

        <div className="row g-4">
          {/* Formulario de Registro */}
          <div className="col-12 col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-primary text-white py-3">
                <h5 className="card-title mb-0 fw-semibold">Nuevo Ingreso de Residente</h5>
              </div>
              <div className="card-body p-3 p-md-4">
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
                      placeholder="Ej. Mateo Morales"
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

                  <h6 className="text-secondary fw-bold mt-4 mb-3 border-bottom pb-1">2. Contacto Familiar</h6>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Correo Electrónico del Familiar</label>
                    <input
                      type="email"
                      name="familiarContacto"
                      className="form-control"
                      value={formData.familiarContacto}
                      onChange={handleChange}
                      placeholder="familiar@correo.com"
                      required
                    />
                  </div>

                  <h6 className="text-secondary fw-bold mt-4 mb-3 border-bottom pb-1">3. Ficha Médica y Psicopatológica</h6>
                  <div className="mb-3">
                    <textarea
                      name="fichaPsicopatologica"
                      className="form-control"
                      rows="3"
                      value={formData.fichaPsicopatologica}
                      onChange={handleChange}
                      placeholder="Diagnóstico inicial, patologías crónicas o alergias..."
                    ></textarea>
                  </div>

                  <h6 className="text-secondary fw-bold mt-4 mb-3 border-bottom pb-1">4. Medicamentos de Uso Diario</h6>
                  <div className="bg-light p-3 rounded mb-3 border">
                    <div className="mb-2">
                      <label className="form-label small text-muted mb-1">Nombre del Medicamento</label>
                      <input
                        type="text"
                        name="nombreMedicamento"
                        className="form-control form-control-sm"
                        placeholder="Ej. Losartán"
                        value={medicinaActual.nombreMedicamento}
                        onChange={handleMedicinaChange}
                      />
                    </div>
                    <div className="row g-2 mb-3">
                      <div className="col-12 col-sm-6">
                        <label className="form-label small text-muted mb-1">Dosis</label>
                        <input
                          type="text"
                          name="dosisDiaria"
                          className="form-control form-control-sm"
                          placeholder="Ej. 50mg"
                          value={medicinaActual.dosisDiaria}
                          onChange={handleMedicinaChange}
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <label className="form-label small text-muted mb-1">Frecuencia</label>
                        <input
                          type="text"
                          name="frecuencia"
                          className="form-control form-control-sm"
                          placeholder="Ej. Cada 12 horas"
                          value={medicinaActual.frecuencia}
                          onChange={handleMedicinaChange}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm w-100 py-2"
                      onClick={handleAgregarMedicina}
                    >
                      Añadir Medicamento a la Lista
                    </button>

                    {listaMedicinas.length > 0 && (
                      <div className="mt-3">
                        <small className="fw-semibold text-muted d-block mb-1">Medicamentos a guardar:</small>
                        <ul className="list-group list-group-flush small">
                          {listaMedicinas.map((med, i) => (
                            <li key={i} className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 bg-transparent">
                              <div>
                                <strong>{med.nombreMedicamento}</strong> - {med.dosisDiaria} ({med.frecuencia || 'Diaria'})
                              </div>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger py-0 px-2"
                                onClick={() => handleQuitarMedicina(i)}
                              >
                                Quitar
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Guardando expediente...
                      </>
                    ) : (
                      'Registrar Residente'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Tabla de Expedientes */}
          <div className="col-12 col-lg-7">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0 fw-bold">Expedientes Registrados</h5>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={cargarResidentes}
                  disabled={cargandoLista}
                >
                  Recargar
                </button>
              </div>
              <div className="card-body p-0">
                {cargandoLista ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="small text-muted mt-2 mb-0">Consultando expedientes...</p>
                  </div>
                ) : residentes.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    No hay residentes registrados en el sistema.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0" style={{ minWidth: '650px' }}>
                      <thead className="table-light">
                        <tr>
                          <th className="ps-3" style={{ width: '80px' }}>ID</th>
                          <th>Residente / Contacto</th>
                          <th>Ficha y Medicamentos</th>
                          <th style={{ width: '110px' }}>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {residentes.map((r) => (
                          <tr key={r.id}>
                            <td className="ps-3 fw-bold text-muted">#{r.id}</td>
                            <td>
                              <div className="fw-semibold">{r.nombreCompleto}</div>
                              <div className="small text-muted">{r.familiarContacto}</div>
                              <small className="text-muted">Nacimiento: {r.fechaNacimiento}</small>
                            </td>
                            <td className="small">
                              <div>
                                <strong className="text-secondary">Diagnóstico:</strong>{' '}
                                {r.fichaPsicopatologica || 'Sin padecimientos registrados'}
                              </div>
                              <div className="mt-1">
                                <strong className="text-secondary">Medicamentos:</strong>{' '}
                                {r.medicinasCajon && r.medicinasCajon.length > 0 ? (
                                  <ul className="mb-0 ps-3">
                                    {r.medicinasCajon.map((m) => (
                                      <li key={m.id}>
                                        {m.nombreMedicamento} ({m.dosisDiaria} - {m.frecuencia})
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <span className="text-muted">Ninguno asignado</span>
                                )}
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-success">
                                {r.estado || 'Activo'}
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