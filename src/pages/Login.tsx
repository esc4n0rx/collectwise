import React, { useState } from 'react';
import { supabase } from '../supabase';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const Login: React.FC = () => {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase
        .from('registro_user')
        .select('id, nome, cargo')
        .eq('matricula', matricula)
        .eq('senha', senha)
        .single();

      if (error || !data) {
        toast.error('Credenciais inválidas!');
        return;
      }

      if (data.cargo !== 'supervisor') {
        toast.error('Acesso permitido apenas para supervisores!');
        return;
      }

      // Armazena as informações do usuário no localStorage
      localStorage.setItem('user', JSON.stringify(data));

      toast.success(`Bem-vindo, ${data.nome}!`);
      navigate('/'); // Redireciona para o dashboard
    } catch (err) {
      toast.error('Erro ao fazer login. Tente novamente.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-4">
          Login - CollectWise
        </h1>
        <input
          type="text"
          placeholder="Matrícula"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Entrar
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
