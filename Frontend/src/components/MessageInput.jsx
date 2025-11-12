import React, { useState } from 'react';
import '../styles/MessageInput.css';

/**
 * COMPONENTE: MessageInput
 * DESCRIPCIÓN: Campo de entrada para enviar mensajes
 * PROPS:
 * - onSendMessage: Función para enviar mensaje
 * - disabled: Si el input está deshabilitado
 */
function MessageInput({ onSendMessage, disabled }) {
  // ===== ESTADOS =====
  const [message, setMessage] = useState(''); // Texto del mensaje

  /**
   * MANEJADOR: handleSubmit
   * DESCRIPCIÓN: Envía el mensaje y limpia el input
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que el mensaje no esté vacío
    if (!message.trim() || disabled) return;

    // Enviar mensaje
    onSendMessage(message.trim());
    
    // Limpiar input
    setMessage('');
  };

  /**
   * MANEJADOR: handleKeyPress
   * DESCRIPCIÓN: Permite enviar con Enter (sin Shift)
   * @param {Event} e - Evento del teclado
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-form">
      <div className="message-input-container">
        {/* ===== CAMPO DE TEXTO ===== */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe un mensaje..."
          disabled={disabled}
          className="message-textarea"
          rows="1"
        />
        
        {/* ===== BOTÓN ENVIAR ===== */}
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="send-button"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M22 2L11 13" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M22 2L15 22L11 13L2 9L22 2Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}

export default MessageInput;