import { motion } from 'framer-motion'

export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center gap-6 py-16">
            {/* Breathing circles */}
            <div className="relative w-16 h-16">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border-2 border-sage-400/40"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: [0.8, 1.4, 0.8],
                            opacity: [0.6, 0, 0.6],
                        }}
                        transition={{
                            duration: 2.4,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
                <motion.div
                    className="absolute inset-3 rounded-full bg-gradient-to-br from-sage-400 to-sage-500"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </div>

            <motion.p
                className="text-zen-400 text-sm tracking-widest"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
                靜心載入中...
            </motion.p>
        </div>
    )
}
