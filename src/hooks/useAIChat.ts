import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type AIConversation = Tables<'ai_conversations'>;
type AIMessage = Tables<'ai_messages'>;

export interface MessageWithTimestamp extends Omit<AIMessage, 'created_at'> {
  created_at: string;
  timestamp?: string;
}

export function useAIChat(conversationId?: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageWithTimestamp[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      if (!user || !currentConversationId) {
        setMessages([]);
        return;
      }

      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('ai_messages')
          .select('*')
          .eq('conversation_id', currentConversationId)
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        const messagesWithTimestamp: MessageWithTimestamp[] = (data || []).map(msg => ({
          ...msg,
          timestamp: new Date(msg.created_at).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));

        setMessages(messagesWithTimestamp);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar mensagens');
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [user, currentConversationId]);

  const createConversation = async (title?: string) => {
    if (!user) return null;

    try {
      const { data, error: insertError } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          title: title || 'Nova Conversa',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setCurrentConversationId(data.id);
      return data;
    } catch (err) {
      console.error('Error creating conversation:', err);
      return null;
    }
  };

  const sendMessage = async (content: string, role: 'user' | 'ai' = 'user', suggestions?: string[]) => {
    if (!user) return null;

    // Create conversation if it doesn't exist
    let convId = currentConversationId;
    if (!convId) {
      const newConv = await createConversation();
      if (!newConv) return null;
      convId = newConv.id;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('ai_messages')
        .insert({
          conversation_id: convId,
          role,
          content,
          suggestions: suggestions || null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const messageWithTimestamp: MessageWithTimestamp = {
        ...data,
        timestamp: new Date(data.created_at).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages(prev => [...prev, messageWithTimestamp]);
      return data;
    } catch (err) {
      console.error('Error sending message:', err);
      return null;
    }
  };

  const sendAIResponse = async (content: string, suggestions?: string[]) => {
    return sendMessage(content, 'ai', suggestions);
  };

  return {
    messages,
    loading,
    error,
    conversationId: currentConversationId,
    createConversation,
    sendMessage,
    sendAIResponse,
  };
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConversations() {
      if (!user) {
        setConversations([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('ai_conversations')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) throw error;
        setConversations(data || []);
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, [user]);

  return { conversations, loading };
}
