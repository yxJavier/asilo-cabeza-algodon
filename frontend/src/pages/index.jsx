import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [credenciales, setCredenciales] = useState({
    correo: 'admin@cabezaalgodon.com',
    password: '',
    rol: 'ADMINISTRADOR'
  });
  const [cargando, setCargando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCargando(true);

    setTimeout(() => {
      setCargando(false);
      // Redirecciona al módulo correspondiente según el rol
      if (credenciales.rol === 'MEDICO_GENERAL') {
        router.push('/referencias');
      } else {
        router.push('/residentes');
      }
    }, 600);
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="col-12 col-md-8 col-lg-5">
        <div className="card shadow border-0">
          <div className="card-header bg-primary text-white text-center py-4">
            <h4 className="fw-bold mb-1">Asilo Cabeza de Algodón</h4>
            <small className="text-white-50">Portal Web Administrativo y Clínico</small>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Correo Institucional</label>
                <input
                  type="email"
                  className="form-control"
                  value={credenciales.correo}
                  onChange={(e) => setCredenciales({ ...credenciales, correo: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={credenciales.password}
                  onChange={(e) => setCredenciales({ ...credenciales, password: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Perfil de Acceso (RBAC)</label>
                <select
                  className="form-select"
                  value={credenciales.rol}
                  onChange={(e) => setCredenciales({ ...credenciales, rol: e.target.value })}
                >
                  <option value="ADMINISTRADOR">Administrador / Caja</option>
                  <option value="MEDICO_GENERAL">Médico General (Asilo)</option>
                  <option value="ENFERMERIA">Personal de Enfermería</option>
                  <option value="COORDINADOR_FUNDACION">Coordinador de Fundación</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={cargando}>
                {cargando ? 'Iniciando sesión...' : 'Ingresar al Sistema'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}