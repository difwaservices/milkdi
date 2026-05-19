"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, RefreshCcw, Wifi, Database, Info, AlertTriangle, Play, Pause, Power, Terminal } from 'lucide-react';
import WaterTank from '@/components/retailer/smart-tank/WaterTank';
import useTankStore from '@/data/store/useTankStore';
import { toast } from 'sonner';

const SmartTankPage = () => {
    const {
        tankLevel,
        isPumpOn,
        isAutoMode,
        isConnecting,
        deviceConfig,
        logs,
        initSocket,
        togglePump,
        toggleAutoMode
    } = useTankStore();

    useEffect(() => {
        initSocket();
    }, [initSocket]);

    const handleTogglePump = (status?: boolean) => {
        const newStatus = status !== undefined ? status : !isPumpOn;
        togglePump(newStatus);
        toast.info(`Manual Override: Pump ${newStatus ? 'Started' : 'Stopped'}`);
    };

    const handleToggleAutoMode = () => {
        toggleAutoMode();
        toast.success(`Automation Mode: ${!isAutoMode ? 'ENABLED' : 'DISABLED'}`);
    };

    return (
        <div className="relative p-4 sm:p-6 md:p-10 bg-slate-50 min-h-screen overflow-hidden">
            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-100/10 backdrop-blur-[1px] pointer-events-auto">
                <div className="flex flex-col items-center gap-6 text-center p-8 bg-white/90 border border-white rounded-[3rem] shadow-2xl shadow-slate-900/10 backdrop-blur-md transform -rotate-1">
                    <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/40">
                        <Cpu className="text-white w-10 h-10 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-[0.2em]">Coming Soon</h1>
                        <p className="text-slate-500 font-medium max-w-[280px] text-sm leading-relaxed">
                            Hardware synchronization in progress. Smart Tank Link will be live shortly.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                        Live Bridge Setup
                    </div>
                </div>
            </div>

            <div className="blur-[1.5px] opacity-80 pointer-events-none select-none transition-all duration-1000">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 uppercase tracking-tighter">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-2 bg-blue-600 rounded-xl shadow-sm shrink-0">
                                <Cpu className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-tighter">Smart Tank Link</h1>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-md font-medium normal-case tracking-normal">Real-time hardware bridge for automated water storage and distribution.</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm transition-all duration-300">
                        <div className="text-right">
                            <div className="text-xs text-text-muted font-medium">Device Status</div>
                            <div className={`text-sm font-semibold ${isConnecting ? 'text-orange-500' : 'text-emerald-600'}`}>
                                {isConnecting ? 'Reconnecting...' : 'Synchronized'}
                            </div>
                        </div>
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors duration-500 shrink-0 ${isConnecting ? 'bg-orange-50' : 'bg-emerald-50'}`}>
                            <Wifi className={`${isConnecting ? 'text-orange-500' : 'text-emerald-600'} ${isConnecting ? 'animate-bounce' : 'animate-pulse'} w-5 h-5 sm:w-6 sm:h-6`} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                    {/* Main Visualization */}
                    <div className="lg:col-span-4 self-center w-full flex justify-center">
                        <WaterTank
                            level={tankLevel}
                            isPumpOn={isPumpOn}
                            onTogglePump={() => handleTogglePump()}
                            temp={22.8}
                            quality="Optimal"
                        />
                    </div>

                    {/* Control and Config Panels */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        {/* Automation Control */}
                        <div className="p-5 sm:p-8 bg-blue-50 rounded-2xl sm:rounded-xl border border-blue-100 flex flex-col justify-between gap-6 sm:gap-8 h-full shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="space-y-3 sm:space-y-4">
                                <div className="p-2.5 sm:p-3 bg-blue-600 rounded-2xl w-fit shadow-sm">
                                    <RefreshCcw className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <h2 className="text-lg font-semibold text-foreground italic italic-no">Automation Engine</h2>
                                <p className="text-slate-600 text-xs sm:text-sm font-medium">AI-driven cycle: Refills below 20% and stops automatically at 95% volume.</p>
                            </div>

                            <button
                                onClick={handleToggleAutoMode}
                                className={`group flex items-center justify-between p-4 sm:p-6 rounded-2xl transition-all duration-500 ${isAutoMode ? 'bg-blue-600 shadow-sm' : 'bg-white border border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                <span className={`text-sm font-semibold ${isAutoMode ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                    {isAutoMode ? 'Smart-Auto Active' : 'Manual Control Only'}
                                </span>
                                {isAutoMode ? <Play className="text-white animate-pulse w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="white" /> : <Pause className="text-slate-300 group-hover:text-slate-400 w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
                            </button>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <StatsCard label="Last Pulse" value={deviceConfig.lastSeen} icon={<RefreshCcw size={16} />} color="text-sky-400" />
                            <StatsCard label="Signal Strength" value={`${deviceConfig.signal} dBm`} icon={<Wifi size={16} />} color="text-amber-400" />
                            <StatsCard label="Pump Utilization" value="12.4h / Month" icon={<Power size={16} />} color="text-purple-400" />
                            <StatsCard label="Estimated Outflow" value="450L / Day" icon={<Database size={16} />} color="text-indigo-400" />
                        </div>

                        {/* Device Metadata */}
                        <div className="p-5 sm:p-8 bg-white rounded-2xl sm:rounded-xl border border-slate-200 space-y-4 sm:space-y-6 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-2 sm:gap-3 text-slate-400">
                                <Terminal size={16} className="sm:w-[18px] sm:h-[18px]" />
                                <h3 className="text-xs sm:text-sm font-semibold">Hardware Identity</h3>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                <MetadataRow label="Asset ID" value={deviceConfig.id} />
                                <MetadataRow label="Build Version" value={deviceConfig.model} />
                                <MetadataRow label="MAC Address" value={deviceConfig.mac} />
                                <MetadataRow label="Firmware" value="milkdi-core-v1.2.0" />
                            </div>
                        </div>

                        {/* Debug Console / Logs */}
                        <div className="p-5 sm:p-8 bg-slate-900 rounded-2xl sm:rounded-xl relative overflow-hidden flex flex-col gap-3 sm:gap-4 shadow-xl border border-slate-800">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2 sm:gap-3 text-slate-500">
                                    <Info size={16} className="sm:w-[18px] sm:h-[18px]" />
                                    <h3 className="text-xs sm:text-sm font-semibold truncate">Operational Insights</h3>
                                </div>
                                <div className="w-fit px-2 py-1 bg-amber-500/20 text-amber-500 text-[9px] sm:text-[10px] uppercase font-bold rounded-md flex items-center gap-1 border border-amber-500/30">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping shrink-0" /> Live Data Feed
                                </div>
                            </div>

                            <div className="space-y-2 sm:space-y-3 font-mono text-[9px] sm:text-[10px] max-h-[140px] sm:max-h-[160px] overflow-y-auto scrollbar-hide">
                                <AnimatePresence mode="popLayout">
                                    {logs.map((log: any, i: number) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                        >
                                            <LogEntry time={log.time} msg={log.msg} type={log.type} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatsCard = ({ label, value, icon, color }: any) => (
    <div className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-xl border border-slate-200 flex flex-col gap-2 sm:gap-3 shadow-sm hover:shadow-md transition-all duration-300 min-w-0">
        <div className={`p-2 bg-slate-50 rounded-xl w-fit ${color}`}>{icon}</div>
        <div className="min-w-0">
            <div className="text-xs text-text-muted font-medium truncate">{label}</div>
            <div className="text-base sm:text-xl font-bold text-slate-900 tracking-tight truncate">{value}</div>
        </div>
    </div>
);

const MetadataRow = ({ label, value }: any) => (
    <div className="flex items-center justify-between py-1 group gap-2">
        <span className="text-slate-400 text-[11px] sm:text-xs font-medium uppercase tracking-tighter group-hover:text-slate-500 transition-colors shrink-0">{label}</span>
        <span className="text-slate-700 text-xs sm:text-sm font-bold font-mono group-hover:text-blue-600 transition-colors truncate text-right">{value}</span>
    </div>
);

const LogEntry = ({ time, msg, type }: any) => (
    <div className="flex items-start gap-2 sm:gap-4">
        <span className="text-slate-600 shrink-0 tabular-nums">{time}</span>
        <span className={`italic-no break-words leading-tight ${type === 'system' ? 'text-blue-400' : type === 'data' ? 'text-emerald-400' : 'text-slate-500'}`}>
            {msg}
        </span>
    </div>
);

export default SmartTankPage;
