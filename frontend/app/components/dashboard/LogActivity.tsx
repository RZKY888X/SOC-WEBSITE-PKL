import { LogItem } from "@/lib/types";

interface LogActivityProps {
  recentLogs: LogItem[];
}

export default function LogActivity({ recentLogs }: LogActivityProps) {
  const downLogs = recentLogs.filter((log) => log.status === "Down");

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-8'>
      {/* ALERT - Left Panel */}
      <div className='bg-gradient-to-br from-[#2B1B1B] via-[#1B263B] to-[#1B0F0F] p-6 rounded-3xl shadow-2xl border border-red-500/30 overflow-hidden relative'>
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl animate-pulse">🚨</div>
            <h2 className='text-xl font-bold text-red-400'>
              Critical Alerts
            </h2>
            <div className="ml-auto bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold">
              {downLogs.length}
            </div>
          </div>

          <div className="space-y-3 max-h-80 overflow-auto custom-scrollbar">
            {downLogs.length === 0 ? (
              <div className='text-center py-8'>
                <div className="text-green-400 text-3xl mb-3">✅</div>
                <p className='text-gray-400 font-medium'>No critical alerts</p>
                <p className='text-gray-500 text-sm mt-2'>All sensors are operating normally</p>
              </div>
            ) : (
              downLogs.map((log, i) => {
                const time = log.timestamp 
                  ? new Date(log.timestamp).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : '--:--:--';
                
                return (
                  <div key={`${log.objid || i}-alert-${i}`} className="bg-gradient-to-r from-red-900/30 to-red-800/20 p-4 rounded-xl border border-red-500/30 hover:border-red-500/50 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-16 bg-gradient-to-b from-red-500 to-red-700 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">[{time}]</span>
                          <span className="text-red-400 text-lg">❌</span>
                        </div>
                        <div className="text-white font-semibold mb-1">
                          Sensor: <span className="text-red-300">{log.sensor}</span>
                        </div>
                        <div className="text-gray-300 text-sm mb-2">
                          Device: <span className="font-medium text-white">{log.device}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded">
                            Status: {log.status}
                          </span>
                          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded font-mono">
                            Value: {log.lastvalue || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* LOG ACTIVITY - Right Panel */}
      <div className='bg-gradient-to-br from-[#1B263B] via-[#1a2538] to-[#162235] p-6 rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative'>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl">📊</div>
            <h2 className='text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
              Recent Activity
            </h2>
            <div className="ml-auto bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
              {recentLogs.length}
            </div>
          </div>

          <div className="space-y-3 max-h-80 overflow-auto custom-scrollbar">
            {recentLogs.map((log, i) => {
              const time = log.timestamp 
                ? new Date(log.timestamp).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : '--:--:--';
              
              const icon = log.status === "Down" ? "❌" : log.status === "Warning" ? "⚠️" : "✅";
              const statusColor = log.status === "Down" ? "text-red-400 bg-red-500/20" :
                log.status === "Warning" ? "text-yellow-400 bg-yellow-500/20" :
                "text-green-400 bg-green-500/20";

              return (
                <div key={`${log.objid || i}-log-${i}`} className="bg-gradient-to-r from-white/5 to-white/10 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="w-1 h-16 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">[{time}]</span>
                        <span className="text-lg">{icon}</span>
                      </div>
                      <div className="text-white font-semibold mb-1">
                        Sensor: <span className="text-blue-300">{log.sensor}</span>
                      </div>
                      <div className="text-gray-300 text-sm mb-2">
                        Device: <span className="font-medium text-white">{log.device}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className={`px-2 py-1 rounded ${statusColor}`}>
                          Status: {log.status}
                        </span>
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-mono">
                          Value: {log.lastvalue || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}