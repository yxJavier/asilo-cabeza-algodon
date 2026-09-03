import React, { useState } from 'react';
import Navbar from '../components/Navbar';

export default function Referencias() {
  const [referencias, setReferencias] = useState([
    { id: 101, interno: 'Mateo Morales', especialidad: 'Geriatría', familiar: 'familiar.morales@gmail.com', estado: 'Pendiente' }
  ]);

  const [form, setForm] = useState({
    nombreInterno: 'Francisca Pérez',
    especialidad: 'Cardiología',
    correoFamiliar: 'francisca.fam@gmail.com',
    motivo: 'Control de hipertensión y fatiga frecuente.'
  });

  const [notificando, setNotificando] = useState(false);
  const [alerta, setAlerta] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setNotificando(true);

    setTimeout(() => {
      const nueva = {
        id: referencias.length + 101,
        interno: form.nombreInterno,
        especialidad: form.especialidad,
        familiar: form.correoFamiliar,
        estado: 'Pendiente'
      };

      setReferencias([...referencias, nueva]);
      setNotificando(false);
      setAlerta(true);
      setTimeout(() => setAlerta(false), 4000);
    }, 700);
  };

  return (
    <>
      <Navbar />
      <div className="container py-2">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <h3 className="fw-bold text-primary mb-0">Módulo de Referencias y Agendamiento</h3>
          <span className="badge bg-info text-dark">Médico General / Coordinación</span>
        </div>

        {alerta && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            ✅ <strong>¡Referencia Registrada!</strong> Se ha despachado la notificación al familiar responsable.
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-primary text-white py-3">
                <h5 className="card-title mb-0">Emitir Solicitud de Derivación</h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Residente</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.nombreInterno}
                      onChange={(e) => setForm({ ...form, nombreInterno: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Especialidad Requerida</label>
                    <select
                      className="form-select"
                      value={form.especialidad}
                      onChange={(e) => setForm({ ...form, especialidad: e.target.value })}
                    >
                      <option value="Geriatría">Geriatría</option>
                      <option value="Cardiología">Cardiología</option>
                      <option value="Neurología">Neurología</option>
                      <option value="Oftalmología">Oftalmología</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Correo de Notificación (Familiar)</label>
                    <input
                      type="email"
                      className="form-control"
                      value={form.correoFamiliar}
                      onChange={(e) => setForm({ ...form, correoFamiliar: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Motivo Clínico de Derivación</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={form.motivo}
                      onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={notificando}>
                    {notificando ? 'Despachando solicitud...' : 'Emitir Referencia'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 border-bottom">
                <h5 className="card-title mb-0 fw-bold">Bandeja de Referencias Activas</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-3">ID</th>
                        <th>Residente</th>
                        <th>Especialidad</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referencias.map((r) => (
                        <tr key={r.id}>
                          <td className="ps-3 fw-bold text-muted">#{r.id}</td>
                          <td className="fw-semibold">{r.interno}</td>
                          <td>{r.especialidad}</td>
                          <td>
                            <span className="badge bg-warning text-dark border">{r.estado}</span>
                          </td>
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