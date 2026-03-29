import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', danger = true }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="default">
        <p className="font-ui text-sm text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
            {message}
        </p>
        <div className="flex gap-3">
            <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 font-ui font-medium rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-sm"
            >
                Cancel
            </button>
            <button
                type="button"
                onClick={() => { onConfirm(); onClose(); }}
                className={`flex-1 py-2.5 font-ui font-semibold rounded-xl transition-colors text-sm text-white ${danger
                    ? 'bg-red-500 hover:bg-red-600 active:bg-red-700'
                    : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700'
                    }`}
            >
                {confirmLabel}
            </button>
        </div>
    </Modal>
);

export default ConfirmDialog;