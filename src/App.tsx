import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import RelatorioModal from './components/modals/RelatorioModal';
import LiberacaoModal from './components/modals/LiberacaoModal';
import DevolucaoModal from './components/modals/DevolucaoModal';
import ConfiguracaoModal from './components/modals/ConfiguracaoModal';

type Relatorio = {
  id: number;
  coletor_id: number;
  status: string;
  data_operacao: string;
  registro_user?: {
    nome: string;
  };
};


const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [coletorDisponivel, setColetorDisponivel] = useState(0);
  const [coletorLiberado, setColetorLiberado] = useState(0);
  const [modal, setModal] = useState<null | 'liberacao' | 'devolucao' | 'relatorio' | 'configuracao'>(null);
  const [relatorios, setRelatorios] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchIndicadores();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchIndicadores = async () => {
    try {
      const { data: disponiveis } = await supabase
        .from('registro_coletor')
        .select('*')
        .eq('status', 'disponivel');
      setColetorDisponivel(disponiveis?.length || 0);

      const { data: liberados } = await supabase
        .from('registro_coletor')
        .select('*')
        .eq('status', 'em_operacao');
      setColetorLiberado(liberados?.length || 0);
    } catch {
      toast.error('Erro ao carregar indicadores.');
    }
  };

  const fetchRelatorios = async () => {
    try {
      const { data, error } = await supabase
        .from('registro_operacao')
        .select(`
          id,
          coletor_id,
          status,
          data_operacao,
          registro_user (nome)
        `);
  
      if (error) throw error;
  
      const relatoriosComNome: Relatorio[] = (data || []).map((relatorio: any) => ({
        ...relatorio,
        colaborador_nome: relatorio.registro_user?.nome || 'Desconhecido',
      }));
  
      setRelatorios(relatoriosComNome);
    } catch (error) {
      console.error((error as Error).message);
      toast.error('Erro ao carregar relatórios.');
    }
  };
  
  

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className="p-4 flex justify-between items-center bg-green-600 text-white">
        <h1 className="text-xl font-bold">CollectWise Dashboard</h1>
        <button
          className="bg-gray-800 p-2 rounded-full hover:bg-gray-700"
          onClick={() => setModal('configuracao')}
        >
          ⚙️
        </button>
      </header>

      <main className="flex flex-col flex-1 p-4">
        <h2 className="text-2xl mb-4">Bem-vindo, {user?.nome}!</h2>

        {/* Cards de Indicadores */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card title="Coletores Disponíveis" value={coletorDisponivel} color="text-green-600" />
          <Card title="Liberados" value={coletorLiberado} color="text-blue-600" />
        </div>

        {/* Botões de Ações */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
            onClick={() => setModal('liberacao')}
          >
            Liberar Coletor
          </button>
          <button
            className="bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700"
            onClick={() => setModal('devolucao')}
          >
            Devolver Coletor
          </button>
          <button
            className="bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700"
            onClick={() => {
              setModal('relatorio');
              fetchRelatorios();
            }}
          >
            Relatórios
          </button>
        </div>

        <ToastContainer />
      </main>

      {/* Modais */}
      {modal === 'liberacao' && (
          <LiberacaoModal
            onClose={() => {
              setModal(null);
              fetchIndicadores(); 
            }}
          />
        )}
        {modal === 'devolucao' && (
          <DevolucaoModal
            onClose={() => {
              setModal(null);
              fetchIndicadores(); 
            }}
          />
        )}
      {modal === 'relatorio' && (
        <RelatorioModal
          onClose={() => setModal(null)}
          relatorios={relatorios} 
        />
      )}
      {modal === 'configuracao' && (
        <ConfiguracaoModal
          onClose={() => setModal(null)}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

const Card: React.FC<{ title: string; value: number; color: string }> = ({ title, value, color }) => (
  <div className="bg-white rounded-lg shadow p-4 text-center">
    <h3 className="text-lg font-bold text-gray-700">{title}</h3>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

export default App;
