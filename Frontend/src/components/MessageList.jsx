import React, { useEffect, useRef } from 'react';
import '../styles/MessageList.css';

/**
 * COMPONENTE: MessageList
 * DESCRIPCIÓN: Lista de mensajes en una conversación con auto-scroll
 * PROPS:
 * - messages: Array de mensajes
 * - loading: Estado de carga
 * - currentUser: Usuario actual
 */
function MessageList({ messages, loading, currentUser }) {
  // ===== REF PARA AUTO-SCROLL =====
  const messagesEndRef = useRef(null);

  // ===== EFECTO PARA AUTO-SCROLL =====
  /**
   * HOOK: useEffect
   * DESCRIPCIÓN: Hace scroll al final de la lista cuando llegan nuevos mensajes
   * DEPENDENCIAS: [messages] - Se ejecuta cuando cambian los mensajes
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * FUNCIÓN: scrollToBottom
   * DESCRIPCIÓN: Hace scroll suave al final de la lista de mensajes
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * FUNCIÓN: formatMessageTime
   * DESCRIPCIÓN: Formatea la hora del mensaje
   * @param {string} dateString - Fecha en formato ISO
   * @returns {string} - Hora formateada
   */
  const formatMessageTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * FUNCIÓN: isSameSender
   * DESCRIPCIÓN: Determina si varios mensajes consecutivos son del mismo remitente
   * @param {number} currentIndex - Índice del mensaje actual
   * @returns {boolean} - True si el mensaje anterior es del mismo remitente
   */
  const isSameSender = (currentIndex) => {
    if (currentIndex === 0) return false;
    
    const currentMessage = messages[currentIndex];
    const previousMessage = messages[currentIndex - 1];
    
    return currentMessage.senderId === previousMessage.senderId;
  };

  return (
    <div className="message-list">
      {/* ===== ESTADO DE CARGA ===== */}
      {loading && (
        <div className="messages-loading">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}

      {/* ===== LISTA DE MENSAJES ===== */}
      <div className="messages">
        {messages.map((message, index) => {
          const isOwnMessage = message.senderId === currentUser.id;
          const showAvatar = !isOwnMessage && !isSameSender(index);

          return (
            <div
              key={message.id || `temp-${message.createdAt}`}
              className={`message ${isOwnMessage ? 'own-message' : 'other-message'} ${showAvatar ? 'with-avatar' : ''}`}
            >
              {/* ===== AVATAR (solo para mensajes de otros y cuando cambia el remitente) ===== */}
              {showAvatar && (
                <div className="message-avatar">
                  {message.Sender?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}

              {/* ===== CONTENIDO DEL MENSAJE ===== */}
              <div className="message-content">
                {/* ===== NOMBRE DEL REMITENTE (solo primer mensaje de una serie) ===== */}
                {!isOwnMessage && showAvatar && (
                  <div className="message-sender">
                    {message.Sender?.username || 'Usuario'}
                  </div>
                )}

                {/* ===== BURBUJA DEL MENSAJE ===== */}
                <div className="message-bubble">
                  <p className="message-text">{message.content}</p>
                  <span className="message-time">
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* ===== ELEMENTO PARA AUTO-SCROLL ===== */}
        <div ref={messagesEndRef} />
      </div>

      {/* ===== ESTADO SIN MENSAJES ===== */}
      {!loading && messages.length === 0 && (
        <div className="no-messages">
          <div className="no-messages-icon">💭</div>
          <h3>No hay mensajes aún</h3>
          <p className="text-muted">
            Sé el primero en enviar un mensaje en esta conversación
          </p>
        </div>
      )}
    </div>
  );
}

export default MessageList;