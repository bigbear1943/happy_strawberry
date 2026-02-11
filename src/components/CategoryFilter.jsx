import { motion, AnimatePresence } from 'framer-motion'
import { Filter, ToggleLeft, ToggleRight, CheckCircle2, Circle } from 'lucide-react'

const modeLabels = {
    single: '單選',
    multi: '複選',
}

export default function CategoryFilter({
    categories = [],
    selected = [],
    onChange,
    mode = 'single',
    onModeChange,
}) {
    if (categories.length === 0) return null

    const isSelected = (cat) => selected.includes(cat)

    const handleClick = (cat) => {
        if (mode === 'single') {
            // Single select: toggle off if already selected, otherwise select this one
            onChange(isSelected(cat) ? [] : [cat])
        } else {
            // Multi select: toggle individual category
            if (isSelected(cat)) {
                onChange(selected.filter((c) => c !== cat))
            } else {
                onChange([...selected, cat])
            }
        }
    }

    const handleToggleMode = () => {
        const newMode = mode === 'single' ? 'multi' : 'single'
        // When switching to single mode, keep only the first selected category
        if (newMode === 'single' && selected.length > 1) {
            onChange([selected[0]])
        }
        onModeChange(newMode)
    }

    const handleSelectAll = () => {
        if (selected.length === categories.length) {
            onChange([])
        } else {
            onChange([...categories])
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="w-full max-w-lg mx-auto"
        >
            {/* Header: label + mode toggle */}
            <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-zen-400" />
                    <span className="text-xs text-zen-500 font-medium tracking-wider">
                        分類篩選
                    </span>
                    {selected.length > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full
                         bg-sage-500 text-white leading-none"
                        >
                            {selected.length}
                        </motion.span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Select all (multi mode only) */}
                    {mode === 'multi' && (
                        <motion.button
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSelectAll}
                            className="text-[10px] text-zen-400 hover:text-sage-600 
                         transition-colors cursor-pointer tracking-wider"
                        >
                            {selected.length === categories.length ? '全不選' : '全選'}
                        </motion.button>
                    )}

                    {/* Mode toggle */}
                    <button
                        onClick={handleToggleMode}
                        className="flex items-center gap-1 px-2 py-1 rounded-full
                       zen-glass text-xs text-zen-500 hover:text-zen-700
                       transition-colors cursor-pointer"
                    >
                        {mode === 'single' ? (
                            <ToggleLeft className="w-3.5 h-3.5" />
                        ) : (
                            <ToggleRight className="w-3.5 h-3.5 text-sage-500" />
                        )}
                        <span className="font-medium">{modeLabels[mode]}</span>
                    </button>
                </div>
            </div>

            {/* Category chips */}
            <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                    {categories.map((cat, i) => {
                        const active = isSelected(cat)
                        return (
                            <motion.button
                                key={cat}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2, delay: i * 0.03 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.93 }}
                                onClick={() => handleClick(cat)}
                                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                  transition-all duration-200 cursor-pointer border
                  ${active
                                        ? 'bg-sage-500 text-white border-sage-500 shadow-sm shadow-sage-500/20'
                                        : 'zen-glass text-zen-500 border-transparent hover:text-zen-700 hover:border-zen-200'
                                    }
                `}
                            >
                                {mode === 'multi' && (
                                    active
                                        ? <CheckCircle2 className="w-3 h-3" />
                                        : <Circle className="w-3 h-3 opacity-40" />
                                )}
                                {cat}
                            </motion.button>
                        )
                    })}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
