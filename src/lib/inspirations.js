import { supabase } from './supabaseClient'

/**
 * Auto-categorize content based on simple heuristics
 */
function autoTag(content) {
    const trimmed = content.trim()
    const charCount = trimmed.length

    if (trimmed.startsWith('http') || trimmed.includes('://')) return '連結'
    if (trimmed.includes('TODO') || trimmed.includes('todo') || trimmed.includes('待辦')) return '待辦'
    if (charCount <= 20) return '語錄'
    if (charCount <= 60) return '想法'
    return '筆記'
}

/**
 * Add a new inspiration to the database
 */
export async function addInspiration(content) {
    const category = autoTag(content)

    const { data, error } = await supabase
        .from('inspirations')
        .insert([{ content, category }])
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Fetch a random inspiration from the database
 */
export async function fetchRandom() {
    // First get total count
    const { count, error: countError } = await supabase
        .from('inspirations')
        .select('*', { count: 'exact', head: true })

    if (countError) throw countError
    if (!count || count === 0) return null

    // Pick a random offset
    const randomOffset = Math.floor(Math.random() * count)

    const { data, error } = await supabase
        .from('inspirations')
        .select('*')
        .range(randomOffset, randomOffset)
        .single()

    if (error) throw error
    return data
}

/**
 * Search inspirations by keyword
 */
export async function searchInspirations(query) {
    const { data, error } = await supabase
        .from('inspirations')
        .select('*')
        .ilike('content', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20)

    if (error) throw error
    return data || []
}

/**
 * Delete an inspiration by ID
 */
export async function deleteInspiration(id) {
    const { error } = await supabase
        .from('inspirations')
        .delete()
        .eq('id', id)

    if (error) throw error
}
