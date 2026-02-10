import { motion } from 'framer-motion'
import { CloudOff, RefreshCw } from 'lucide-react'

export default function ErrorMessage({ message, onRetry }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-4 py-16 text-center"
        >
            <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
                <CloudOff className="w-12 h-12 text-zen-300" strokeWidth={1.5} />
            </motion.div>

            <div className="space-y-2">
                <p className="text-zen-500 text-lg font-light">
                    {message || '膠囊目前處於離線狀態'}
                </p>
                <p className="text-zen-400 text-sm">
                    你的靈感安全地保存在雲端
                </p>
            </div>

            {onRetry && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onRetry}
                    className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-full
                     bg-zen-100 text-zen-600 text-sm font-medium
                     hover:bg-zen-200 transition-colors cursor-pointer"
                >
                    <RefreshCw className="w-4 h-4" />
                    重新嘗試
                </motion.button>
            )}
        </motion.div>
    )
}
