import React from 'react';
import '../styles/ConversationList.css';

/**
 * COMPONENTE: ConversationList
 * DESCRIPCIÓN: Lista lateral de conversaciones del usuario
 * PROPS:
 * - conversations: Array de conversaciones
 * - selectedConversation: Conversación actualmente seleccionada
 * - onConversationSelect: Función para seleccionar conversación
 * - currentUser: Usuario actual
 */
function ConversationList({ conversations, selectedConversation, onConversationSelect, currentUser }) {
  /**
   * FUNCIÓN: getOtherUser
   * DESCRIPCIÓN: Obtiene la información del otro usuario en la conversación
   * @param {object} conversation - Conversación
   * @returns {object} - Información del otro usuario
   */
  const getOtherUser = (conversation) => {
    return conversation.User1.id === currentUser.id ? conversation.User2 : conversation.User1;
  };

  /**
   * FUNCIÓN: formatLastActivity
   * DESCRIPCIÓN: Formatea la fecha de última actividad
   * @param {string} dateString - Fecha en formato ISO
   * @returns {string} - Fecha formateada
   */
  const formatLastActivity = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} d`;
    
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className="conversation-list">
      {/* ===== HEADER DE LA LISTA ===== */}
      <div className="conversation-list-header">
        <h3 className="conversation-list-title">Conversaciones</h3>
        <span className="conversation-count">
          {conversations.length}
        </span>
      </div>

      {/* ===== LISTA DE CONVERSACIONES ===== */}
      <div className="conversation-items">
        {conversations.length > 0 ? (
          conversations.map(conversation => {
            const otherUser = getOtherUser(conversation);
            const isSelected = selectedConversation?.id === conversation.id;

            return (
              <div
                key={conversation.id}
                className={`conversation-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onConversationSelect(conversation)}
              >
                {/* ===== AVATAR DEL USUARIO ===== */}
                <div className="conversation-avatar">
                  {otherUser.username.charAt(0).toUpperCase()}
                </div>

                {/* ===== INFORMACIÓN DE LA CONVERSACIÓN ===== */}
                <div className="conversation-info">
                  <div className="conversation-user">
                    <span className="username">{otherUser.username}</span>
                    <span className="timestamp">
                      {formatLastActivity(conversation.updatedAt)}
                    </span>
                  </div>
                  
                  {/* ===== ÚLTIMO MENSAJE (podría expandirse en el futuro) ===== */}
                  <div className="conversation-preview">
                    <span className="preview-text">
                      Haz clic para ver la conversación...
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          // ===== ESTADO SIN CONVERSACIONES =====
          <div className="no-conversations">
            <div className="no-conversations-icon">💬</div>
            <p className="no-conversations-text">
              No tienes conversaciones aún
            </p>
            <p className="no-conversations-hint">
              Inicia una nueva conversación para comenzar a chatear
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationList;