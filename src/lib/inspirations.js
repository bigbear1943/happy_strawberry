import { supabase } from './supabaseClient'

/**
 * Fetch all distinct categories from the database
 */
export async function fetchCategories() {
    const { data, error } = await supabase
        .from('inspirations')
        .select('category')

    if (error) throw error

    // Extract unique categories
    const unique = [...new Set(data.map((d) => d.category).filter(Boolean))]
    return unique.sort()
}

/**
 * Add a new inspiration to the database
 */
export async function addInspiration({ content, category }) {
    const { data, error } = await supabase
        .from('inspirations')
        .insert([{ content, category: category || '一般' }])
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
 * Fetch a random inspiration filtered by selected categories
 */
export async function fetchRandomByCategories(categories) {
    if (!categories || categories.length === 0) {
        return fetchRandom()
    }

    // Get count for filtered set
    const { count, error: countError } = await supabase
        .from('inspirations')
        .select('*', { count: 'exact', head: true })
        .in('category', categories)

    if (countError) throw countError
    if (!count || count === 0) return null

    // Pick a random offset within the filtered set
    const randomOffset = Math.floor(Math.random() * count)

    const { data, error } = await supabase
        .from('inspirations')
        .select('*')
        .in('category', categories)
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
