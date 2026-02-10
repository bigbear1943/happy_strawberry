import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight } from 'lucide-react'

export default function SearchBar({ onSearch, onSelect, results, isSearching }) {
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef(null)
    const debounceRef = useRef(null)

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)

        if (query.trim().length >= 2) {
            debounceRef.current = setTimeout(() => {
                onSearch(query.trim())
            }, 400)
        }

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [query, onSearch])

    const handleClear = () => {
        setQuery('')
        setIsOpen(false)
        inputRef.current?.blur()
    }

    const handleSelect = (item) => {
        onSelect(item)
        handleClear()
    }

    return (
        <div className="w-full max-w-lg mx-auto relative">
            {/* Search input */}
            <motion.div
                className="zen-glass rounded-2xl flex items-center gap-3 px-4 py-3"
                animate={isOpen ? { boxShadow: '0 8px 40px rgba(0,0,0,0.08)' } : {}}
            >
                <Search className="w-4 h-4 text-zen-400 shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setIsOpen(true)
                    }}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    placeholder="搜尋你的靈感膠囊..."
                    className="flex-1 bg-transparent text-zen-800 placeholder-zen-400 
                     text-sm outline-none"
                />
                {query && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={handleClear}
                        className="p-1 rounded-full hover:bg-zen-100 transition-colors cursor-pointer"
                    >
                        <X className="w-3.5 h-3.5 text-zen-400" />
                    </motion.button>
                )}
            </motion.div>

            {/* Results dropdown */}
            <AnimatePresence>
                {isOpen && query.trim().length >= 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 z-50
                       zen-glass-strong rounded-2xl overflow-hidden max-h-72 overflow-y-auto"
                    >
                        {isSearching ? (
                            <div className="px-4 py-6 text-center">
                                <div className="zen-shimmer h-4 w-3/4 mx-auto rounded-full mb-2" />
                                <div className="zen-shimmer h-4 w-1/2 mx-auto rounded-full" />
                            </div>
                        ) : results && results.length > 0 ? (
                            results.map((item, i) => (
                                <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => handleSelect(item)}
                                    className="w-full flex items-center gap-3 px-4 py-3 
                             hover:bg-sage-400/5 transition-colors text-left
                             border-b border-zen-100 last:border-0 cursor-pointer"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-zen-700 truncate">{item.content}</p>
                                        <p className="text-xs text-zen-400 mt-0.5">{item.category}</p>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 text-zen-300 shrink-0" />
                                </motion.button>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-center">
                                <p className="text-zen-400 text-sm">找不到相關靈感</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && query.trim().length >= 2 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={handleClear}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
