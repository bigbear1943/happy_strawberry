import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Send } from 'lucide-react'

function previewCategory(text) {
    const trimmed = text.trim()
    if (!trimmed) return null
    const charCount = trimmed.length
    if (trimmed.startsWith('http') || trimmed.includes('://')) return '連結'
    if (trimmed.includes('TODO') || trimmed.includes('todo') || trimmed.includes('待辦')) return '待辦'
    if (charCount <= 20) return '語錄'
    if (charCount <= 60) return '想法'
    return '筆記'
}

export default function MagicInput({ isOpen, onClose, onSubmit, isSubmitting }) {
    const [content, setContent] = useState('')
    const category = previewCategory(content)

    const handleSubmit = async () => {
        if (!content.trim() || isSubmitting) return
        await onSubmit(content.trim())
        setContent('')
        onClose()
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSubmit()
        }
    }

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

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-4 relative">
                                {/* Auto-tag preview */}
                                <AnimatePresence mode="wait">
                                    {category && (
                                        <motion.div
                                            key={category}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -8 }}
                                            className="flex items-center gap-1.5 text-xs text-zen-400"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-sage-400" />
                                            自動標記為 <span className="font-medium text-zen-600">{category}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

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
