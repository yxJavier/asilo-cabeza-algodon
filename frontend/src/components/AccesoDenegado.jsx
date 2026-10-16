import React from 'react';
import Link from 'next/link';

export default function AccesoDenegado({ modulo = 'este módulo', rolActual = 'No identificado' }) {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 border-top border-4 border-danger">
            <div className="card-body p-4 text-center">
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 mb-3">
                Código HTTP 403: Prohibido
              </span>
              <h4 className="fw-bold text-dark mb-2">Acceso Restringido por Perfil (RBAC)</h4>
              <p className="text-muted small mb-4">
                Su cuenta actual cuenta con el perfil <strong>{rolActual}</strong>, el cual no dispone de autorizaciones para consultar o manipular la información de <strong>{modulo}</strong>.
              </p>

              <div className="alert alert-light border small text-start mb-4">
                <div className="fw-semibold text-secondary mb-1">Norma de Segregación de Funciones:</div>
                <div className="text-muted">
                  El personal clínico no tiene acceso a módulos contables, y el personal administrativo no interviene en prescripciones ni órdenes médicas.
                </div>
              </div>

              <div className="d-flex justify-content-center gap-2">
                <Link href="/residentes" className="btn btn-primary btn-sm px-3">
                  Ir al Módulo Principal
                </Link>
                <Link href="/" className="btn btn-outline-secondary btn-sm px-3">
                  Cambiar de Usuario
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}