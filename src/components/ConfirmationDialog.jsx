import { AlertTriangle, ArchiveIcon, Ban, LogOut, Trash2, X, Clock } from 'lucide-react';
import React, { useState } from 'react';

export default function ConfirmationDialog({
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isOpen = false,
    actionType = "warning",
    customIcon = null,
    suspendDuration,
    setSuspendDuration
}) {

    if (!isOpen) return null;

    const colorSchemes = {
        activate: {
            bg: "bg-green-500/10",
            border: "border-green-500/30",
            iconBg: "bg-green-500/20",
            iconColor: "text-green-400",
            buttonBg: "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400"
        },
        delete: {
            bg: "bg-red-500/10",
            border: "border-red-500/30",
            iconBg: "bg-red-500/20",
            iconColor: "text-red-400",
            buttonBg: "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400"
        },
        ban: {
            bg: "bg-red-500/10",
            border: "border-red-500/30",
            iconBg: "bg-red-500/20",
            iconColor: "text-red-400",
            buttonBg: "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400"
        },
        suspend: {
            bg: "bg-yellow-500/10",
            border: "border-yellow-500/30",
            iconBg: "bg-yellow-500/20",
            iconColor: "text-yellow-400",
            buttonBg: "bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400"
        }
    };

    const colors = colorSchemes[actionType] || colorSchemes.warning;

    const getIcon = () => {
        if (customIcon) {
            return React.cloneElement(customIcon, {
                size: 28,
                className: colors.iconColor
            });
        }

        switch (actionType) {
            case 'delete':
                return <Trash2 size={28} className={colors.iconColor} />;
            case 'Ban':
                return <Ban size={28} className={colors.iconColor} />;
            case 'logout':
                return <LogOut size={28} className={colors.iconColor} />;
            case 'archive':
                return <ArchiveIcon size={28} className={colors.iconColor} />;
            case 'remove':
                return <X size={28} className={colors.iconColor} />;
            case 'suspended':
                return <Clock size={28} className={colors.iconColor} />;
            case 'warning':
            default:
                return <AlertTriangle size={28} className={colors.iconColor} />;
        }
    };

    const handleConfirm = () => {
        if (actionType === 'suspended') {
            onConfirm(suspendDuration);
        } else {
            onConfirm();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-xl bg-black">
                <div className={`${colors.bg} ${colors.border} rounded-xl shadow-2xl border overflow-hidden animate-fade-in-down`}>
                    <div className="flex items-center p-5">
                        <div className={`${colors.iconBg} p-3 rounded-full mr-4`}>
                            {getIcon()}
                        </div>
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                    </div>

                    <div className="p-5 pt-2 pb-4">
                        <p className="text-gray-300">{message}</p>
                    </div>
                    {actionType === 'suspend' && (
                        <div className="px-5 pb-4">
                            <label className="block text-sm font-medium text-white mb-1">Suspend Duration</label>
                            <select
                                name="suspend_duration"
                                value={suspendDuration}
                                onChange={(e) => setSuspendDuration(parseInt(e.target.value))}
                                className="w-full px-3 py-2 bg-zinc-800 text-white rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500">
                                <option value={1}>1 Day</option>
                                <option value={3}>3 Days</option>
                                <option value={7}>1 Week</option>
                                <option value={30}>1 Month</option>
                                <option value={9999}>Forever</option>
                            </select>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 p-4 pt-0">
                        <button
                            onClick={onCancel}
                            className="px-5 py-2 bg-zinc-700 text-gray-300 rounded-lg hover:bg-zinc-600 hover:text-white transition-colors">
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`px-5 py-2 ${colors.buttonBg} text-white rounded-lg transition-all shadow-lg font-medium`}>
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}