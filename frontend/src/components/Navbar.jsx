// components/Navbar.jsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3 shadow-sm">
      <div className="container-fluid p-0">
        <span className="navbar-brand fw-bold text-uppercase fs-6">
          Asilo Cabeza de Algodón
        </span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 mt-2 mt-lg-0">
            <li className="nav-item">
              <Link href="/residentes" className="nav-link text-white">Residentes</Link>
            </li>
            <li className="nav-item">
              <Link href="/referencias" className="nav-link text-white">Referencias</Link>
            </li>
            <li className="nav-item">
              <Link href="/fundacion" className="nav-link text-white">Fundación</Link>
            </li>
            <li className="nav-item">
              <Link href="/facturacion" className="nav-link text-white">Caja y Donaciones</Link>
            </li>
            <li className="nav-item">
              <Link href="/reportes" className="nav-link text-white">Reportes</Link>
            </li>
          </ul>
          <div className="d-flex">
            <button className="btn btn-outline-light btn-sm w-100 mt-2 mt-lg-0" type="button">
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}