import React, { useState } from 'react';

interface RelatorioModalProps {
  onClose: () => void;
  relatorios: any[];
}

const RelatorioModal: React.FC<RelatorioModalProps> = ({ onClose, relatorios }) => {
  const [filtroData, setFiltroData] = useState('');
  const [pagina, setPagina] = useState(0);

  const resultadosPorPagina = 10;
  const filtrados = filtroData
    ? relatorios.filter((relatorio) =>
        relatorio.data_operacao.startsWith(filtroData)
      )
    : relatorios;

  const paginados = filtrados.slice(
    pagina * resultadosPorPagina,
    (pagina + 1) * resultadosPorPagina
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <h2 className="text-lg font-bold mb-4">Relatórios</h2>
        <input
          type="date"
          className="w-full p-2 mb-4 border rounded"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
        />
        <div className="overflow-y-scroll max-h-80">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Coletor</th>
                <th className="border border-gray-300 p-2">Colaborador</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Data</th>
              </tr>
            </thead>
            <tbody>
              {paginados.map((relatorio) => (
                <tr key={relatorio.id}>
                  <td className="border border-gray-300 p-2">{relatorio.id}</td>
                  <td className="border border-gray-300 p-2">{relatorio.coletor_id}</td>
                  <td className="border border-gray-300 p-2">
                    {relatorio.colaborador_nome || 'Desconhecido'}
                  </td>
                  <td className="border border-gray-300 p-2">{relatorio.status}</td>
                  <td className="border border-gray-300 p-2">{relatorio.data_operacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            disabled={pagina === 0}
            onClick={() => setPagina(pagina - 1)}
          >
            Anterior
          </button>
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            disabled={(pagina + 1) * resultadosPorPagina >= filtrados.length}
            onClick={() => setPagina(pagina + 1)}
          >
            Próximo
          </button>
        </div>
        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatorioModal;
