import React, { useMemo, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, CartesianGrid
} from 'recharts';
import { Activity, CheckCircle, AlertTriangle, Menu, Calendar, Filter } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#3b82f6'];

export default function Dashboard({ rawData }) {
    const [filterLine, setFilterLine] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    // Aggregation
    const {
        filteredData,
        totalIncidents,
        byLine,
        byStatus,
        byCategory,
        byDate,
        efficiency
    } = useMemo(() => {
        let data = rawData;
        if (filterLine !== 'All') data = data.filter(d => d.line === filterLine);
        if (filterStatus !== 'All') data = data.filter(d => d.status === filterStatus);

        // Aggregates
        const lines = {};
        const statuses = {};
        const categories = {};
        const dates = {};

        let attended = 0;

        data.forEach(item => {
            // Line
            const l = item.line || 'Sin Línea';
            lines[l] = (lines[l] || 0) + 1;

            // Status
            const s = item.status || 'Desconocido';
            statuses[s] = (statuses[s] || 0) + 1;
            if (s.toUpperCase() === 'ATENDIDO' || s.toUpperCase() === 'ENTREGADO') attended++;

            // Category
            const c = item.category || 'Otros';
            categories[c] = (categories[c] || 0) + 1;

            // Date
            const d = item.date ? item.date.substring(0, 10) : 'Sin Fecha';
            if (d !== 'Sin Fecha') dates[d] = (dates[d] || 0) + 1;
        });

        const byLineArr = Object.entries(lines).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
        const byStatusArr = Object.entries(statuses).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
        const byCategoryArr = Object.entries(categories).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
        const byDateArr = Object.entries(dates).map(([name, value]) => ({ name, value })).sort((a, b) => new Date(a.name) - new Date(b.name));

        const eff = data.length > 0 ? ((attended / data.length) * 100).toFixed(1) : 0;

        return {
            filteredData: data,
            totalIncidents: data.length,
            byLine: byLineArr,
            byStatus: byStatusArr,
            byCategory: byCategoryArr,
            byDate: byDateArr,
            efficiency: eff
        };
    }, [rawData, filterLine, filterStatus]);

    // Unique Lines for Filter
    const uniqueLines = useMemo(() => {
        const s = new Set(rawData.map(d => d.line).filter(Boolean));
        return ['All', ...Array.from(s).sort()];
    }, [rawData]);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        Metrobús Analytics
                    </h1>
                    <p className="text-slate-400">Panel de Control de Incidencias y Reportes</p>
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <Filter size={16} className="text-slate-400" />
                        <select
                            className="bg-transparent text-slate-200 outline-none text-sm"
                            value={filterLine}
                            onChange={(e) => setFilterLine(e.target.value)}
                        >
                            {uniqueLines.map(l => <option key={l} value={l}>Línea: {l}</option>)}
                        </select>
                    </div>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KpiCard title="Total Reportes" value={totalIncidents} icon={Activity} color="text-blue-500" />
                <KpiCard title="Eficiencia" value={`${efficiency}%`} sub="Casos Atendidos" icon={CheckCircle} color="text-emerald-500" />
                <KpiCard title="Categoría Principal" value={byCategory[0]?.name || '-'} sub={`${byCategory[0]?.value || 0} reportes`} icon={Menu} color="text-purple-500" />
                <KpiCard title="Registros Hoy" value={byDate[byDate.length - 1]?.value || 0} icon={Calendar} color="text-emerald-500" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Tendencia de Reportes (Cronológico)">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={byDate}>
                            <defs>
                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickFormatter={tick => tick.substring(5)} minTickGap={30} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                                itemStyle={{ color: '#93c5fd' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVal)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Incidencias por Línea">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={byLine} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                            <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                            <YAxis dataKey="name" type="category" width={80} stroke="#94a3b8" fontSize={12} />
                            <Tooltip cursor={{ fill: '#334155' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                            <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartCard title="Estatus de Reportes" className="lg:col-span-1">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={byStatus}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {byStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {byStatus.slice(0, 5).map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-1 text-xs text-slate-400">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </ChartCard>

                <ChartCard title="Top 5 Categorías" className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={byCategory}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip cursor={{ fill: '#334155' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <div className="p-4 border-b border-slate-800 font-semibold text-lg">Reportes Recientes</div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-200 uppercase bg-slate-950/50">
                            <tr>
                                <th className="px-6 py-3">Fecha</th>
                                <th className="px-6 py-3">Folio</th>
                                <th className="px-6 py-3">Línea</th>
                                <th className="px-6 py-3">Categoría</th>
                                <th className="px-6 py-3">Estatus</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.slice(0, 10).map((item, i) => (
                                <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">{item.date?.substring(0, 10)}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-blue-400">{item.folio || '-'}</td>
                                    <td className="px-6 py-4">{item.line}</td>
                                    <td className="px-6 py-4">{item.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={clsx(
                                            "px-2 py-1 rounded-full text-xs font-medium",
                                            item.status === 'ATENDIDO' || item.status === 'ENTREGADO' ? "bg-emerald-500/10 text-emerald-400" :
                                                item.status?.includes('PROCESO') ? "bg-amber-500/10 text-amber-400" :
                                                    "bg-slate-700 text-slate-300"
                                        )}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function KpiCard({ title, value, sub, icon: Icon, color }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg relative overflow-hidden"
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
                    {sub && <p className="text-slate-500 text-sm mt-1">{sub}</p>}
                </div>
                <div className={`p-3 rounded-lg bg-slate-800/50 ${color}`}>
                    <Icon size={24} />
                </div>
            </div>
        </motion.div>
    )
}

function ChartCard({ title, children, className }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={clsx("bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg", className)}
        >
            <h3 className="text-lg font-semibold text-slate-200 mb-6">{title}</h3>
            {children}
        </motion.div>
    )
}
