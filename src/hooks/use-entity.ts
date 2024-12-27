import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Entity } from '@/types/entity';

interface EntityFormData {
  mode: 'wild' | 'neutral' | 'safe';
  name: string;
  description: string;
  personality: string;
  avatar?: string;
  instruction: string;
  knowledge: string;
}

export function useEntity(entityId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entity, setEntity] = useState<Entity | null>(null);

  useEffect(() => {
    if (!entityId) return;

    const fetchEntity = async () => {
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('entities')
          .select('*')
          .eq('id', entityId)
          .maybeSingle(); // Use maybeSingle() instead of single()

        if (fetchError) throw fetchError;
        setEntity(data);
      } catch (err) {
        console.error('Error fetching entity:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch entity');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntity();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel(`entity-${entityId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'entities',
        filter: `id=eq.${entityId}`,
      }, (payload) => {
        if (payload.new) {
          setEntity(payload.new as Entity);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [entityId]);

  const createEntity = async (formData: EntityFormData): Promise<Entity> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get session
      const session = localStorage.getItem('session') ? 
        JSON.parse(localStorage.getItem('session')!) : null;

      // Check if name already exists
      const { data: existingEntity, error: checkError } = await supabase
        .from('entities')
        .select('name')
        .eq('name', formData.name)
        .maybeSingle(); // Use maybeSingle() instead of single()

      if (checkError) throw checkError;
      if (existingEntity) {
        throw new Error('An entity with this name already exists');
      }

      // Create new entity
      const { data, error: createError } = await supabase
        .from('entities')
        .select()
        .insert({
          ...formData,
          system_prompt: `You are ${formData.name}, a creative spirit with the following traits:
- Personality: ${formData.personality}
- Knowledge: ${formData.knowledge}
- Instructions: ${formData.instruction}
- Description: ${formData.description}`,
          avatar_loaded: Boolean(formData.avatar),
        })
        .select()
        .single();

      if (createError) throw createError;
      if (!data) throw new Error('Failed to create entity');

      return data;
    } catch (err) {
      console.error('Failed to create entity:', err);
      setError(err instanceof Error ? err.message : 'Failed to create entity');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createEntity,
    isLoading,
    error,
    entity,
    clearError: () => setError(null)
  };
}