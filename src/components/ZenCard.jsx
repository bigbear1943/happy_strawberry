import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Lightbulb, Link2, ListTodo, StickyNote, Trash2 } from 'lucide-react'

const categoryConfig = {
    Quote: { icon: Quote, color: 'text-amber-600', bg: 'bg-amber-50' },
    Thought: { icon: Lightbulb, color: 'text-purple-600', bg: 'bg-purple-50' },
    Link: { icon: Link2, color: 'text-blue-600', bg: 'bg-blue-50' },
    Task: { icon: ListTodo, color: 'text-rose-600', bg: 'bg-rose-50' },
    Note: { icon: StickyNote, color: 'text-sage-600', bg: 'bg-sage-400/10' },
    General: { icon: StickyNote, color: 'text-zen-600', bg: 'bg-zen-100' },
}

function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export default function ZenCard({ inspiration, onDelete }) {
    if (!inspiration) return null

    const config = categoryConfig[inspiration.category] || categoryConfig.General
    const Icon = config.icon

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={inspiration.id}
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.97 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-lg mx-auto"
            >
                <div className="zen-glass-strong rounded-3xl p-8 relative overflow-hidden">
                    {/* Decorative corner gradient */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sage-400/10 to-transparent rounded-bl-full" />

                    {/* Category badge */}
                    <div className="flex items-center justify-between mb-6 relative">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg}`}>
                            <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                            <span className={`text-xs font-medium ${config.color}`}>
                                {inspiration.category}
                            </span>
                        </div>

                        {onDelete && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onDelete(inspiration.id)}
                                className="p-2 rounded-full text-zen-300 hover:text-rose-400 
                           hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </motion.button>
                        )}
                    </div>

                    {/* Content */}
                    <p className="text-zen-800 text-xl leading-relaxed font-light tracking-wide relative">
                        {inspiration.content}
                    </p>

                    {/* Date */}
                    <div className="mt-8 pt-4 border-t border-zen-200/50">
                        <p className="text-zen-400 text-xs tracking-wider">
                            {formatDate(inspiration.created_at)}
                        </p>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
