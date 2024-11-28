import React, { useState } from 'react';
import { supabase } from '../../supabase';
import { toast } from 'react-toastify';

interface DevolucaoModalProps {
  onClose: () => void;
}

const DevolucaoModal: React.FC<DevolucaoModalProps> = ({ onClose }) => {
  const [numColetor, setNumColetor] = useState('');
  const [nomeColaborador, setNomeColaborador] = useState('');
  const [operacaoId, setOperacaoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const buscarColaborador = async () => {
    if (!numColetor) {
      toast.error('Digite o número do coletor!');
      return;
    }
    setIsLoading(true);
    try {
      const { data: operacao, error: operacaoError } = await supabase
        .from('registro_operacao')
        .select('id, colaborador_id')
        .eq('coletor_id', numColetor)
        .eq('status', 'liberado')
        .single();

      if (operacaoError || !operacao) {
        toast.error('Coletor não encontrado ou não em operação!');
        setNomeColaborador('');
        return;
      }

      const { data: colaborador, error: colaboradorError } = await supabase
        .from('registro_user')
        .select('nome')
        .eq('id', operacao.colaborador_id)
        .single();

      if (colaboradorError || !colaborador) {
        toast.error('Erro ao buscar colaborador associado!');
        setNomeColaborador('');
        return;
      }

      setNomeColaborador(colaborador.nome);
      setOperacaoId(operacao.id); // Armazena o ID da operação para atualização
      toast.success(`Colaborador associado: ${colaborador.nome}`);
    } catch {
      toast.error('Erro ao buscar colaborador associado!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPressColetor = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      buscarColaborador();
    }
  };

  const handleDevolver = async () => {
    if (!nomeColaborador || !operacaoId) {
      toast.error('Erro: Busque um coletor válido antes de devolver!');
      return;
    }
    setIsLoading(true);
    try {
      // Atualizar o status do coletor para 'disponivel'
      const { error: coletorError } = await supabase
        .from('registro_coletor')
        .update({ status: 'disponivel' })
        .eq('num_coletor', numColetor);

      if (coletorError) {
        toast.error('Erro ao atualizar status do coletor!');
        return;
      }

      // Atualizar o status da operação para 'finalizado'
      const { error: operacaoError } = await supabase
        .from('registro_operacao')
        .update({ status: 'finalizado' })
        .eq('id', operacaoId);

      if (operacaoError) {
        toast.error('Erro ao atualizar status da operação!');
        return;
      }

      toast.success('Coletor devolvido com sucesso!');
      onClose(); // Fecha o modal após a devolução
    } catch {
      toast.error('Erro ao devolver coletor!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Devolver Coletor</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Número do Coletor"
            className="w-full p-2 mb-2 border rounded"
            value={numColetor}
            onChange={(e) => setNumColetor(e.target.value)}
            onKeyDown={handleKeyPressColetor}
            disabled={isLoading}
          />
          {nomeColaborador && (
            <p className="mt-2 text-green-600">Colaborador: {nomeColaborador}</p>
          )}
        </div>
        <div className="flex justify-end gap-4">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose} disabled={isLoading}>
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-orange-600 text-white rounded"
            onClick={handleDevolver}
            disabled={isLoading}
          >
            {isLoading ? 'Devolvendo...' : 'Devolver'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevolucaoModal;
