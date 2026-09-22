import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { API_BASE } from '../config/api';

export default function ModuloFacturacionCaja() {
  const [tabActiva, setTabActiva] = useState('cuentas-cobrar');
  
  // Resumen financiero global consolidado (RF-016)
  const [resumen, setResumen] = useState({
    totalDonaciones: 0,
    totalGastos: 0,
    saldoNeto: 0,
    deudaFundacion: 0,
    totalCuentasPorCobrar: 0
  });

  // Listados y datos contables
  const [donaciones, setDonaciones] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [cuentasCobrar, setCuentasCobrar] = useState([]);
  const [deudaFundacion, setDeudaFundacion] = useState({
    subtotalLaboratorio: 0,
    subtotalFarmacia: 0,
    totalDeudaFundacion: 0
  });

  // Formularios de entrada
  const [formDonacion, setFormDonacion] = useState({
    donante: '',
    tipoDonante: 'Persona Particular',
    monto: ''
  });

  const [formGasto, setFormGasto] = useState({
    concepto: '',
    categoria: 'Servicios Basicos',
    monto: ''
  });

  const [loading, setLoading] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [mensajeExito, setMensajeExito] = useState('');
  const [errorServidor, setErrorServidor] = useState('');

  const API_CAJA = `${API_BASE}/api/v1/caja`;

  // Formato numerico determinista para evitar discrepancias de hidratacion
  const formatMoneda = (val) => {
    const num = Number(val) || 0;
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const cargarDatosFinancieros = async () => {
    try {
      setCargandoDatos(true);
      setErrorServidor('');

      const [resResumen, resDonaciones, resGastos, resCuentas, resDeuda] = await Promise.all([
        fetch(`${API_CAJA}/resumen`),
        fetch(`${API_CAJA}/donaciones`),
        fetch(`${API_CAJA}/gastos`),
        fetch(`${API_CAJA}/cuentas-cobrar`),
        fetch(`${API_CAJA}/deuda-fundacion`)
      ]);

      if (!resResumen.ok || !resDonaciones.ok || !resGastos.ok || !resCuentas.ok || !resDeuda.ok) {
        throw new Error('Fallo al obtener datos contables desde los servicios de Spring Boot');
      }

      setResumen(await resResumen.json());
      setDonaciones(await resDonaciones.json());
      setGastos(await resGastos.json());
      setCuentasCobrar(await resCuentas.json());
      setDeudaFundacion(await resDeuda.json());
    } catch (err) {
      console.error(err);
      setErrorServidor('No se pudo establecer comunicacion con el modulo financiero (puerto 8080).');
    } finally {
      setCargandoDatos(false);
    }
  };

  useEffect(() => {
    cargarDatosFinancieros();
  }, []);

  const handleGuardarDonacion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorServidor('');

    const payload = {
      donante: formDonacion.donante,
      tipoDonante: formDonacion.tipoDonante,
      monto: parseFloat(formDonacion.monto) || 0
    };

    try {
      const res = await fetch(`${API_CAJA}/donaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Error al registrar la donacion.');

      const nueva = await res.json();
      setDonaciones((prev) => [...prev, nueva]);
      setFormDonacion({ donante: '', tipoDonante: 'Persona Particular', monto: '' });
      setMensajeExito('Donacion contabilizada e ingresada al libro diario exitosamente.');
      
      const resResumen = await fetch(`${API_CAJA}/resumen`);
      if (resResumen.ok) setResumen(await resResumen.json());

      setTimeout(() => setMensajeExito(''), 4000);
    } catch (err) {
      setErrorServidor(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarGasto = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorServidor('');

    const payload = {
      concepto: formGasto.concepto,
      categoria: formGasto.categoria,
      monto: parseFloat(formGasto.monto) || 0
    };

    try {
      const res = await fetch(`${API_CAJA}/gastos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Error al registrar el gasto operativo.');

      const nuevo = await res.json();
      setGastos((prev) => [...prev, nuevo]);
      setFormGasto({ concepto: '', categoria: 'Servicios Basicos', monto: '' });
      setMensajeExito('Gasto operativo registrado y descontado del balance general.');

      const resResumen = await fetch(`${API_CAJA}/resumen`);
      if (resResumen.ok) setResumen(await resResumen.json());

      setTimeout(() => setMensajeExito(''), 4000);
    } catch (err) {
      setErrorServidor(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-2">
        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <div>
            <h3 className="fw-bold text-primary mb-0">Tesoreria, Caja y Liquidacion Interinstitucional</h3>
            <small className="text-muted">
              Modulo 4: Cuentas por Cobrar, Conciliacion de Deuda y Donaciones Multifuente (RF-012 a RF-017)
            </small>
          </div>
          <span className="badge bg-success fs-6 px-3 py-2 border">Modulo 4</span>
        </div>

        {mensajeExito && (
          <div className="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
            {mensajeExito}
          </div>
        )}

        {errorServidor && (
          <div className="alert alert-danger" role="alert">
            {errorServidor}
          </div>
        )}

        {/* Tarjetas Metricas de Resumen Financiero Consolidado */}
        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-md-6">
            <div className="card shadow-sm border-0 bg-primary text-white p-3">
              <span className="small text-white-50">Donaciones Recibidas (Ingresos)</span>
              <h4 className="fw-bold mb-0">Q {formatMoneda(resumen.totalDonaciones)}</h4>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card shadow-sm border-0 bg-danger text-white p-3">
              <span className="small text-white-50">Gastos Operativos (Egresos)</span>
              <h4 className="fw-bold mb-0">Q {formatMoneda(resumen.totalGastos)}</h4>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card shadow-sm border-0 bg-warning text-dark p-3">
              <span className="small text-dark-50">Cuentas por Cobrar (Familiares)</span>
              <h4 className="fw-bold mb-0">Q {formatMoneda(resumen.totalCuentasPorCobrar)}</h4>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card shadow-sm border-0 bg-dark text-white p-3">
              <span className="small text-white-50">Deuda Acumulada con Fundacion</span>
              <h4 className="fw-bold mb-0 text-warning">Q {formatMoneda(resumen.deudaFundacion)}</h4>
            </div>
          </div>
        </div>

        {/* Pestanas de Navegacion Interna */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link fw-semibold ${tabActiva === 'cuentas-cobrar' ? 'active text-primary' : 'text-secondary'}`}
              onClick={() => setTabActiva('cuentas-cobrar')}
            >
              Cuentas por Cobrar (Familiares)
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link fw-semibold ${tabActiva === 'deuda-fundacion' ? 'active text-primary' : 'text-secondary'}`}
              onClick={() => setTabActiva('deuda-fundacion')}
            >
              Conciliacion Deuda Fundacion
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link fw-semibold ${tabActiva === 'donaciones' ? 'active text-primary' : 'text-secondary'}`}
              onClick={() => setTabActiva('donaciones')}
            >
              Donaciones Multifuente
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link fw-semibold ${tabActiva === 'gastos' ? 'active text-primary' : 'text-secondary'}`}
              onClick={() => setTabActiva('gastos')}
            >
              Gastos Operativos
            </button>
          </li>
        </ul>

        {/* Pestana 1: Cuentas Corrientes por Familiar (RF-012 / RF-016) */}
        {tabActiva === 'cuentas-cobrar' && (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title mb-0 fw-bold">Estado de Cuenta Corriente por Residente (RF-012 y RF-016)</h5>
                <small className="text-muted">Calculo de Cuota Base Mensual (Q 1,500.00) + Consumos Clinicos de Laboratorio y Farmacia</small>
              </div>
              <button className="btn btn-sm btn-outline-secondary" onClick={cargarDatosFinancieros} disabled={cargandoDatos}>
                Recargar
              </button>
            </div>
            <div className="card-body p-0">
              {cargandoDatos ? (
                <div className="text-center py-4 text-muted">Calculando saldos pendientes...</div>
              ) : cuentasCobrar.length === 0 ? (
                <div className="p-4 text-center text-muted">No existen residentes registrados para facturacion.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-3">ID</th>
                        <th>Residente</th>
                        <th>Familiar Contacto</th>
                        <th>Cuota Base</th>
                        <th>Laboratorio</th>
                        <th>Farmacia</th>
                        <th>Saldo Total Pendiente</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cuentasCobrar.map((c) => (
                        <tr key={c.idInterno}>
                          <td className="ps-3 fw-bold text-muted">#{c.idInterno}</td>
                          <td className="fw-semibold">{c.nombreInterno}</td>
                          <td className="small text-muted">{c.familiarContacto}</td>
                          <td className="small">Q {formatMoneda(c.cuotaMantenimiento)}</td>
                          <td className="small">Q {formatMoneda(c.totalLaboratorio)}</td>
                          <td className="small">Q {formatMoneda(c.totalFarmacia)}</td>
                          <td className="fw-bold text-danger">Q {formatMoneda(c.saldoTotalPendiente)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pestana 2: Conciliacion Deuda con la Fundacion (RF-017) */}
        {tabActiva === 'deuda-fundacion' && (
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-dark text-white py-3">
                  <h5 className="card-title mb-0 fw-semibold">Desglose de Liquidacion por Pagar (RF-017)</h5>
                </div>
                <div className="card-body p-4">
                  <p className="text-muted small">
                    Consolidado automatico de obligaciones contraidas con la Fundacion Medica aliada por concepto de servicios y prescripciones prestadas a los residentes del asilo bajo tarifa social.
                  </p>
                  <ul className="list-group list-group-flush mb-4">
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div>
                        <div className="fw-semibold">Servicios Auxiliares de Laboratorio</div>
                        <small className="text-muted">Total acumulado de ordenes clinicas procesadas</small>
                      </div>
                      <span className="fw-bold fs-5 text-secondary">Q {formatMoneda(deudaFundacion.subtotalLaboratorio)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div>
                        <div className="fw-semibold">Despacho de Medicamentos en Farmacia</div>
                        <small className="text-muted">Total acumulado de recetas despachadas y bloqueadas</small>
                      </div>
                      <span className="fw-bold fs-5 text-secondary">Q {formatMoneda(deudaFundacion.subtotalFarmacia)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 bg-light">
                      <div className="fw-bold text-dark fs-5">Total Deuda Acumulada a Liquidar</div>
                      <span className="fw-bold fs-4 text-danger">Q {formatMoneda(deudaFundacion.totalDeudaFundacion)}</span>
                    </li>
                  </ul>
                  <button className="btn btn-outline-dark w-100 py-2 fw-semibold" onClick={cargarDatosFinancieros}>
                    Sincronizar Balance con Modulo de Fundacion
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card shadow-sm border-0 bg-light p-4 h-100">
                <h5 className="fw-bold text-primary mb-3">Normativa de Conciliacion Institucional</h5>
                <p className="small text-muted mb-3">
                  Segun el convenio operativo entre el Asilo Cabeza de Algodon y la Fundacion Medica, las liquidaciones se consolidan de forma mensual:
                </p>
                <div className="p-3 bg-white border rounded mb-3">
                  <div className="small fw-semibold text-dark">Precios Preferenciales Inmutables</div>
                  <div className="small text-muted">Los costos unitarios quedan fijados al momento del despacho para evitar que futuras revisiones de precios afecten historicos contables.</div>
                </div>
                <div className="p-3 bg-white border rounded">
                  <div className="small fw-semibold text-dark">Garantia contra Duplicidad</div>
                  <div className="small text-muted">Solo las recetas bloqueadas con entrega fisica confirmada y ordenes de laboratorio con toma de muestra efectiva son computadas en el saldo pasivo.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pestana 3: Donaciones Multifuente (RF-013) */}
        {tabActiva === 'donaciones' && (
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-primary text-white py-3">
                  <h5 className="card-title mb-0 fw-semibold">Ingresar Donacion Multifuente</h5>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handleGuardarDonacion}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Donante o Razon Social</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ej. Cooperativa Mazateca"
                        value={formDonacion.donante}
                        onChange={(e) => setFormDonacion({ ...formDonacion, donante: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Tipo de Entidad Donante (4 Categorias ERS)</label>
                      <select
                        className="form-select"
                        value={formDonacion.tipoDonante}
                        onChange={(e) => setFormDonacion({ ...formDonacion, tipoDonante: e.target.value })}
                        required
                      >
                        <option value="Persona Particular">Persona Particular</option>
                        <option value="Empresa Nacional">Empresa Nacional</option>
                        <option value="Empresa Internacional">Empresa Internacional</option>
                        <option value="Gobierno">Gobierno</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-semibold">Monto de Donacion (Q)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        className="form-control"
                        placeholder="0.00"
                        value={formDonacion.monto}
                        onChange={(e) => setFormDonacion({ ...formDonacion, monto: e.target.value })}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
                      {loading ? 'Contabilizando...' : 'Registrar Ingreso en Caja'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0 fw-bold">Libro Diario de Donaciones</h5>
                  <button className="btn btn-sm btn-outline-secondary" onClick={cargarDatosFinancieros} disabled={cargandoDatos}>
                    Recargar
                  </button>
                </div>
                <div className="card-body p-0">
                  {cargandoDatos ? (
                    <div className="text-center py-4 text-muted">Consultando libro diario...</div>
                  ) : donaciones.length === 0 ? (
                    <div className="p-4 text-center text-muted">No existen donaciones registradas en base de datos.</div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="ps-3">ID</th>
                            <th>Donante</th>
                            <th>Tipo de Entidad</th>
                            <th>Fecha</th>
                            <th>Monto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donaciones.map((d) => (
                            <tr key={d.id}>
                              <td className="ps-3 fw-bold text-muted">#{d.id}</td>
                              <td className="fw-semibold">{d.donante}</td>
                              <td>
                                <span className="badge bg-light text-dark border">{d.tipoDonante}</span>
                              </td>
                              <td className="small text-muted">{d.fecha}</td>
                              <td className="fw-bold text-success">Q {formatMoneda(d.monto)}</td>
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

        {/* Pestana 4: Gastos Operativos (RF-014) */}
        {tabActiva === 'gastos' && (
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-danger text-white py-3">
                  <h5 className="card-title mb-0 fw-semibold">Registrar Egreso Operativo</h5>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handleGuardarGasto}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Concepto del Gasto</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ej. Factura de Energia Electrica / Compra de gas"
                        value={formGasto.concepto}
                        onChange={(e) => setFormGasto({ ...formGasto, concepto: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Categoria de Servicio</label>
                      <select
                        className="form-select"
                        value={formGasto.categoria}
                        onChange={(e) => setFormGasto({ ...formGasto, categoria: e.target.value })}
                        required
                      >
                        <option value="Servicios Basicos">Servicios Basicos (Luz / Agua / Gas)</option>
                        <option value="Insumos Medicos">Insumos Medicos y Sanitarios</option>
                        <option value="Mantenimiento">Mantenimiento de Edificio</option>
                        <option value="Alimentacion">Alimentacion y Perecederos</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-semibold">Monto Pagado (Q)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        className="form-control"
                        placeholder="0.00"
                        value={formGasto.monto}
                        onChange={(e) => setFormGasto({ ...formGasto, monto: e.target.value })}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-danger w-100 py-2 fw-semibold" disabled={loading}>
                      {loading ? 'Procesando egreso...' : 'Registrar Salida de Caja'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0 fw-bold">Libro de Egresos y Gastos</h5>
                  <button className="btn btn-sm btn-outline-secondary" onClick={cargarDatosFinancieros} disabled={cargandoDatos}>
                    Recargar
                  </button>
                </div>
                <div className="card-body p-0">
                  {cargandoDatos ? (
                    <div className="text-center py-4 text-muted">Consultando egresos contables...</div>
                  ) : gastos.length === 0 ? (
                    <div className="p-4 text-center text-muted">No existen egresos operativos registrados.</div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="ps-3">ID</th>
                            <th>Concepto</th>
                            <th>Categoria</th>
                            <th>Fecha</th>
                            <th>Monto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gastos.map((g) => (
                            <tr key={g.id}>
                              <td className="ps-3 fw-bold text-muted">#{g.id}</td>
                              <td className="fw-semibold">{g.concepto}</td>
                              <td>
                                <span className="badge bg-light text-dark border">{g.categoria}</span>
                              </td>
                              <td className="small text-muted">{g.fecha}</td>
                              <td className="fw-bold text-danger">Q {formatMoneda(g.monto)}</td>
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