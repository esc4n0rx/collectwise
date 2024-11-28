import React from 'react';

interface ConfiguracaoModalProps {
  onClose: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onLogout: () => void;
}

const ConfiguracaoModal: React.FC<ConfiguracaoModalProps> = ({ onClose, darkMode, toggleDarkMode, onLogout }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Configurações</h2>
        <div className="flex items-center justify-between mb-4">
          <span>Modo Escuro</span>
          <button
            onClick={toggleDarkMode}
            className={`w-10 h-6 rounded-full ${darkMode ? 'bg-green-600' : 'bg-gray-300'}`}
          >
            <span
              className={`block w-4 h-4 bg-white rounded-full transform transition ${
                darkMode ? 'translate-x-4' : ''
              }`}
            ></span>
          </button>
        </div>
        <button
          className="w-full bg-red-500 text-white py-2 rounded mt-4"
          onClick={() => {
            onLogout();
            onClose();
          }}
        >
          Sair
        </button>
        <button className="w-full bg-gray-200 py-2 rounded mt-2" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ConfiguracaoModal;
