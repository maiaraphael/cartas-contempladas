import { useEffect, useState } from 'react';
import Inventory from '../components/Inventory';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function BuscaCartas() {
  // Passa os filtros via props para Inventory
  const [filtros, setFiltros] = useState({});

  useEffect(() => {
    // Lê filtros da query string
    const params = new URLSearchParams(window.location.search);
    setFiltros({
      valor: params.get('valor'),
      segmento: params.get('segmento'),
      admin: params.get('admin'),
    });
  }, [window.location.search]);

  return (
    <>
      <Header />
      <main style={{ minHeight: '60vh' }}>
        <Inventory filtros={filtros} enableFiltros />
      </main>
      <Footer />
    </>
  );
}
