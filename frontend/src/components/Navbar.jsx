import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const [sesion, setSesion] = useState(null);

  useEffect(() => {
    // Recuperar datos de sesion guardados en el login
    const sesionStr = localStorage.getItem('usuario_sesion');
    if (sesionStr) {
      try {
        setSesion(JSON.parse(sesionStr));
      } catch (e) {
        console.error('Error al parsear sesion:', e);
      }
    }
  }, []);

  const handleCerrarSesion = () => {
    localStorage.clear();
    router.push('/');
  };

  const rol = sesion?.rol;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-3">
      <div className="container">
        <Link className="navbar-brand fw-bold" href="/residentes">
          Asilo Cabeza de Algodón
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* 1. Modulo Residentes: Accesible para Administradores, Medicos y Enfermeros */}
            {(rol === 'ADMINISTRADOR' || rol === 'MEDICO_GENERAL' || rol === 'ENFERMERO') && (
              <li className="nav-item">
                <Link
                  className={`nav-link ${router.pathname === '/residentes' ? 'active fw-bold' : ''}`}
                  href="/residentes"
                >
                  Residentes
                </Link>
              </li>
            )}

            {/* 2. Modulo Referencias: Exclusivo para perfil Clinico y Administrativo */}
            {(rol === 'ADMINISTRADOR' || rol === 'MEDICO_GENERAL' || rol === 'ENFERMERO') && (
              <li className="nav-item">
                <Link
                  className={`nav-link ${router.pathname === '/referencias' ? 'active fw-bold' : ''}`}
                  href="/referencias"
                >
                  Referencias
                </Link>
              </li>
            )}

            {/* 3. Modulo Fundacion: Atencion externa, Laboratorio y Farmacia */}
            {(rol === 'ADMINISTRADOR' || rol === 'COORD_FUNDACION' || rol === 'MEDICO_ESPECIALISTA' || rol === 'LABORATORISTA' || rol === 'FARMACEUTICO') && (
              <li className="nav-item">
                <Link
                  className={`nav-link ${router.pathname === '/fundacion' ? 'active fw-bold' : ''}`}
                  href="/fundacion"
                >
                  Fundación Médica
                </Link>
              </li>
            )}

            {/* 4. Modulo Facturacion / Caja: Estrictamente visible solo para ADMINISTRADOR */}
            {rol === 'ADMINISTRADOR' && (
              <li className="nav-item">
                <Link
                  className={`nav-link ${router.pathname === '/facturacion' ? 'active fw-bold' : ''}`}
                  href="/facturacion"
                >
                  Facturación y Caja
                </Link>
              </li>
            )}

            {/* 5. Modulo Reportes Gerenciales: Administrador y Coordinacion */}
            {(rol === 'ADMINISTRADOR' || rol === 'COORD_FUNDACION') && (
              <li className="nav-item">
                <Link
                  className={`nav-link ${router.pathname === '/reportes' ? 'active fw-bold' : ''}`}
                  href="/reportes"
                >
                  Reportes
                </Link>
              </li>
            )}
          </ul>

          {/* Seccion de Usuario y Logout */}
          <div className="d-flex align-items-center gap-3">
            {sesion ? (
              <>
                <div className="text-end d-none d-md-block text-white">
                  <div className="small fw-semibold">{sesion.nombreCompleto}</div>
                  <span className="badge bg-light text-primary py-1 px-2" style={{ fontSize: '0.75rem' }}>
                    {sesion.rol}
                  </span>
                </div>
                <button
                  onClick={handleCerrarSesion}
                  className="btn btn-outline-light btn-sm fw-semibold"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link href="/" className="btn btn-light btn-sm fw-semibold">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}