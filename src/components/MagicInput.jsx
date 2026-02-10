import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Send, Plus, Tag, ChevronDown } from 'lucide-react'

export default function MagicInput({ isOpen, onClose, onSubmit, isSubmitting, categories = [] }) {
    const [content, setContent] = useState('')
    const [category, setCategory] = useState('')
    const [newCategory, setNewCategory] = useState('')
    const [showCategoryPicker, setShowCategoryPicker] = useState(false)
    const [isAddingNew, setIsAddingNew] = useState(false)

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setContent('')
            setCategory('')
            setNewCategory('')
            setIsAddingNew(false)
            setShowCategoryPicker(false)
        }
    }, [isOpen])

    const handleSubmit = async () => {
        if (!content.trim() || isSubmitting) return
        const finalCategory = isAddingNew ? newCategory.trim() : category
        await onSubmit({ content: content.trim(), category: finalCategory || '一般' })
        setContent('')
        setCategory('')
        setNewCategory('')
        onClose()
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSubmit()
        }
    }

    const selectCategory = (cat) => {
        setCategory(cat)
        setIsAddingNew(false)
        setShowCategoryPicker(false)
    }

    const startAddNew = () => {
        setIsAddingNew(true)
        setCategory('')
        setShowCategoryPicker(false)
    }

    const displayCategory = isAddingNew
        ? (newCategory.trim() || '新分類...')
        : (category || '選擇分類')

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-zen-950/20 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 60, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 60, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-x-4 bottom-6 z-50 sm:inset-x-auto sm:left-1/2 
                       sm:-translate-x-1/2 sm:w-full sm:max-w-lg"
                    >
                        <div className="zen-glass-strong rounded-3xl p-6 relative overflow-hidden">
                            {/* Decorative gradient */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 
                              bg-gradient-to-bl from-sage-400/15 to-transparent rounded-full" />

                            {/* Header */}
                            <div className="flex items-center justify-between mb-4 relative">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-sage-500" />
                                    <h3 className="text-sm font-medium text-zen-700 tracking-wide">
                                        新增靈感
                                    </h3>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="p-1.5 rounded-full hover:bg-zen-100 
                             transition-colors cursor-pointer"
                                >
                                    <X className="w-4 h-4 text-zen-400" />
                                </motion.button>
                            </div>

                            {/* Textarea */}
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="記下一個想法、一句語錄、或一道靈感的火花..."
                                rows={4}
                                autoFocus
                                className="w-full bg-zen-50/50 rounded-2xl p-4 text-zen-800 
                           placeholder-zen-400 text-sm leading-relaxed outline-none 
                           resize-none border border-zen-200/50 
                           focus:border-sage-400/50 transition-colors"
                            />

                            {/* Category Picker */}
                            <div className="mt-3 relative">
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl
                             bg-zen-50/80 border border-zen-200/50 
                             hover:border-sage-400/50 transition-colors
                             text-sm cursor-pointer w-full"
                                >
                                    <Tag className="w-3.5 h-3.5 text-sage-500" />
                                    <span className={category || (isAddingNew && newCategory.trim())
                                        ? 'text-zen-700 font-medium'
                                        : 'text-zen-400'
                                    }>
                                        {displayCategory}
                                    </span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-zen-400 ml-auto transition-transform
                    ${showCategoryPicker ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Category dropdown */}
                                <AnimatePresence>
                                    {showCategoryPicker && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -4 }}
                                            className="absolute bottom-full left-0 right-0 mb-2
                                 bg-white rounded-2xl shadow-lg border border-zen-100
                                 max-h-48 overflow-y-auto z-10"
                                        >
                                            {/* Existing categories */}
                                            {categories.length > 0 && categories.map((cat) => (
                                                <button
                                                    key={cat}
                                                    onClick={() => selectCategory(cat)}
                                                    className={`w-full text-left px-4 py-2.5 text-sm
                                     hover:bg-sage-400/5 transition-colors cursor-pointer
                                     border-b border-zen-50 last:border-0
                                     ${category === cat ? 'text-sage-600 font-medium bg-sage-400/5' : 'text-zen-700'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}

                                            {/* Add new category button */}
                                            <button
                                                onClick={startAddNew}
                                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm
                                   text-sage-600 hover:bg-sage-400/5 transition-colors 
                                   cursor-pointer border-t border-zen-100"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                新增分類
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* New category input */}
                                <AnimatePresence>
                                    {isAddingNew && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-2"
                                        >
                                            <input
                                                type="text"
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)}
                                                placeholder="輸入新的分類名稱..."
                                                autoFocus
                                                className="w-full bg-zen-50/50 rounded-xl px-3 py-2 text-sm
                                   text-zen-800 placeholder-zen-400 outline-none
                                   border border-sage-400/50"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-4 relative">
                                {/* Selected category display */}
                                <div className="flex items-center gap-1.5 text-xs text-zen-400">
                                    {(category || (isAddingNew && newCategory.trim())) && (
                                        <>
                                            <span className="w-1.5 h-1.5 rounded-full bg-sage-400" />
                                            分類：<span className="font-medium text-zen-600">
                                                {isAddingNew ? newCategory.trim() : category}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Submit button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSubmit}
                                    disabled={!content.trim() || isSubmitting}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full
                             bg-gradient-to-r from-sage-500 to-sage-600
                             text-white text-sm font-medium shadow-lg shadow-sage-500/20
                             disabled:opacity-40 disabled:cursor-not-allowed
                             hover:shadow-sage-500/30 transition-all cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className="w-4 h-4 border-2 border-white/30 
                                 border-t-white rounded-full"
                                        />
                                    ) : (
                                        <>
                                            <Send className="w-3.5 h-3.5" />
                                            儲存
                                        </>
                                    )}
                                </motion.button>
                            </div>

                            {/* Keyboard shortcut hint */}
                            <p className="text-center text-xs text-zen-300 mt-3">
                                按 <kbd className="px-1.5 py-0.5 rounded bg-zen-100 text-zen-500 font-mono text-[10px]">Ctrl</kbd>+<kbd className="px-1.5 py-0.5 rounded bg-zen-100 text-zen-500 font-mono text-[10px]">Enter</kbd> 快速儲存
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
