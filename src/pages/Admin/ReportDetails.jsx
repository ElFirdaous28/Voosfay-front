import React, { useEffect, useRef, useState } from 'react';
import Layout from '../Layout';
import {
  ShieldAlert, AlertCircle, Ban, Clock, Calendar, User, Mail, Phone, Info, Trash2
} from 'lucide-react';
import api from '../../Services/api';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useConfirmation } from '../../context/ConfirmationDialogContext';
import { userService } from '../../Services/userService';

const ActionButton = ({ onClick, color, Icon, text, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${color} ${disabled ? 'opacity-50 cursor-not-allowed' : `hover:${color.replace('500', '600')}`} text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer`}
  >
    <Icon className="w-4 h-4" />
    {text}
  </button>
);

export default function ReportDetails() {
  const { id } = useParams();
  const { openDialog } = useConfirmation();
  const [report, setReport] = useState();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchReport = async () => {
    try {
      const response = await api.get(`v1/reports/${parseInt(id)}`);
      setReport(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching report details:", error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  const isResolved = report?.status === 'resolved';
  const userStatus = report?.reported_user?.status;
  const isActionable = !isResolved && !['banned', 'deleted'].includes(userStatus);

  const handleDelete = () => {
    if (!report) return;
    openDialog({
      title: 'Delete user',
      message: 'Are you sure you want to delete this user?',
      actionType: 'delete',
      confirmText: 'Delete'
    }, async () => {
      setActionLoading(true);
      const success = await userService.delete(report.reported_user.id);
      if (success) {
        const reportResolved = await userService.resolveReport(report.id);
        if (reportResolved) {
          toast.success('User deleted and report resolved');
          navigate('/admin/reports');
        } else {
          toast.error('Failed to resolve report');
        }
      } else {
        toast.error('Failed to delete user');
      }
      setActionLoading(false);
    });
  };

  const handleBan = () => {
    if (!report) return;
    openDialog({
      title: 'Ban user',
      message: 'Are you sure you want to ban this user?',
      actionType: 'ban',
      confirmText: 'Ban'
    }, async () => {
      setActionLoading(true);
      const success = await userService.changeStatus(report.reported_user.id, { status: 'banned' });
      if (success) {
        const reportResolved = await userService.resolveReport(report.id);
        if (reportResolved) {
          toast.success('User banned and report resolved');
          navigate('/admin/reports');
        } else {
          toast.error('Failed to resolve report');
        }
      } else {
        toast.error('Failed to ban user');
      }
      setActionLoading(false);
    });
  };

  const handleWarn = () => {
    if (!report) return;
    openDialog({
      title: 'Warn user',
      message: 'Are you sure you want to send a warning to this user?',
      actionType: 'warn',
      confirmText: 'Send Warning'
    }, async () => {
      setActionLoading(true);
      const warnSuccess = await userService.warn(report.reported_user.id);
      const activateSuccess = await userService.changeStatus(report.reported_user.id, { status: 'active' });

      if (warnSuccess && activateSuccess) {
        const reportResolved = await userService.resolveReport(report.id);
        if (reportResolved) {
          toast.success('User warned, activated, and report resolved');
          navigate('/admin/reports');
        } else {
          toast.error('Failed to resolve report');
        }
      } else {
        toast.error('Failed to warn or activate user');
      }
      setActionLoading(false);
    });
  };

  const handleSuspend = (days) => {
    if (!report) return;
    setActiveDropdown(false);
    openDialog({
      title: 'Suspend user',
      message: `Are you sure you want to suspend this user for ${days} ${days === 1 ? 'day' : 'days'}?`,
      actionType: 'suspend',
      confirmText: 'Suspend'
    }, async () => {
      setActionLoading(true);
      const success = await userService.changeStatus(report.reported_user.id, {
        status: 'suspended',
        suspend_duration: days
      });

      if (success) {
        const reportResolved = await userService.resolveReport(report.id);
        if (reportResolved) {
          toast.success('User suspended and report resolved');
          navigate('/admin/reports');
        } else {
          toast.error('Failed to resolve report');
        }
      } else {
        toast.error('Failed to suspend user');
      }
      setActionLoading(false);
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-500', text: 'Pending Review' },
      'resolved': { color: 'bg-green-500', text: 'Resolved' },
    };

    const config = statusConfig[status] || { color: 'bg-gray-500', text: status };

    return (
      <span className={`${config.color} text-white text-xs px-3 py-1 rounded-full font-medium uppercase`}>
        {config.text}
      </span>
    );
  };

  if (loading) return (<Layout title={"Report Details"}><Spinner /></Layout>);

  return (
    <Layout title={"Report Details"}>
      {actionLoading && (
        <div className="flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div className="w-full bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl shadow-xl overflow-hidden">
        <div className="bg-green-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <ShieldAlert className="mr-2" />
            Report #{report.id}
          </h2>
          <div className="flex items-center gap-4">
            {getStatusBadge(report.status)}
          </div>
        </div>

        <div className="p-6 space-y-8 text-white">
          {/* Date Info */}
          <div className="flex flex-wrap gap-6 text-sm bg-zinc-800/50 p-4 rounded-lg">
            <div className="flex items-center">
              <Calendar className="mr-2 text-gray-400" size={16} />
              <span className="text-gray-400 mr-2">Created:</span>
              <span>{format(new Date(report.created_at), "PPP 'at' p")}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 text-gray-400" size={16} />
              <span className="text-gray-400 mr-2">Updated:</span>
              <span>{format(new Date(report.updated_at), "PPP 'at' p")}</span>
            </div>
          </div>

          {/* Reporter and Reported */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Reporter */}
            <div className="bg-zinc-800/70 rounded-lg p-5 border-l-4 border-blue-500">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <User className="mr-2 text-blue-400" size={18} />
                Reporter
              </h3>
              <div className="space-y-3 pl-2">
                <div className="flex items-center"><span className="text-gray-400 w-20">Name:</span><span className="font-medium">{report.reporter.name}</span></div>
                <div className="flex items-center"><span className="text-gray-400 w-20">Email:</span><span>{report.reporter.email}</span></div>
                <div className="flex items-center"><span className="text-gray-400 w-20">Status:</span><span className={`px-2 py-1 rounded text-xs ${report.reporter.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{report.reporter.status}</span></div>
              </div>
            </div>

            {/* Reported */}
            <div className="bg-zinc-800/70 rounded-lg p-5 border-l-4 border-red-500">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <User className="mr-2 text-red-400" size={18} />
                Reported User
              </h3>
              <div className="space-y-3 pl-2">
                <div className="flex items-center"><span className="text-gray-400 w-20">Name:</span><span className="font-medium">{report.reported_user.name}</span></div>
                <div className="flex items-center"><span className="text-gray-400 w-20">Email:</span><span>{report.reported_user.email}</span></div>
                <div className="flex items-center"><span className="text-gray-400 w-20">Phone:</span><span>{report.reported_user.phone || 'Not provided'}</span></div>
                <div className="flex items-center"><span className="text-gray-400 w-20">Gender:</span><span>{report.reported_user.gender || 'Not specified'}</span></div>
                <div className="flex items-center"><span className="text-gray-400 w-20">Reports:</span><span className={`font-medium ${report.reported_user.reports_against_count > 1 ? 'text-red-400' : 'text-gray-300'}`}>{report.reported_user.reports_against_count || 0}</span></div>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Info className="mr-2 text-amber-400" size={18} />
              Report Reason
            </h3>
            <div className="bg-zinc-700/60 p-5 rounded-lg text-gray-200 whitespace-pre-wrap max-h-60 overflow-y-auto border border-zinc-600">
              {report.reason}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <ActionButton onClick={handleWarn} color="bg-yellow-500" Icon={AlertCircle} text="Warn" disabled={!isActionable} />
            <div className="relative" ref={dropdownRef}>
              <ActionButton
                onClick={() => setActiveDropdown(!activeDropdown)}
                color="bg-blue-500"
                Icon={Clock}
                text="Suspend"
                disabled={!isActionable}
              />
              {activeDropdown && (
                <div className="absolute left-0 -top-40 mt-2 bg-zinc-600 border border-zinc-800 rounded shadow z-10">
                  {[1, 3, 7].map((day) => (
                    <button
                      key={day}
                      onClick={() => handleSuspend(day)}
                      className="block w-full text-left px-4 py-2 hover:bg-zinc-700 text-white text-sm"
                    >
                      {day} day{day > 1 && 's'}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <ActionButton onClick={handleBan} color="bg-red-500" Icon={Ban} text="Ban" disabled={!isActionable} />
            <ActionButton onClick={handleDelete} color="bg-gray-600" Icon={Trash2} text="Delete" disabled={isResolved} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
