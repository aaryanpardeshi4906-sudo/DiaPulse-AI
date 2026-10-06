import { supabase } from '../lib/supabaseClient'
import { demoInsights, demoRecords, demoReminders } from '../lib/demoData'

export async function getHealthRecordsForUser(userId) {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })

  if (error) {
    console.warn('Supabase health_records read failed:', error)
    return { records: demoRecords, isDemoData: true }
  }

  if (!data || data.length === 0) {
    return { records: demoRecords, isDemoData: true }
  }

  return { records: data, isDemoData: false }
}

export async function saveHealthRecord(record, userId) {
  const payload = {
    ...record,
    user_id: userId,
    recorded_at: record.recorded_at || new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('health_records')
    .insert([payload])
    .select()

  if (error) {
    throw error
  }

  return data?.[0]
}

export async function getAiInsightsForUser(userId) {
  const { data, error } = await supabase
    .from('ai_insights')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('Supabase ai_insights read failed:', error)
    return demoInsights
  }

  if (!data || data.length === 0) {
    return demoInsights
  }

  return data
}

export async function getRemindersForUser(userId) {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('Supabase reminders read failed:', error)
    return demoReminders
  }

  if (!data || data.length === 0) {
    return demoReminders
  }

  return data
}

export async function updateReminderStatus(reminderId, isCompleted) {
  const { error } = await supabase
    .from('reminders')
    .update({ is_completed: isCompleted })
    .eq('id', reminderId)

  if (error) {
    throw error
  }
}

export async function deleteReminder(reminderId) {
  const { error } = await supabase.from('reminders').delete().eq('id', reminderId)

  if (error) {
    throw error
  }
}

export async function addReminder(reminder, userId) {
  const payload = {
    ...reminder,
    user_id: userId,
    created_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from('reminders').insert([payload]).select()

  if (error) {
    throw error
  }

  return data?.[0]
}
