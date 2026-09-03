import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function RegistroResidentes() {
  const [residentes, setResidentes] = useState([]);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    fechaNacimiento: '',
    familiarContacto: '',
    fichaPsicopatologica: ''
  });

  // Estado temporal para la medicina que se está escribiendo
  const [medicinaActual, setMedicinaActual] = useState({
    nombreMedicamento: '',
    dosisDiaria: '',
    frecuencia: ''
  });

  // Lista de medicinas acumuladas para el residente en curso
  const [listaMedicinas, setListaMedicinas] = useState([]);

  const [loading, setLoading] = useState(false);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [mensajeExito, setMensajeExito] = useState(false);
  const [errorServidor, setErrorServidor] = useState('');

  const API_URL = 'http://localhost:8080/api/v1/internos';

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
      setErrorServidor('No se pudo conectar con el servidor (Spring Boot).');
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

  // Agregar medicina a la lista temporal
  const handleAgregarMedicina = () => {
    if (!medicinaActual.nombreMedicamento.trim() || !medicinaActual.dosisDiaria.trim()) {
      alert('Debe ingresar al menos el nombre del fármaco y la dosis diaria.');
      return;
    }

    setListaMedicinas([...listaMedicinas, medicinaActual]);
    setMedicinaActual({ nombreMedicamento: '', dosisDiaria: '', frecuencia: '' });
  };

  // Quitar una medicina agregada por error
  const handleQuitarMedicina = (index) => {
    setListaMedicinas(listaMedicinas.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorServidor('');

    // Payload completo enviado a Spring Boot con la lista anidada
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

      if (!response.ok) throw new Error('Error al registrar en PostgreSQL.');

      const nuevo = await response.json();
      setResidentes((prev) => [...prev, nuevo]);
      setMensajeExito(true);

      // Limpiar formulario y lista de medicinas
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
          <div>
            <h3 className="fw-bold text-primary mb-0">Gestión de Residentes - Cabeza de Algodón</h3>
            <small className="text-muted">Expediente Clínico y Medicinas de Cajón (RF-001)</small>
          </div>
          <span className="badge bg-primary fs-6 px-3 py-2">Módulo 1: Clínico</span>
        </div>

        {mensajeExito && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            ✅ <strong>¡Expediente guardado!</strong> El residente y sus medicamentos de cajón quedaron registrados.
          </div>
        )}

        {errorServidor && (
          <div className="alert alert-danger" role="alert">
            ❌ <strong>Problema:</strong> {errorServidor}
          </div>
        )}

        <div className="row g-4">
          {/* Formulario */}
          <div className="col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-primary text-white py-3">
                <h5 className="card-title mb-0 fw-semibold">Nuevo Ingreso de Residente</h5>
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

                  <h6 className="text-secondary fw-bold mt-4 mb-3 border-bottom pb-1">2. Contacto de Emergencia</h6>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Correo Familiar Responsable</label>
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

                  <h6 className="text-secondary fw-bold mt-4 mb-3 border-bottom pb-1">3. Ficha Psicopatológica</h6>
                  <div className="mb-3">
                    <textarea
                      name="fichaPsicopatologica"
                      className="form-control"
                      rows="2"
                      value={formData.fichaPsicopatologica}
                      onChange={handleChange}
                      placeholder="Diagnóstico inicial, psicopatologías crónicas o alergias..."
                    ></textarea>
                  </div>

                  {/* Subsección: Medicinas de Cajón */}
                  <h6 className="text-secondary fw-bold mt-4 mb-3 border-bottom pb-1">4. Medicinas "de Cajón" (Uso Diario)</h6>
                  <div className="bg-light p-3 rounded mb-3 border">
                    <div className="mb-2">
                      <input
                        type="text"
                        name="nombreMedicamento"
                        className="form-control form-control-sm mb-2"
                        placeholder="Nombre del fármaco (ej. Losartán)"
                        value={medicinaActual.nombreMedicamento}
                        onChange={handleMedicinaChange}
                      />
                    </div>
                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <input
                          type="text"
                          name="dosisDiaria"
                          className="form-control form-control-sm"
                          placeholder="Dosis (ej. 50mg)"
                          value={medicinaActual.dosisDiaria}
                          onChange={handleMedicinaChange}
                        />
                      </div>
                      <div className="col-6">
                        <input
                          type="text"
                          name="frecuencia"
                          className="form-control form-control-sm"
                          placeholder="Frecuencia (ej. c/12h)"
                          value={medicinaActual.frecuencia}
                          onChange={handleMedicinaChange}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={handleAgregarMedicina}
                    >
                      ➕ Añadir Medicina a la Ficha
                    </button>

                    {/* Medicinas añadidas antes del guardado final */}
                    {listaMedicinas.length > 0 && (
                      <div className="mt-3">
                        <small className="fw-semibold text-muted d-block mb-1">Medicinas a registrar:</small>
                        <ul className="list-group list-group-flush small">
                          {listaMedicinas.map((med, i) => (
                            <li key={i} className="list-group-item d-flex justify-content-between align-items-center px-0 py-1 bg-transparent">
                              <span>💊 <strong>{med.nombreMedicamento}</strong> ({med.dosisDiaria} - {med.frecuencia || 'Diaria'})</span>
                              <button
                                type="button"
                                className="btn btn-link text-danger p-0 text-decoration-none"
                                onClick={() => handleQuitarMedicina(i)}
                              >
                                ✕
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
                        Guardando expediente completo...
                      </>
                    ) : (
                      'Registrar e Ingresar Residente'
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
                <h5 className="card-title mb-0 fw-bold">Expedientes Registrados</h5>
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
                    <p className="small text-muted mt-2 mb-0">Consultando expedientes...</p>
                  </div>
                ) : residentes.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    No hay residentes registrados en el sistema.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="ps-3">ID</th>
                          <th>Residente / Contacto</th>
                          <th>Ficha y Medicinas "de Cajón"</th>
                          <th>Estado</th>
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
                                <strong className="text-secondary">Psicopatología:</strong>{' '}
                                {r.fichaPsicopatologica || 'Sin padecimientos registrados'}
                              </div>
                              <div className="mt-1">
                                <strong className="text-secondary">Medicinas:</strong>{' '}
                                {r.medicinasCajon && r.medicinasCajon.length > 0 ? (
                                  <ul className="mb-0 ps-3">
                                    {r.medicinasCajon.map((m) => (
                                      <li key={m.id}>
                                        {m.nombreMedicamento} ({m.dosisDiaria} - {m.frecuencia})
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <span className="text-muted">Ninguna asignada</span>
                                )}
                              </div>
                            </td>
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