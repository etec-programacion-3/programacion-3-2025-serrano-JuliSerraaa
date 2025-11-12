import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import apiClient from '../api/AxiosConfig.js';
import ConversationList from '../components/ConversationList.jsx';
import MessageList from '../components/MessageList.jsx';
import MessageInput from '../components/MessageInput.jsx';
import '../styles/ChatPage.css';

/**
 * COMPONENTE: ChatPage
 * DESCRIPCIÓN: Página principal del sistema de mensajería
 * FUNCIONALIDAD:
 * - Gestiona conversaciones y mensajes
 * - Implementa polling para actualización en tiempo casi real
 * - Coordina entre lista de conversaciones y vista de chat
 */
function ChatPage() {
  // ===== CONTEXTO Y ESTADOS =====
  const { user } = useAuth(); // Usuario actual
  const [conversations, setConversations] = useState([]); // Lista de conversaciones
  const [selectedConversation, setSelectedConversation] = useState(null); // Conversación activa
  const [messages, setMessages] = useState([]); // Mensajes de la conversación activa
  const [loading, setLoading] = useState(true); // Estado de carga inicial
  const [messagesLoading, setMessagesLoading] = useState(false); // Carga de mensajes
  const [error, setError] = useState(null); // Manejo de errores
  // ===== REFS PARA POLLING =====
  const pollingIntervalRef = useRef(null); // Referencia al intervalo de polling

  // ===== EFECTO PARA CARGAR CONVERSACIONES =====
  /**
   * HOOK: useEffect
   * DESCRIPCIÓN: Carga la lista de conversaciones del usuario al montar el componente
   */
  useEffect(() => {
    fetchConversations();
  }, []);

  // ===== EFECTO PARA POLLING DE MENSAJES =====
  /**
   * HOOK: useEffect
   * DESCRIPCIÓN: Inicia/detiene el polling basado en la conversación seleccionada
   * DEPENDENCIAS: [selectedConversation] - Se reinicia cuando cambia la conversación
   */
  useEffect(() => {
    // Limpiar intervalo anterior si existe
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    // Iniciar polling solo si hay una conversación seleccionada
    if (selectedConversation) {
      // Cargar mensajes inmediatamente
      fetchMessages(selectedConversation.id);
      
      // Configurar polling cada 3 segundos
      pollingIntervalRef.current = setInterval(() => {
        fetchMessages(selectedConversation.id, false); // false = no mostrar loading
      }, 3000);
    }

    // Cleanup: limpiar intervalo al desmontar o cambiar conversación
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [selectedConversation]);

  /**
   * FUNCIÓN: fetchConversations
   * DESCRIPCIÓN: Obtiene la lista de conversaciones del usuario
   */
  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // LLAMADA A LA API: Obtener conversaciones del usuario
      const response = await apiClient.get('/chat/conversations');
      setConversations(response.data);
      
    } catch (err) {
      console.error('Error al cargar conversaciones:', err);
      setError('Error al cargar las conversaciones. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * FUNCIÓN: fetchMessages
   * DESCRIPCIÓN: Obtiene los mensajes de una conversación específica
   * @param {number} conversationId - ID de la conversación
   * @param {boolean} showLoading - Si mostrar estado de carga
   */
  const fetchMessages = async (conversationId, showLoading = true) => {
    try {
      if (showLoading) {
        setMessagesLoading(true);
      }
      
      // LLAMADA A LA API: Obtener mensajes de la conversación
      const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
      setMessages(response.data);
      
    } catch (err) {
      console.error('Error al cargar mensajes:', err);
      // No mostramos error en polling para no molestar al usuario
      if (showLoading) {
        setError('Error al cargar los mensajes. Intenta nuevamente.');
      }
    } finally {
      if (showLoading) {
        setMessagesLoading(false);
      }
    }
  };

  /**
   * MANEJADOR: handleConversationSelect
   * DESCRIPCIÓN: Cambia la conversación activa
   * @param {object} conversation - Conversación seleccionada
   */
  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setMessages([]); // Limpiar mensajes anteriores
  };

  /**
   * MANEJADOR: handleNewMessage
   * DESCRIPCIÓN: Envía un nuevo mensaje y actualiza la interfaz
   * @param {string} content - Contenido del mensaje
   */
  const handleNewMessage = async (content) => {
    if (!selectedConversation) return;

    try {
      // Crear mensaje optimista (se muestra inmediatamente)
      const optimisticMessage = {
        id: Date.now(), // ID temporal
        content,
        senderId: user.id,
        conversationId: selectedConversation.id,
        createdAt: new Date().toISOString(),
        Sender: {
          id: user.id,
          username: user.username
        }
      };

      // Agregar mensaje optimista a la lista
      setMessages(prev => [...prev, optimisticMessage]);

      // LLAMADA A LA API: Enviar mensaje real
      await apiClient.post(`/chat/conversations/${selectedConversation.id}/messages`, {
        content
      });

      // Recargar mensajes para obtener el ID real y asegurar consistencia
      fetchMessages(selectedConversation.id, false);

      // Actualizar la última actividad en la lista de conversaciones
      updateConversationLastActivity(selectedConversation.id);

    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      
      // Revertir mensaje optimista en caso de error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      
      setError('Error al enviar el mensaje. Intenta nuevamente.');
    }
  };

  /**
   * FUNCIÓN: updateConversationLastActivity
   * DESCRIPCIÓN: Actualiza el timestamp de una conversación en la lista
   * @param {number} conversationId - ID de la conversación a actualizar
   */
  const updateConversationLastActivity = (conversationId) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, updatedAt: new Date().toISOString() }
          : conv
      ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  };

  /**
   * MANEJADOR: handleNewConversation
   * DESCRIPCIÓN: Crea una nueva conversación y la selecciona
   * @param {number} otherUserId - ID del usuario con quien iniciar conversación
   */
  const handleNewConversation = async (otherUserId) => {
    try {
      // LLAMADA A LA API: Crear nueva conversación
      const response = await apiClient.post('/chat/conversations', {
        receiverId: otherUserId
      });

      const newConversation = response.data;
      
      // Agregar la nueva conversación a la lista
      setConversations(prev => [newConversation, ...prev]);
      
      // Seleccionar la nueva conversación
      setSelectedConversation(newConversation);
      setMessages([]); // Limpiar mensajes
      
      // Cerrar modal
      setShowNewConversationModal(false);
      
    } catch (err) {
      console.error('Error al crear conversación:', err);
      setError('Error al crear la conversación. Intenta nuevamente.');
    }
  };

  // ===== RENDERIZADO CONDICIONAL =====
  
  // ESTADO DE CARGA INICIAL
  if (loading) {
    return (
      <div className="chat-page">
        <div className="loading">Cargando conversaciones...</div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      {/* ===== HEADER DEL CHAT ===== */}
      <div className="chat-header">
        <h1 className="chat-title">Mensajes</h1>
      </div>

      {/* ===== MENSAJE DE ERROR ===== */}
      {error && (
        <div className="error">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="error-close"
          >
            ×
          </button>
        </div>
      )}

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <div className="chat-content">
        
        {/* ===== PANEL DE CONVERSACIONES ===== */}
        <div className="conversations-panel">
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onConversationSelect={handleConversationSelect}
            currentUser={user}
          />
        </div>

        {/* ===== PANEL DE MENSAJES ===== */}
        <div className="messages-panel">
          {selectedConversation ? (
            <>
              {/* ===== CABECERA DE LA CONVERSACIÓN ===== */}
              <div className="conversation-header">
                <h3 className="conversation-with">
                  Conversación con{' '}
                  {selectedConversation.User1.id === user.id 
                    ? selectedConversation.User2.username 
                    : selectedConversation.User1.username
                  }
                </h3>
              </div>

              {/* ===== LISTA DE MENSAJES ===== */}
              <div className="messages-container">
                <MessageList
                  messages={messages}
                  loading={messagesLoading}
                  currentUser={user}
                />
              </div>

              {/* ===== INPUT PARA ENVIAR MENSAJES ===== */}
              <div className="message-input-container">
                <MessageInput
                  onSendMessage={handleNewMessage}
                  disabled={messagesLoading}
                />
              </div>
            </>
          ) : (
            // ===== ESTADO SIN CONVERSACIÓN SELECCIONADA =====
            <div className="no-conversation-selected">
              <div className="no-conversation-icon">💬</div>
              <h3>Selecciona una conversación</h3>
              <p className="text-muted">
                Elige una conversación existente o inicia una nueva
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default ChatPage;