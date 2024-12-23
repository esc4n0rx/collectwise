import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { toast } from 'react-toastify';

interface ColetoresEmAbertoModalProps {
  onClose: () => void;
}

const ITEMS_PER_PAGE = 6;

const ColetoresEmAbertoModal: React.FC<ColetoresEmAbertoModalProps> = ({ onClose }) => {
  const [coletores, setColetores] = useState<{ id: number; num_coletor: string; status: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchColetoresEmAberto();
  }, []);

  const fetchColetoresEmAberto = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('registro_coletor')
        .select('id, num_coletor, status')
        .eq('status', 'em_operacao');

      if (error) throw error;
      setColetores(data || []);
    } catch {
      toast.error('Erro ao carregar coletores em aberto.');
    } finally {
      setIsLoading(false);
    }
  };

  const alterarParaDisponivel = async (id: number) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('registro_coletor')
        .update({ status: 'disponivel' })
        .eq('id', id);

      if (error) throw error;

      toast.success('Status alterado para disponível!');
      fetchColetoresEmAberto(); // Atualiza a lista
    } catch {
      toast.error('Erro ao alterar status do coletor.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(coletores.length / ITEMS_PER_PAGE);

  const displayedColetores = coletores.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-hidden">
        <h2 className="text-lg font-bold mb-4">Coletores em Aberto</h2>
        {isLoading && <p>Carregando...</p>}
        {!isLoading && (
          <div className="flex">
            <div className="flex-1 max-h-[60vh] overflow-y-auto">
              <ul className="divide-y divide-gray-300">
                {displayedColetores.map((coletor) => (
                  <li key={coletor.id} className="flex justify-between items-center py-2">
                    <span>{coletor.num_coletor} - {coletor.status}</span>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => alterarParaDisponivel(coletor.id)}
                      disabled={isLoading}
                    >
                      Disponível
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center items-center ml-4">
              <button
                className="mb-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
              >
                Anterior
              </button>
              <button
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
              >
                Próximo
              </button>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-4 mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={onClose}
            disabled={isLoading}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColetoresEmAbertoModal;
