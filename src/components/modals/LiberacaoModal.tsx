import React, { useState } from 'react';
import { supabase } from '../../supabase';
import { toast } from 'react-toastify';

interface LiberacaoModalProps {
  onClose: () => void;
}

const LiberacaoModal: React.FC<LiberacaoModalProps> = ({ onClose }) => {
  const [matricula, setMatricula] = useState('');
  const [nomeColaborador, setNomeColaborador] = useState('');
  const [colaboradorId, setColaboradorId] = useState<number | null>(null);
  const [numColetor, setNumColetor] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const buscarColaborador = async () => {
    if (!matricula) {
      toast.error('Digite a matrícula!');
      return;
    }
    setIsLoading(true);
    try {
      const { data: colaborador, error } = await supabase
        .from('registro_user')
        .select('id, nome')
        .eq('matricula', matricula)
        .single();

      if (error || !colaborador) {
        toast.error('Colaborador não encontrado!');
        setNomeColaborador('');
        setColaboradorId(null);
      } else {
        setNomeColaborador(colaborador.nome);
        setColaboradorId(colaborador.id);
        toast.success(`Colaborador encontrado: ${colaborador.nome}`);
      }
    } catch {
      toast.error('Erro ao buscar colaborador!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLiberar = async () => {
    if (!nomeColaborador || !numColetor || !colaboradorId) {
      toast.error('Preencha todos os campos!');
      return;
    }
    setIsLoading(true);

    try {
      const { data: coletor, error: coletorError } = await supabase
        .from('registro_coletor')
        .select('id, status')
        .eq('num_coletor', numColetor)
        .single();

      if (coletorError || !coletor || coletor.status !== 'disponivel') {
        toast.error('Coletor não disponível!');
        return;
      }

      await supabase
        .from('registro_coletor')
        .update({ status: 'em_operacao' })
        .eq('id', coletor.id);

      await supabase.from('registro_operacao').insert({
        coletor_id: coletor.id,
        colaborador_id: colaboradorId,
        status: 'liberado',
      });

      toast.success('Coletor liberado com sucesso!');
      onClose();
    } catch {
      toast.error('Erro ao liberar coletor!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Liberar Coletor</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Matrícula do Colaborador"
            className="w-full p-2 mb-2 border rounded"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && buscarColaborador()}
            disabled={isLoading}
          />
          {nomeColaborador && (
            <p className="mt-2 text-green-600">Colaborador: {nomeColaborador}</p>
          )}
        </div>
        <input
          type="text"
          placeholder="Número do Coletor"
          className="w-full p-2 mb-4 border rounded"
          value={numColetor}
          onChange={(e) => setNumColetor(e.target.value)}
          disabled={isLoading}
        />
        <div className="flex justify-end gap-4">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose} disabled={isLoading}>
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleLiberar}
            disabled={isLoading}
          >
            {isLoading ? 'Liberando...' : 'Liberar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiberacaoModal;
