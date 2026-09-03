import React, { useState } from 'react';
import Navbar from '../components/Navbar';

export default function Facturacion() {
  const [donaciones, setDonaciones] = useState([
    { id: 1, donante: 'Fundación Médica GT', tipo: 'Empresa Nacional', monto: 5000 },
    { id: 2, donante: 'Alcaldía Municipal', tipo: 'Gobierno', monto: 12000 }
  ]);

  const [formDonacion, setFormDonacion] = useState({
    nombreDonante: '',
    tipoDonante: 'Persona Particular',
    monto: ''
  });

  const [alerta, setAlerta] = useState(false);

  //Funcion para sincronizar el tipo de moneda
  const formatMoneda = (numero) => {
    return Number(numero).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  const handleGuardarDonacion = (e) => {
    e.preventDefault();
    const nueva = {
      id: donaciones.length + 1,
      donante: formDonacion.nombreDonante,
      tipo: formDonacion.tipoDonante,
      monto: parseFloat(formDonacion.monto)
    };
    setDonaciones([...donaciones, nueva]);
    setFormDonacion({ nombreDonante: '', tipoDonante: 'Persona Particular', monto: '' });
    setAlerta(true);
    setTimeout(() => setAlerta(false), 3000);
  };

  return (
    <>
      <Navbar />
      <div className="container py-2">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <h3 className="fw-bold text-primary mb-0">Módulo Financiero y Caja</h3>
          <span className="badge bg-success text-white">Administración / Tesorería</span>
        </div>

        {alerta && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            ✅ <strong>¡Donación registrada!</strong> Ingreso contabilizado en el balance general.
          </div>
        )}

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0 bg-primary text-white p-3">
              <small>Total Donaciones</small>
              <h3 className="fw-bold mb-0">Q {donaciones.reduce((acc, d) => acc + d.monto, 0).toLocaleString()}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0 bg-secondary text-white p-3">
              <small>Gastos Operativos (Luz/Agua)</small>
              <h3 className="fw-bold mb-0">Q 3,450.00</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0 bg-warning text-dark p-3">
              <small>Cuentas por Cobrar (Familiares)</small>
              <h3 className="fw-bold mb-0">Q 8,200.00</h3>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-primary text-white py-3">
                <h5 className="card-title mb-0">Ingreso de Donación Multifuente</h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleGuardarDonacion}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Nombre del Donante / Institución</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formDonacion.nombreDonante}
                      onChange={(e) => setFormDonacion({ ...formDonacion, nombreDonante: e.target.value })}
                      placeholder="Ej. Cooperativa Mazateca"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Tipo de Donante (4 Categorías)</label>
                    <select
                      className="form-select"
                      value={formDonacion.tipoDonante}
                      onChange={(e) => setFormDonacion({ ...formDonacion, tipoDonante: e.target.value })}
                    >
                      <option value="Persona Particular">Persona Particular</option>
                      <option value="Empresa Nacional">Empresa Nacional</option>
                      <option value="Empresa Internacional">Empresa Internacional</option>
                      <option value="Gobierno">Gobierno</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Monto (Quetzales)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formDonacion.monto}
                      onChange={(e) => setFormDonacion({ ...formDonacion, monto: e.target.value })}
                      placeholder="0.00"
                      min="1"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                    Registrar Donación en Caja
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 border-bottom">
                <h5 className="card-title mb-0 fw-bold">Registro de Ingresos por Donaciones</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-3">Donante</th>
                        <th>Tipo</th>
                        <th>Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donaciones.map((d) => (
                        <tr key={d.id}>
                          <td className="ps-3 fw-semibold">{d.donante}</td>
                          <td>
                            <span className="badge bg-light text-dark border">{d.tipo}</span>
                          </td>
                          <td className="fw-bold text-success">Q {d.monto.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}