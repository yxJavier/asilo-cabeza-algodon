import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { API_BASE } from '../config/api';

export default function ModuloReportesEstadisticos() {
  const [tipoReporte, setTipoReporte] = useState(`BALANCE_GENERAL`);
  const [cargando, setCargando] = useState(true);
  const [errorServidor, setErrorServidor] = useState(``);

  // Estados de datos relacionales desde PostgreSQL
  const [resumenFinanciero, setResumenFinanciero] = useState({
    totalDonaciones: 0,
    totalGastos: 0,
    saldoNeto: 0,
    deudaFundacion: 0,
    totalCuentasPorCobrar: 0
  });
  const [donaciones, setDonaciones] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [cuentasCobrar, setCuentasCobrar] = useState([]);
  const [deudaFundacion, setDeudaFundacion] = useState({
    subtotalLaboratorio: 0,
    subtotalFarmacia: 0,
    totalDeudaFundacion: 0
  });
  const [internos, setInternos] = useState([]);
  const [ordenesLab, setOrdenesLab] = useState([]);
  const [despachosFarmacia, setDespachosFarmacia] = useState([]);

  const formatMoneda = (val) => {
    const num = Number(val) || 0;
    return num.toLocaleString(`en-US`, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const cargarDatosReportes = async () => {
    try {
      setCargando(true);
      setErrorServidor(``);

      const [
        resResumen,
        resDonaciones,
        resGastos,
        resCuentas,
        resDeuda,
        resInternos,
        resLab,
        resFarmacia
      ] = await Promise.all([
        fetch(`${API_BASE}/api/v1/caja/resumen`),
        fetch(`${API_BASE}/api/v1/caja/donaciones`),
        fetch(`${API_BASE}/api/v1/caja/gastos`),
        fetch(`${API_BASE}/api/v1/caja/cuentas-cobrar`),
        fetch(`${API_BASE}/api/v1/caja/deuda-fundacion`),
        fetch(`${API_BASE}/api/v1/internos`),
        fetch(`${API_BASE}/api/v1/laboratorio`),
        fetch(`${API_BASE}/api/v1/farmacia`)
      ]);

      if (
        !resResumen.ok ||
        !resDonaciones.ok ||
        !resGastos.ok ||
        !resCuentas.ok ||
        !resDeuda.ok ||
        !resInternos.ok ||
        !resLab.ok ||
        !resFarmacia.ok
      ) {
        throw new Error(`Error al sincronizar datos consolidados para reportes.`);
      }

      setResumenFinanciero(await resResumen.json());
      setDonaciones(await resDonaciones.json());
      setGastos(await resGastos.json());
      setCuentasCobrar(await resCuentas.json());
      setDeudaFundacion(await resDeuda.json());
      setInternos(await resInternos.json());
      setOrdenesLab(await resLab.json());
      setDespachosFarmacia(await resFarmacia.json());
    } catch (err) {
      console.error(err);
      setErrorServidor(`No se pudo establecer comunicacion con los endpoints de reporteria.`);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatosReportes();
  }, []);

  return (
    <>
      <div className="d-print-none">
        <Navbar />
      </div>

      <div className="container py-2">
        {/* Encabezado del Módulo con accion de impresion */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <div>
            <h3 className="fw-bold text-primary mb-0">Centro de Reportes Estadisticos y Gerenciales</h3>
            <small className="text-muted">
              Modulo 5: Inteligencia de Negocio, Metricas Clinicas y Financieras (RF-018 a RF-024)
            </small>
          </div>
          <div className="d-flex gap-2 d-print-none">
            <button className="btn btn-sm btn-outline-secondary" onClick={cargarDatosReportes} disabled={cargando}>
              Actualizar Metricas
            </button>
            <button className="btn btn-sm btn-primary fw-semibold" onClick={() => window.print()}>
              Imprimir / Exportar PDF
            </button>
          </div>
        </div>

        {errorServidor && (
          <div className="alert alert-danger d-print-none" role="alert">
            {errorServidor}
          </div>
        )}

        {/* Tarjetas Metricas Superiores */}
        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-6">
            <div className="card shadow-sm border-0 p-3 bg-light">
              <span className="small text-muted fw-semibold">Poblacion de Residentes</span>
              <h4 className="fw-bold mb-0 text-dark">{internos.length} Activos</h4>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="card shadow-sm border-0 p-3 bg-light">
              <span className="small text-muted fw-semibold">Superavit / Saldo Caja</span>
              <h4 className={`fw-bold mb-0 ${resumenFinanciero.saldoNeto >= 0 ? `text-success` : `text-danger`}`}>
                Q {formatMoneda(resumenFinanciero.saldoNeto)}
              </h4>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="card shadow-sm border-0 p-3 bg-light">
              <span className="small text-muted fw-semibold">Por Cobrar (Familias)</span>
              <h4 className="fw-bold mb-0 text-warning">
                Q {formatMoneda(resumenFinanciero.totalCuentasPorCobrar)}
              </h4>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="card shadow-sm border-0 p-3 bg-light">
              <span className="small text-muted fw-semibold">Pasivo con Fundacion</span>
              <h4 className="fw-bold mb-0 text-danger">
                Q {formatMoneda(resumenFinanciero.deudaFundacion)}
              </h4>
            </div>
          </div>
        </div>

        {/* Selector de Informes ERS */}
        <div className="card shadow-sm border-0 mb-4 d-print-none">
          <div className="card-body p-3">
            <label className="form-label small fw-semibold">Seleccione el Informe a Generar</label>
            <select
              className="form-select fw-semibold"
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value)}
            >
              <option value="BALANCE_GENERAL">RF-022: Balance General de Ingresos y Egresos (Caja)</option>
              <option value="CUENTAS_COBRAR">RF-020: Cobros y Saldos por Paciente (Familiares)</option>
              <option value="DEUDA_FUNDACION">RF-021: Liquidacion y Deuda Acumulada con Fundacion</option>
              <option value="EXAMENES_LAB">RF-023: Historial de Pruebas Clinicas y Laboratorio</option>
              <option value="FARMACOS">RF-019 / RF-024: Consumo de Medicinas de Cajon y Despachos</option>
            </select>
          </div>
        </div>

        {/* Panel Principal del Reporte Seleccionado */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0 fw-bold">
              {tipoReporte === `BALANCE_GENERAL` && `Informe RF-022: Balance Financiero de Entradas y Salidas`}
              {tipoReporte === `CUENTAS_COBRAR` && `Informe RF-020: Estados de Cuenta y Cobros por Residente`}
              {tipoReporte === `DEUDA_FUNDACION` && `Informe RF-021: Liquidacion Institucional con Fundacion Medica`}
              {tipoReporte === `EXAMENES_LAB` && `Informe RF-023: Registro Consolidado de Pruebas de Laboratorio`}
              {tipoReporte === `FARMACOS` && `Informe RF-019/024: Censo de Medicamentos de Cajon y Farmacia`}
            </h5>
            <span className="badge bg-light text-dark border">Consolidado Oficial</span>
          </div>

          <div className="card-body p-4">
            {cargando ? (
              <div className="text-center py-5 text-muted">
                <div className="spinner-border text-primary mb-2" role="status"></div>
                <div>Generando informe analitico desde PostgreSQL...</div>
              </div>
            ) : (
              <>
                {/* 1. BALANCE GENERAL (RF-022) */}
                {tipoReporte === `BALANCE_GENERAL` && (
                  <div>
                    <h6 className="fw-bold text-success border-bottom pb-2 mb-3">1. Ingresos por Donaciones Multifuente</h6>
                    {donaciones.length === 0 ? (
                      <p className="text-muted small">No hay donaciones registradas.</p>
                    ) : (
                      <div className="table-responsive mb-4">
                        <table className="table table-sm table-hover align-middle">
                          <thead className="table-light">
                            <tr>
                              <th>Donante</th>
                              <th>Tipo de Entidad (4 Fuentes)</th>
                              <th>Fecha</th>
                              <th className="text-end">Monto</th>
                            </tr>
                          </thead>
                          <tbody>
                            {donaciones.map((d) => (
                              <tr key={d.id}>
                                <td>{d.donante}</td>
                                <td><span className="badge bg-light text-dark border">{d.tipoDonante}</span></td>
                                <td className="small text-muted">{d.fecha}</td>
                                <td className="text-end fw-semibold text-success">Q {formatMoneda(d.monto)}</td>
                              </tr>
                            ))}
                            <tr className="table-light fw-bold">
                              <td colSpan="3">Total Ingresos por Donaciones</td>
                              <td className="text-end text-success">Q {formatMoneda(resumenFinanciero.totalDonaciones)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    <h6 className="fw-bold text-danger border-bottom pb-2 mb-3">2. Egresos por Gastos Operativos</h6>
                    {gastos.length === 0 ? (
                      <p className="text-muted small">No hay gastos operativos registrados.</p>
                    ) : (
                      <div className="table-responsive mb-4">
                        <table className="table table-sm table-hover align-middle">
                          <thead className="table-light">
                            <tr>
                              <th>Concepto del Gasto</th>
                              <th>Categoria</th>
                              <th>Fecha</th>
                              <th className="text-end">Monto</th>
                            </tr>
                          </thead>
                          <tbody>
                            {gastos.map((g) => (
                              <tr key={g.id}>
                                <td>{g.concepto}</td>
                                <td><span className="badge bg-light text-dark border">{g.categoria}</span></td>
                                <td className="small text-muted">{g.fecha}</td>
                                <td className="text-end fw-semibold text-danger">Q {formatMoneda(g.monto)}</td>
                              </tr>
                            ))}
                            <tr className="table-light fw-bold">
                              <td colSpan="3">Total Egresos Operativos</td>
                              <td className="text-end text-danger">Q {formatMoneda(resumenFinanciero.totalGastos)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. CUENTAS POR COBRAR (RF-020) */}
                {tipoReporte === `CUENTAS_COBRAR` && (
                  <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Residente</th>
                          <th>Familiar Responsable</th>
                          <th>Cuota Base</th>
                          <th>Laboratorios</th>
                          <th>Farmacia</th>
                          <th>Total Adeudado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cuentasCobrar.map((c) => (
                          <tr key={c.idInterno}>
                            <td className="fw-bold text-muted">#{c.idInterno}</td>
                            <td className="fw-semibold">{c.nombreInterno}</td>
                            <td className="small text-muted">{c.familiarContacto}</td>
                            <td>Q {formatMoneda(c.cuotaMantenimiento)}</td>
                            <td>Q {formatMoneda(c.totalLaboratorio)}</td>
                            <td>Q {formatMoneda(c.totalFarmacia)}</td>
                            <td className="fw-bold text-danger">Q {formatMoneda(c.saldoTotalPendiente)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3. CONCILIACION DEUDA FUNDACION (RF-021) */}
                {tipoReporte === `DEUDA_FUNDACION` && (
                  <div>
                    <div className="row g-3 mb-4">
                      <div className="col-md-4">
                        <div className="p-3 border rounded bg-light">
                          <span className="small text-muted">Total Examenes Laboratorio</span>
                          <h4 className="fw-bold mb-0">Q {formatMoneda(deudaFundacion.subtotalLaboratorio)}</h4>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-3 border rounded bg-light">
                          <span className="small text-muted">Total Fármacos Despachados</span>
                          <h4 className="fw-bold mb-0">Q {formatMoneda(deudaFundacion.subtotalFarmacia)}</h4>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-3 border rounded bg-danger text-white">
                          <span className="small text-white-50">Obligacion Total Acumulada</span>
                          <h4 className="fw-bold mb-0">Q {formatMoneda(deudaFundacion.totalDeudaFundacion)}</h4>
                        </div>
                      </div>
                    </div>
                    <p className="small text-muted">
                      El saldo anterior representa la suma consolidada de costos con descuento social pactados con la Fundacion Medica por cada atencion brindada a los residentes.
                    </p>
                  </div>
                )}

                {/* 4. HISTORIAL DE LABORATORIO (RF-023) */}
                {tipoReporte === `EXAMENES_LAB` && (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Residente</th>
                          <th>Tipo de Examen</th>
                          <th>Resultado Clinico</th>
                          <th>Tarifa Social</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordenesLab.length === 0 ? (
                          <tr><td colSpan="6" className="text-center text-muted">No existen ordenes de laboratorio.</td></tr>
                        ) : (
                          ordenesLab.map((o) => (
                            <tr key={o.id}>
                              <td className="fw-bold text-muted">#{o.id}</td>
                              <td className="fw-semibold">{o.nombreInterno}</td>
                              <td>{o.tipoExamen}</td>
                              <td className="small text-muted">{o.resultado || `Pendiente de resultado`}</td>
                              <td className="fw-semibold">Q {formatMoneda(o.costoPreferencial)}</td>
                              <td>
                                <span className={`badge ${o.estado === `Completado` ? `bg-success-subtle text-success border border-success-subtle` : `bg-warning-subtle text-warning border border-warning-subtle`}`}>
                                  {o.estado}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 5. FARMACOS DE CAJON Y FARMACIA (RF-019 / RF-024) */}
                {tipoReporte === `FARMACOS` && (
                  <div>
                    <h6 className="fw-bold text-primary border-bottom pb-2 mb-3">1. Medicamentos de Uso Diario Continuo ("De Cajon")</h6>
                    <div className="table-responsive mb-4">
                      <table className="table table-sm table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Residente</th>
                            <th>Ficha Psicopatologica</th>
                            <th>Medicamentos Prescritos</th>
                          </tr>
                        </thead>
                        <tbody>
                          {internos.map((i) => (
                            <tr key={i.id}>
                              <td className="fw-semibold">{i.nombreCompleto}</td>
                              <td className="small text-muted">{i.fichaPsicopatologica || `Sin observaciones`}</td>
                              <td>
                                {i.medicinasCajon && i.medicinasCajon.length > 0 ? (
                                  i.medicinasCajon.map((m, idx) => (
                                    <span key={idx} className="badge bg-light text-dark border me-1">
                                      {m.nombreMedicamento} ({m.dosisDiaria} - {m.frecuencia})
                                    </span>
                                  ))
                                ) : (
                                  <span className="small text-muted fst-italic">Sin medicinas asignadas</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <h6 className="fw-bold text-primary border-bottom pb-2 mb-3">2. Fármacos Dispensados en Farmacia Externa</h6>
                    <div className="table-responsive">
                      <table className="table table-sm table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Residente</th>
                            <th>Medicamento</th>
                            <th>Cantidad</th>
                            <th>Costo Total</th>
                            <th>Estado de Entrega</th>
                          </tr>
                        </thead>
                        <tbody>
                          {despachosFarmacia.length === 0 ? (
                            <tr><td colSpan="5" className="text-center text-muted">No hay despachos externos registrados.</td></tr>
                          ) : (
                            despachosFarmacia.map((d) => (
                              <tr key={d.id}>
                                <td className="fw-semibold">{d.nombreInterno}</td>
                                <td>{d.medicamento}</td>
                                <td>{d.cantidad} unid.</td>
                                <td className="fw-semibold">Q {formatMoneda(d.costoPreferencial)}</td>
                                <td>
                                  <span className="badge bg-success-subtle text-success border border-success-subtle">
                                    {d.estado}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}