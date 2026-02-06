'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
    Shield, 
    Search,
    CheckCircle,
    XCircle,
    User,
    Calendar,
    Activity,
    AlertTriangle,
    RefreshCw
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '@/lib/utils'

type AuditLog = Database['public']['Tables']['audit_logs']['Row']

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<'all' | 'success' | 'failed'>('all')
    const [filterResource, setFilterResource] = useState<string>('all')

    useEffect(() => {
        fetchLogs()
    }, [])

    useEffect(() => {
        filterLogs()
    }, [logs, searchQuery, filterType, filterResource])

    const fetchLogs = async () => {
        try {
            setLoading(true)
            const supabase = createClient()
            const { data, error } = await supabase
                .from('audit_logs')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(200)

            if (error) throw error
            setLogs(data || [])
        } catch (error) {
            console.error('Error fetching audit logs:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterLogs = () => {
        let filtered = [...logs]

        // Filter by success/failed
        if (filterType === 'success') {
            filtered = filtered.filter(log => log.success)
        } else if (filterType === 'failed') {
            filtered = filtered.filter(log => !log.success)
        }

        // Filter by resource
        if (filterResource !== 'all') {
            filtered = filtered.filter(log => log.resource === filterResource)
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(log => 
                log.event_type.toLowerCase().includes(query) ||
                log.user_email?.toLowerCase().includes(query) ||
                log.resource?.toLowerCase().includes(query) ||
                log.action?.toLowerCase().includes(query)
            )
        }

        setFilteredLogs(filtered)
    }

    const getEventBadge = (eventType: string) => {
        const colors: Record<string, string> = {
            'LOGIN_SUCCESS': 'bg-green-100 text-green-700',
            'LOGIN_FAILED': 'bg-red-100 text-red-700',
            'LOGOUT': 'bg-gray-100 text-gray-700',
            'DATA_MODIFICATION': 'bg-blue-100 text-blue-700',
            'DATA_ACCESS': 'bg-purple-100 text-purple-700',
            'UNAUTHORIZED_ACCESS': 'bg-red-100 text-red-700',
            'RATE_LIMIT_EXCEEDED': 'bg-yellow-100 text-yellow-700',
        }
        
        return colors[eventType] || 'bg-gray-100 text-gray-700'
    }

    const getResourceIcon = (resource: string | null) => {
        if (!resource) return Activity
        if (resource.includes('product')) return Activity
        if (resource.includes('customer')) return User
        if (resource.includes('order')) return Activity
        return Activity
    }

    const formatTime = (timestamp: string) => {
        try {
            return formatDistanceToNow(new Date(timestamp), { 
                addSuffix: true,
                locale: vi 
            })
        } catch {
            return 'vừa xong'
        }
    }

    const resources = Array.from(new Set(logs.map(log => log.resource).filter(Boolean)))

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gradient-to-r from-[#175ead] to-[#2575be] rounded-lg">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Lịch sử hoạt động</h1>
                            <p className="text-sm text-gray-600">Theo dõi mọi thao tác trong hệ thống</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="md:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Tìm kiếm theo user, event, resource..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Filter by status */}
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as any)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175ead]"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="success">Thành công</option>
                                <option value="failed">Thất bại</option>
                            </select>

                            {/* Filter by resource */}
                            <select
                                value={filterResource}
                                onChange={(e) => setFilterResource(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175ead]"
                            >
                                <option value="all">Tất cả resource</option>
                                {resources.map(resource => (
                                    <option key={resource} value={resource!}>{resource}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <div className="text-sm text-gray-600">
                                Hiển thị <span className="font-semibold text-gray-900">{filteredLogs.length}</span> / {logs.length} bản ghi
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={fetchLogs}
                                disabled={loading}
                            >
                                <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                                Làm mới
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Logs List */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#175ead] border-t-transparent"></div>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Shield className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="text-gray-500 text-center">Không tìm thấy bản ghi nào</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {filteredLogs.map((log) => {
                            const ResourceIcon = getResourceIcon(log.resource)
                            
                            return (
                                <Card key={log.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div className={cn(
                                                "p-2 rounded-lg flex-shrink-0",
                                                log.success ? "bg-green-50" : "bg-red-50"
                                            )}>
                                                {log.success ? (
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-red-600" />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <Badge className={cn("text-xs", getEventBadge(log.event_type))}>
                                                            {log.event_type}
                                                        </Badge>
                                                        {log.resource && (
                                                            <Badge variant="outline" className="text-xs">
                                                                <ResourceIcon className="w-3 h-3 mr-1" />
                                                                {log.resource}
                                                            </Badge>
                                                        )}
                                                        {log.action && (
                                                            <Badge variant="outline" className="text-xs">
                                                                {log.action}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                                        {formatTime(log.timestamp)}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                                    {log.user_email && (
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <User className="w-4 h-4" />
                                                            <span className="truncate">{log.user_email}</span>
                                                        </div>
                                                    )}
                                                    {log.ip_address && (
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <Activity className="w-4 h-4" />
                                                            <span>{log.ip_address}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Calendar className="w-4 h-4" />
                                                        <span className="text-xs">
                                                            {new Date(log.timestamp).toLocaleString('vi-VN')}
                                                        </span>
                                                    </div>
                                                </div>

                                                {log.error_message && (
                                                    <div className="mt-2 p-2 bg-red-50 rounded-lg flex items-start gap-2">
                                                        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-red-700">{log.error_message}</span>
                                                    </div>
                                                )}

                                                {log.metadata && Object.keys(log.metadata as any).length > 0 && (
                                                    <details className="mt-2">
                                                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                                                            Chi tiết metadata
                                                        </summary>
                                                        <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                                                            {JSON.stringify(log.metadata, null, 2)}
                                                        </pre>
                                                    </details>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
