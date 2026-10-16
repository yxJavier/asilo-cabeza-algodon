import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [credenciales, setCredenciales] = useState({
    correo: 'medico.general@asilo.org',
    password: ''
  });
  const [cargando, setCargando] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setErrorMensaje('');

    try {
      const respuesta = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          correo: credenciales.correo,
          contrasena: credenciales.password
        })
      });

      if (!respuesta.ok) {
        if (respuesta.status === 401) {
          throw new Error('Credenciales invalidas. Verifique su correo y contrasena.');
        } else {
          throw new Error('No se pudo establecer conexion con el servidor de autenticacion.');
        }
      }

      const data = await respuesta.json();

      // Almacenamiento seguro del token y de la sesion en el navegador
      localStorage.setItem('token', data.tokenJwt);
      localStorage.setItem('usuario_sesion', JSON.stringify(data));

      // Redireccion automatica basada en el rol del usuario retornado por la base de datos
      if (data.rol === 'ADMINISTRADOR') {
        router.push('/facturacion');
      } else if (data.rol === 'MEDICO_GENERAL') {
        router.push('/referencias');
      } else {
        router.push('/residentes');
      }
    } catch (err) {
      setErrorMensaje(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="col-12 col-md-8 col-lg-5">
        <div className="card shadow border-0">
          <div className="card-header bg-primary text-white text-center py-4">
            <h4 className="fw-bold mb-1">Asilo Cabeza de Algodon</h4>
            <small className="text-white-50">Portal Web Administrativo y Clinico</small>
          </div>
          <div className="card-body p-4">
            {errorMensaje && (
              <div className="alert alert-danger py-2 small" role="alert">
                {errorMensaje}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Correo Institucional</label>
                <input
                  type="email"
                  className="form-control"
                  value={credenciales.correo}
                  onChange={(e) => setCredenciales({ ...credenciales, correo: e.target.value })}
                  placeholder="ejemplo@asilo.org"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Contrasena</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={credenciales.password}
                  onChange={(e) => setCredenciales({ ...credenciales, password: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={cargando}>
                {cargando ? 'Validando credenciales...' : 'Ingresar al Sistema'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 