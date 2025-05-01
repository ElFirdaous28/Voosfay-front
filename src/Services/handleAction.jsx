import { toast } from 'react-toastify';
import { userService } from './userService';

const handleAction = async (actionType, userId, suspendDuration, openDialog, fetchData) => {
    const actionConfig = {
        delete: {
            title: 'Delete user',
            message: 'Are you sure you want to delete this user?',
            confirmText: 'Delete',
            action: async () => {
                const success = await userService.delete(userId);
                if (success) {
                    toast.success('User deleted');
                    fetchData();
                } else {
                    toast.error('Failed to delete user');
                }
            }
        },
        ban: {
            title: 'Ban user',
            message: 'Are you sure you want to ban this user?',
            confirmText: 'Ban',
            action: async () => {
                const success = await userService.changeStatus(userId, { status: 'banned' });
                if (success) {
                    toast.success('User banned');
                    fetchData();
                } else {
                    toast.error('Failed to ban user');
                }
            }
        },
        activate: {
            title: 'Activate user',
            message: 'Are you sure you want to activate this user?',
            confirmText: 'Activate',
            action: async () => {
                const success = await userService.changeStatus(userId, { status: 'active' });
                if (success) {
                    toast.success('User activated');
                    fetchData();
                } else {
                    toast.error('Failed to activate user');
                }
            }
        },
        suspend: {
            title: 'Suspend user',
            message: 'Are you sure you want to suspend this user?',
            confirmText: 'Suspend',
            action: async () => {
                const success = await userService.changeStatus(userId, { status: 'suspended', suspend_duration: suspendDuration });
                if (success) {
                    toast.success('User suspended');
                    fetchData();
                } else {
                    toast.error('Failed to suspend user');
                }
            }
        }
    };

    const action = actionConfig[actionType];
    if (action) {
        openDialog({
            title: action.title,
            message: action.message,
            actionType,
            confirmText: action.confirmText
        }, action.action);
    }
};

export default handleAction;
