import React, { useState } from 'react';
import Navbar from '../components/Navbar';

export default function Reportes() {
  const [reporteSeleccionado, setReporteSeleccionado] = useState('DONACIONES_COBROS');

  return (
    <>
      <Navbar />
      <div className="container py-2">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <h3 className="fw-bold text-primary mb-0">Módulo de Reportes Estadísticos</h3>
          <button className="btn btn-outline-primary btn-sm fw-semibold" onClick={() => window.print()}>
            🖨️ Imprimir / Guardar PDF
          </button>
        </div>

        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-3">
            <label className="form-label small fw-semibold">Seleccione el Tipo de Reporte</label>
            <select
              className="form-select"
              value={reporteSeleccionado}
              onChange={(e) => setReporteSeleccionado(e.target.value)}
            >
              <option value="DONACIONES_COBROS">Reporte General: Balance de Donaciones vs Gastos</option>
              <option value="MEDICINAS_CAJON">Reporte Clínico: Consumo de Medicamentos de Cajón</option>
              <option value="DEUDA_FUNDACION">Reporte Financiero: Conciliación de Pagos a la Fundación</option>
            </select>
          </div>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0 fw-bold">Vista Previa de Datos Consolidados</h5>
            <span className="badge bg-light text-dark border">Agosto 2026</span>
          </div>
          <div className="card-body p-4">
            {reporteSeleccionado === 'DONACIONES_COBROS' && (
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Concepto</th>
                      <th>Categoría</th>
                      <th>Monto Ingreso</th>
                      <th>Monto Egreso</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Donación Municipal</td>
                      <td>Gobierno</td>
                      <td className="text-success fw-bold">Q 12,000.00</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>Pago de Servicio de Energía Eléctrica</td>
                      <td>Gasto Operativo</td>
                      <td>-</td>
                      <td className="text-danger fw-bold">Q 2,100.00</td>
                    </tr>
                    <tr>
                      <td>Cuotas Mensuales de Residentes</td>
                      <td>Mantenimiento</td>
                      <td className="text-success fw-bold">Q 18,500.00</td>
                      <td>-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {reporteSeleccionado === 'MEDICINAS_CAJON' && (
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Losartán 50mg (Hipertensión)
                  <span className="badge bg-primary rounded-pill">18 Residentes</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Metformina 850mg (Diabetes)
                  <span className="badge bg-primary rounded-pill">12 Residentes</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Sertralina 50mg (Ficha Psicopatológica)
                  <span className="badge bg-primary rounded-pill">6 Residentes</span>
                </li>
              </ul>
            )}

            {reporteSeleccionado === 'DEUDA_FUNDACION' && (
              <div className="alert alert-info mb-0">
                <strong>Resumen de Deuda Acumulada:</strong> Se tienen Q 4,800.00 pendientes de conciliar con la Fundación por concepto de 14 consultas especializadas con descuento preferencial aplicado[cite: 1, 5, 6].
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}