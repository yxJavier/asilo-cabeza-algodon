import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
      <div className="container">
        <Link href="/" className="navbar-brand fw-bold">
          👴 Asilo Cabeza de Algodón
        </Link>
        <div className="d-flex gap-2">
          <Link href="/residentes" className="btn btn-sm btn-outline-light">
            Residentes
          </Link>
          <Link href="/referencias" className="btn btn-sm btn-outline-light">
            Referencias
          </Link>
          <Link href="/facturacion" className="btn btn-sm btn-outline-light">
            Caja y Donaciones
          </Link>
          <Link href="/reportes" className="btn btn-sm btn-outline-light">
            Reportes
          </Link>
          <Link href="/" className="btn btn-sm btn-light text-primary fw-semibold ms-2">
            Salir
          </Link>
        </div>
      </div>
    </nav>
  );
}