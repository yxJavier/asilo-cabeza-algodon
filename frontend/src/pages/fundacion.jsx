import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function ModuloFundacion() {
  const [tabActiva, setTabActiva] = useState('laboratorio');
  const [internos, setInternos] = useState([]);
  
  // Estados Laboratorio
  const [ordenesLab, setOrdenesLab] = useState([]);
  const [formLab, setFormLab] = useState({
    idInterno: '',
    nombreInterno: '',
    tipoExamen: 'Hematologia Completa',
    costoPreferencial: 75.00
  });
  const [labSeleccionado, setLabSeleccionado] = useState(null);
  const [resultadoTexto, setResultadoTexto] = useState('');

  // Estados Farmacia
  const [despachos, setDespachos] = useState([]);
  const [formFarmacia, setFormFarmacia] = useState({
    idInterno: '',
    nombreInterno: '',
    medicamento: '',
    cantidad: 1,
    costoPreferencial: 35.00
  });

  const [loading, setLoading] = useState(false);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [mensajeExito, setMensajeExito] = useState('');
  const [errorServidor, setErrorServidor] = useState('');

  const API_INTERNOS = 'http://localhost:8080/api/v1/internos';
  const API_LAB = 'http://localhost:8080/api/v1/laboratorio';
  const API_FARMACIA = 'http://localhost:8080/api/v1/farmacia';

  const cargarDatos = async () => {
    try {
      setCargandoLista(true);
      setErrorServidor('');

      const [resInternos, resLab, resFarmacia] = await Promise.all([
        fetch(API_INTERNOS),
        fetch(API_LAB),
        fetch(API_FARMACIA)
      ]);

      if (!resInternos.ok || !resLab.ok || !resFarmacia.ok) {
        throw new Error('Error al sincronizar datos con el servidor');
      }

      const dataInternos = await resInternos.json();
      const dataLab = await resLab.json();
      const dataFarmacia = await resFarmacia.json();

      setInternos(dataInternos);
      setOrdenesLab(dataLab);
      setDespachos(dataFarmacia);

      if (dataInternos.length > 0) {
        setFormLab((prev) => ({
          ...prev,
          idInterno: dataInternos[0].id,
          nombreInterno: dataInternos[0].nombreCompleto
        }));
        setFormFarmacia((prev) => ({
          ...prev,
          idInterno: dataInternos[0].id,
          nombreInterno: dataInternos[0].nombreCompleto
        }));
      }
    } catch (err) {
      console.error(err);
      setErrorServidor('No se pudo establecer conexion con los servicios de la Fundacion.');
    } finally {
      setCargandoLista(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSelectInternoLab = (e) => {
    const id = parseInt(e.target.value);
    const interno = internos.find((i) => i.id === id);
    if (interno) {
      setFormLab({
        ...formLab,
        idInterno: interno.id,
        nombreInterno: interno.nombreCompleto
      });
    }
  };

  const handleSelectInternoFarmacia = (e) => {
    const id = parseInt(e.target.value);
    const interno = internos.find((i) => i.id === id);
    if (interno) {
      setFormFarmacia({
        ...formFarmacia,
        idInterno: interno.id,
        nombreInterno: interno.nombreCompleto
      });
    }
  };

  const handleCrearOrdenLab = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorServidor('');

    try {
      const res = await fetch(API_LAB, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formLab)
      });

      if (!res.ok) throw new Error('Error al emitir orden de laboratorio');

      const nueva = await res.json();
      setOrdenesLab((prev) => [...prev, nueva]);
      setMensajeExito('Orden de laboratorio registrada bajo tarifa preferencial.');
      setTimeout(() => setMensajeExito(''), 4000);
    } catch (err) {
      setErrorServidor(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarResultadoLab = async (e) => {
    e.preventDefault();
    if (!labSeleccionado || !resultadoTexto.trim()) return;

    try {
      const res = await fetch(`${API_LAB}/${labSeleccionado.id}/resultado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultado: resultadoTexto })
      });

      if (res.ok) {
        const actualizada = await res.json();
        setOrdenesLab(ordenesLab.map((o) => (o.id === labSeleccionado.id ? actualizada : o)));
        setLabSeleccionado(null);
        setResultadoTexto('');
        setMensajeExito('Resultado clinico capturado y archivado en el expediente.');
        setTimeout(() => setMensajeExito(''), 4000);
      }
    } catch (err) {
      console.error('Error al guardar resultado:', err);
    }
  };

  const handleCrearPrescripcion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorServidor('');

    try {
      const res = await fetch(API_FARMACIA, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formFarmacia)
      });

      if (!res.ok) throw new Error('Error al registrar prescripcion');

      const nuevo = await res.json();
      setDespachos((prev) => [...prev, nuevo]);
      setMensajeExito('Prescripcion medica generada en estado Pendiente de Despacho.');
      setFormFarmacia((prev) => ({ ...prev, medicamento: '', cantidad: 1 }));
      setTimeout(() => setMensajeExito(''), 4000);
    } catch (err) {
      setErrorServidor(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDespacharReceta = async (id) => {
    try {
      const res = await fetch(`${API_FARMACIA}/${id}/despachar`, {
        method: 'PATCH'
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Error al despachar la receta.');
      }

      const actualizada = await res.json();
      setDespachos(despachos.map((d) => (d.id === id ? actualizada : d)));
      setMensajeExito('Medicamento despachado fisicamente. Receta bloqueada para evitar duplicidad (RF-010).');
      setTimeout(() => setMensajeExito(''), 4500);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-2">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <div>
            <h3 className="fw-bold text-primary mb-0">Portal de Atencion Externa - Fundacion Medica</h3>
            <small className="text-muted">Modulo 3: Laboratorio Clinico y Despacho Controlado de Farmacia (RF-008 a RF-010)</small>
          </div>
          <span className="badge bg-secondary fs-6 px-3 py-2">Modulo 3</span>
        </div>

        {mensajeExito && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {mensajeExito}
          </div>
        )}

        {errorServidor && (
          <div className="alert alert-danger" role="alert">
            {errorServidor}
          </div>
        )}

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link fw-semibold ${tabActiva === 'laboratorio' ? 'active text-primary' : 'text-secondary'}`}
              onClick={() => setTabActiva('laboratorio')}
            >
              Laboratorio Clinico
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link fw-semibold ${tabActiva === 'farmacia' ? 'active text-primary' : 'text-secondary'}`}
              onClick={() => setTabActiva('farmacia')}
            >
              Despacho de Farmacia
            </button>
          </li>
        </ul>

        {/* Vista 1: Laboratorio Clinico */}
        {tabActiva === 'laboratorio' && (
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-primary text-white py-3">
                  <h5 className="card-title mb-0 fw-semibold">Nueva Orden de Examen Clinico</h5>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handleCrearOrdenLab}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Residente Asignado</label>
                      <select
                        className="form-select"
                        value={formLab.idInterno}
                        onChange={handleSelectInternoLab}
                        required
                      >
                        {internos.map((i) => (
                          <option key={i.id} value={i.id}>
                            #{i.id} - {i.nombreCompleto}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Tipo de Examen</label>
                      <select
                        className="form-select"
                        value={formLab.tipoExamen}
                        onChange={(e) => setFormLab({ ...formLab, tipoExamen: e.target.value })}
                        required
                      >
                        <option value="Hematologia Completa">Hematologia Completa</option>
                        <option value="Quimica Sanguinea (Glucosa / Urea)">Quimica Sanguinea (Glucosa / Urea)</option>
                        <option value="Perfil Lipidico">Perfil Lipidico</option>
                        <option value="Examen General de Orina">Examen General de Orina</option>
                        <option value="Electrocardiograma">Electrocardiograma</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-semibold">Tarifa Preferencial Fundacion (Q)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={formLab.costoPreferencial}
                        onChange={(e) => setFormLab({ ...formLab, costoPreferencial: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
                      {loading ? 'Emitiendo orden...' : 'Registrar Orden Clinica (RF-008)'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Panel de captura de resultados */}
              {labSeleccionado && (
                <div className="card shadow-sm border-0 border-start border-4 border-warning">
                  <div className="card-header bg-white py-2">
                    <strong className="text-dark">Captura de Resultados: #{labSeleccionado.id} - {labSeleccionado.tipoExamen}</strong>
                  </div>
                  <div className="card-body p-3">
                    <form onSubmit={handleGuardarResultadoLab}>
                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Detalle o Interpretacion del Examen</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={resultadoTexto}
                          onChange={(e) => setResultadoTexto(e.target.value)}
                          placeholder="Digite los valores clinicos o hallazgos del laboratorista..."
                          required
                        ></textarea>
                      </div>
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-sm btn-success fw-semibold">
                          Guardar Resultado (RF-009)
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => { setLabSeleccionado(null); setResultadoTexto(''); }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>

            <div className="col-lg-7">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0 fw-bold">Bandeja de Ordenes Clinicas</h5>
                  <button className="btn btn-sm btn-outline-secondary" onClick={cargarDatos} disabled={cargandoLista}>
                    Recargar
                  </button>
                </div>
                <div className="card-body p-0">
                  {cargandoLista ? (
                    <div className="text-center py-4 text-muted">Consultando ordenes de laboratorio...</div>
                  ) : ordenesLab.length === 0 ? (
                    <div className="p-4 text-center text-muted">No hay ordenes clinicas registradas.</div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="ps-3">ID</th>
                            <th>Residente</th>
                            <th>Examen / Resultado</th>
                            <th>Costo</th>
                            <th>Estado</th>
                            <th>Accion</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ordenesLab.map((o) => (
                            <tr key={o.id}>
                              <td className="ps-3 fw-bold text-muted">#{o.id}</td>
                              <td>
                                <div className="fw-semibold">{o.nombreInterno}</div>
                                <small className="text-muted">ID Interno: {o.idInterno}</small>
                              </td>
                              <td className="small">
                                <div className="fw-semibold">{o.tipoExamen}</div>
                                <div className="text-muted">{o.resultado || 'Pendiente de evaluacion'}</div>
                              </td>
                              <td className="small fw-semibold">Q {o.costoPreferencial.toFixed(2)}</td>
                              <td>
                                <span className={`badge ${o.estado === 'Completado' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-warning-subtle text-warning border border-warning-subtle'}`}>
                                  {o.estado}
                                </span>
                              </td>
                              <td>
                                {o.estado === 'Pendiente' && (
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => { setLabSeleccionado(o); setResultadoTexto(''); }}
                                  >
                                    Capturar
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
        )}

        {/* Vista 2: Despacho de Farmacia */}
        {tabActiva === 'farmacia' && (
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-primary text-white py-3">
                  <h5 className="card-title mb-0 fw-semibold">Prescribir Medicamento Especializado</h5>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handleCrearPrescripcion}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Residente</label>
                      <select
                        className="form-select"
                        value={formFarmacia.idInterno}
                        onChange={handleSelectInternoFarmacia}
                        required
                      >
                        {internos.map((i) => (
                          <option key={i.id} value={i.id}>
                            #{i.id} - {i.nombreCompleto}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Medicamento Prescrito</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ej. Insulina NPH / Enalapril"
                        value={formFarmacia.medicamento}
                        onChange={(e) => setFormFarmacia({ ...formFarmacia, medicamento: e.target.value })}
                        required
                      />
                    </div>

                    <div className="row g-2 mb-4">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Cantidad</label>
                        <input
                          type="number"
                          min="1"
                          className="form-control"
                          value={formFarmacia.cantidad}
                          onChange={(e) => setFormFarmacia({ ...formFarmacia, cantidad: parseInt(e.target.value) || 1 })}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Costo Preferencial (Q)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          value={formFarmacia.costoPreferencial}
                          onChange={(e) => setFormFarmacia({ ...formFarmacia, costoPreferencial: parseFloat(e.target.value) || 0 })}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
                      {loading ? 'Prescribiendo...' : 'Generar Receta (Estado: Pendiente)'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0 fw-bold">Recetas y Despacho Controlado (RF-010)</h5>
                  <button className="btn btn-sm btn-outline-secondary" onClick={cargarDatos} disabled={cargandoLista}>
                    Recargar
                  </button>
                </div>
                <div className="card-body p-0">
                  {cargandoLista ? (
                    <div className="text-center py-4 text-muted">Consultando recetas de farmacia...</div>
                  ) : despachos.length === 0 ? (
                    <div className="p-4 text-center text-muted">No existen prescripciones registradas.</div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="ps-3">ID</th>
                            <th>Residente</th>
                            <th>Medicamento / Cant.</th>
                            <th>Costo</th>
                            <th>Estado</th>
                            <th>Control de Entrega</th>
                          </tr>
                        </thead>
                        <tbody>
                          {despachos.map((d) => (
                            <tr key={d.id}>
                              <td className="ps-3 fw-bold text-muted">#{d.id}</td>
                              <td>
                                <div className="fw-semibold">{d.nombreInterno}</div>
                                <small className="text-muted">ID: {d.idInterno}</small>
                              </td>
                              <td className="small">
                                <div className="fw-semibold">{d.medicamento}</div>
                                <div className="text-muted">{d.cantidad} unidad(es)</div>
                              </td>
                              <td className="small fw-semibold">Q {d.costoPreferencial.toFixed(2)}</td>
                              <td>
                                <span className={`badge ${
                                  d.estado === 'Despachado' 
                                    ? 'bg-success-subtle text-success border border-success-subtle' 
                                    : 'bg-warning-subtle text-warning border border-warning-subtle'
                                }`}>
                                  {d.estado === 'Despachado' ? 'Bloqueada (Entregado)' : 'Pendiente'}
                                </span>
                              </td>
                              <td>
                                {d.estado === 'Pendiente' ? (
                                  <button
                                    className="btn btn-sm btn-success fw-semibold"
                                    onClick={() => handleDespacharReceta(d.id)}
                                  >
                                    Despachar y Bloquear
                                  </button>
                                ) : (
                                  <span className="small text-muted fst-italic">Entrega finalizada</span>
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
        )}
      </div>
    </>
  );
}