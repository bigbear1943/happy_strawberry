import { useState, useCallback } from 'react'
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Shuffle, Sparkles } from 'lucide-react'

import ZenCard from './components/ZenCard'
import SearchBar from './components/SearchBar'
import MagicInput from './components/MagicInput'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import { fetchRandom, addInspiration, searchInspirations, deleteInspiration } from './lib/inspirations'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 0,
    },
  },
})

function InspirationApp() {
  const qc = useQueryClient()
  const [isInputOpen, setInputOpen] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  // Fetch random inspiration
  const {
    data: randomInspiration,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['randomInspiration'],
    queryFn: fetchRandom,
  })

  // Add mutation
  const addMutation = useMutation({
    mutationFn: addInspiration,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['randomInspiration'] })
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteInspiration,
    onSuccess: () => {
      setSelectedItem(null)
      qc.invalidateQueries({ queryKey: ['randomInspiration'] })
    },
  })

  // Search handler
  const handleSearch = useCallback(async (query) => {
    setIsSearching(true)
    try {
      const results = await searchInspirations(query)
      setSearchResults(results)
    } catch {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Select from search results
  const handleSelect = (item) => {
    setSelectedItem(item)
  }

  // Get next random
  const handleNext = () => {
    setSelectedItem(null)
    refetch()
  }

  // Currently displayed card
  const displayedItem = selectedItem || randomInspiration

  return (
    <div className="min-h-dvh flex flex-col bg-zen-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] 
                        bg-gradient-to-bl from-sage-400/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[40vw] h-[40vw] 
                        bg-gradient-to-tr from-zen-300/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-sage-500" />
            <h1 className="text-xl font-semibold text-zen-800 tracking-tight">
              Inspiration Capsule
            </h1>
          </div>
          <p className="text-xs text-zen-400 tracking-widest uppercase">
            A moment of clarity
          </p>
        </motion.div>
      </header>

      {/* Search */}
      <div className="relative z-20 px-6 py-3">
        <SearchBar
          onSearch={handleSearch}
          onSelect={handleSelect}
          results={searchResults}
          isSearching={isSearching}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSpinner />
            </motion.div>
          ) : isError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ErrorMessage
                message={error?.message || 'The capsule is currently offline'}
                onRetry={refetch}
              />
            </motion.div>
          ) : displayedItem ? (
            <ZenCard
              key={displayedItem.id}
              inspiration={displayedItem}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="w-10 h-10 text-zen-300 mx-auto mb-4" />
              </motion.div>
              <p className="text-zen-400 text-lg font-light mb-2">
                Your capsule is empty
              </p>
              <p className="text-zen-300 text-sm">
                Tap the + button to add your first inspiration
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom actions */}
      <div className="relative z-10 px-6 pb-8 pt-4">
        <div className="flex items-center justify-center gap-4 max-w-lg mx-auto">
          {/* Next / Shuffle button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-full
                       zen-glass text-zen-600 text-sm font-medium
                       hover:bg-white/80 transition-all cursor-pointer
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Shuffle className="w-4 h-4" />
            Next
          </motion.button>

          {/* Add button (FAB) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setInputOpen(true)}
            className="w-14 h-14 rounded-full 
                       bg-gradient-to-br from-sage-500 to-sage-600 
                       text-white shadow-lg shadow-sage-500/30
                       flex items-center justify-center
                       hover:shadow-sage-500/40 transition-shadow cursor-pointer"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Magic Input Modal */}
      <MagicInput
        isOpen={isInputOpen}
        onClose={() => setInputOpen(false)}
        onSubmit={(content) => addMutation.mutateAsync(content)}
        isSubmitting={addMutation.isPending}
      />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InspirationApp />
    </QueryClientProvider>
  )
}
