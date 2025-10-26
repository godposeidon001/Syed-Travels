import { toast } from 'sonner';

/**
 * Show a success toast
 * @param {string} message
 * @param {number} duration in ms (default 3000)
 */
export const showSuccess = (message, duration = 3000) => {
  toast.success(message, { duration });
};

/**
 * Show an error toast
 * @param {string} message
 * @param {number} duration in ms (default 3000)
 */
export const showError = (message, duration = 3000) => {
  toast.error(message, { duration });
};

/**
 * Show an info toast
 * @param {string} message
 * @param {number} duration in ms (default 3000)
 */
export const showInfo = (message, duration = 3000) => {
  toast(message, { duration });
};

/**
 * Dismiss all toasts
 */
export const clearToasts = () => {
  toast.dismiss();
};
