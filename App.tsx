import React, { useState } from 'react';
import Header from './components/Header';
import VoiceStudio from './components/VoiceStudio';
import { generateArchitecture } from './services/geminiService';
import { AppType, TechStack, Architecture, GeneratedResult, FileNode } from './types';
import { 
  Folder, FileCode, ArrowRight, Activity, 
  Layers, Database, Code, ShieldCheck, 
  CheckCircle2, AlertCircle, Loader, Cpu
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];

function App() {
  // --- STATE ---
  const [libraryPath, setLibraryPath] = useState('');
  const [appType, setAppType] = useState<AppType>(AppType.SAAS_PLATFORM);
  const [stack, setStack] = useState<TechStack>(TechStack.REACT_NODE);
  const [architecture, setArchitecture] = useState<Architecture>(Architecture.CLEAN_ARCH);
  const [requirements, setRequirements] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tree' | 'docs' | 'viz'>('tree');
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  // --- HANDLERS ---
  const handleGenerate = async () => {
    if (!libraryPath || !requirements) {
      setError("Vui lòng nhập đường dẫn thư viện và yêu cầu chi tiết.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateArchitecture(
        libraryPath,
        appType,
        stack,
        architecture,
        requirements,
        "Người dùng muốn tối ưu hóa code cũ."
      );
      setResult(data);
      // Select first file by default if available
      if (data.fileTree && data.fileTree.length > 0) {
        setSelectedFile(data.fileTree[0]);
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra trong quá trình xử lý AI.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER HELPERS ---
  const renderFileTree = (nodes: FileNode[] | undefined, depth = 0) => {
    if (!nodes || !Array.isArray(nodes)) return null;
    return nodes.map((node, idx) => (
      <div key={`${node.name}-${idx}`} className="select-none">
        <div 
          className={`flex items-center gap-2 py-1.5 px-2 cursor-pointer hover:bg-cyan-900/20 transition-colors rounded ${selectedFile?.name === node.name ? 'bg-cyan-900/40 text-cyan-300' : 'text-slate-400'}`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
             if (node.type === 'file') setSelectedFile(node);
          }}
        >
          {node.type === 'folder' ? (
            <Folder className="w-4 h-4 text-amber-500" />
          ) : (
            <FileCode className={`w-4 h-4 ${node.isReused ? 'text-green-400' : 'text-blue-400'}`} />
          )}
          <span className="text-sm font-medium truncate">{node.name}</span>
          {node.isReused && (
            <span className="ml-auto text-[10px] bg-green-900/50 text-green-400 px-1.5 py-0.5 rounded border border-green-700/50">REUSED</span>
          )}
        </div>
        {node.children && renderFileTree(node.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="container mx-auto px-4 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: INPUTS */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border-t border-cyan-500/50 shadow-2xl shadow-cyan-900/20 relative">
               {/* Decorative Lines */}
               <div className="absolute -left-1 top-10 w-1 h-20 bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>
               
               <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 font-display">
                 <Activity className="text-cyan-400" /> CẤU HÌNH HỆ THỐNG
               </h2>

               <div className="space-y-5">
                 {/* Library Path */}
                 <div>
                   <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Đường dẫn thư viện (Local Path)</label>
                   <div className="relative">
                     <input 
                       type="text" 
                       value={libraryPath}
                       onChange={(e) => setLibraryPath(e.target.value)}
                       placeholder="C:/Users/Dev/My-Snippets"
                       className="w-full bg-black/40 border border-slate-700 rounded-lg p-3 text-cyan-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
                     />
                     <div className="absolute right-3 top-3.5 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e] animate-pulse"></div>
                   </div>
                 </div>

                 {/* Dropdowns Grid */}
                 <div className="grid grid-cols-1 gap-4">
                   <div>
                     <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Loại Ứng Dụng</label>
                     <div className="relative">
                       <Layers className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
                       <select 
                         value={appType}
                         onChange={(e) => setAppType(e.target.value as AppType)}
                         className="w-full bg-black/40 border border-slate-700 rounded-lg py-3 pl-10 pr-3 text-white appearance-none focus:border-cyan-500 focus:outline-none text-sm"
                       >
                         {Object.values(AppType).map(v => <option key={v} value={v}>{v}</option>)}
                       </select>
                     </div>
                   </div>

                   <div>
                     <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Tech Stack</label>
                     <div className="relative">
                       <Code className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
                       <select 
                         value={stack}
                         onChange={(e) => setStack(e.target.value as TechStack)}
                         className="w-full bg-black/40 border border-slate-700 rounded-lg py-3 pl-10 pr-3 text-white appearance-none focus:border-cyan-500 focus:outline-none text-sm"
                       >
                         {Object.values(TechStack).map(v => <option key={v} value={v}>{v}</option>)}
                       </select>
                     </div>
                   </div>

                   <div>
                     <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Design Pattern</label>
                     <div className="relative">
                       <Database className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
                       <select 
                         value={architecture}
                         onChange={(e) => setArchitecture(e.target.value as Architecture)}
                         className="w-full bg-black/40 border border-slate-700 rounded-lg py-3 pl-10 pr-3 text-white appearance-none focus:border-cyan-500 focus:outline-none text-sm"
                       >
                         {Object.values(Architecture).map(v => <option key={v} value={v}>{v}</option>)}
                       </select>
                     </div>
                   </div>
                 </div>

                 {/* Requirements */}
                 <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Yêu Cầu Đặc Tả (Prompt)</label>
                    <textarea 
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="Mô tả tính năng chi tiết (VD: Cần module Auth dùng lại snippet JWT, thêm chức năng 2FA...)"
                      className="w-full h-32 bg-black/40 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none resize-none text-sm"
                    />
                 </div>

                 {/* Action Button */}
                 <button 
                   onClick={handleGenerate}
                   disabled={loading}
                   className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]
                     ${loading 
                       ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                       : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:bg-size-200 bg-size-100 text-white animate-gradient'
                     }`}
                   style={{ backgroundSize: '200% auto' }}
                 >
                   {loading ? (
                     <span className="flex items-center justify-center gap-2">
                       <Loader className="animate-spin" /> Đang Phân Tích Neural...
                     </span>
                   ) : (
                     <span className="flex items-center justify-center gap-2">
                       Kích Hoạt Genesis Core <ArrowRight className="w-5 h-5" />
                     </span>
                   )}
                 </button>

                 {error && (
                   <div className="flex items-start gap-2 p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                     <AlertCircle className="w-5 h-5 shrink-0" />
                     <p>{error}</p>
                   </div>
                 )}
               </div>
            </div>

            {/* Helper Info */}
            <div className="glass-panel p-4 rounded-xl border border-white/5">
              <h4 className="text-cyan-400 text-xs font-bold uppercase mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Chế độ bảo mật
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Hệ thống chỉ đọc metadata và chữ ký hàm (function signatures). 
                Mã nguồn gốc của bạn được xử lý cục bộ và bảo vệ bởi thuật toán mã hóa lượng tử (Quantum Encryption Simulation).
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: OUTPUT */}
          <div className="lg:col-span-8 min-h-[600px]">
            {result ? (
              <div className="flex flex-col h-full space-y-6">
                
                {/* Analysis Card */}
                <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-purple-500">
                  <h3 className="text-lg font-bold text-white mb-2 font-display">PHÂN TÍCH KIẾN TRÚC</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{result.analysis}</p>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 glass-panel rounded-2xl overflow-hidden flex flex-col border border-white/10">
                  {/* Tabs */}
                  <div className="flex border-b border-white/10 bg-black/20">
                    <button 
                      onClick={() => setActiveTab('tree')}
                      className={`px-6 py-3 text-sm font-bold uppercase transition-colors ${activeTab === 'tree' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-white/5' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      File Structure
                    </button>
                    <button 
                      onClick={() => setActiveTab('docs')}
                      className={`px-6 py-3 text-sm font-bold uppercase transition-colors ${activeTab === 'docs' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-white/5' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      Documentation
                    </button>
                    <button 
                      onClick={() => setActiveTab('viz')}
                      className={`px-6 py-3 text-sm font-bold uppercase transition-colors ${activeTab === 'viz' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-white/5' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      Reuse Metrics
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="flex-1 p-0 overflow-hidden relative">
                    {activeTab === 'tree' && (
                      <div className="flex h-[600px]">
                        {/* File Tree Sidebar */}
                        <div className="w-1/3 border-r border-white/10 overflow-y-auto p-4 bg-black/20">
                          <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-wider">Project Explorer</h4>
                          {renderFileTree(result.fileTree || [])}
                        </div>
                        {/* Code Editor View */}
                        <div className="w-2/3 bg-[#0d1117] p-4 overflow-y-auto font-mono text-sm relative">
                           {selectedFile ? (
                             <>
                               <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                                 <span className="text-cyan-300">{selectedFile.name}</span>
                                 {selectedFile.isReused && (
                                   <span className="flex items-center gap-1 text-[10px] text-green-400">
                                     <CheckCircle2 className="w-3 h-3" /> Snippet tái sử dụng
                                   </span>
                                 )}
                               </div>
                               <pre className="text-slate-300 whitespace-pre-wrap">
                                 {selectedFile.content || "// No content available"}
                               </pre>
                               {selectedFile.description && (
                                 <div className="mt-8 p-4 bg-blue-900/10 border border-blue-500/20 rounded text-xs text-blue-300">
                                   <strong>AI Note:</strong> {selectedFile.description}
                                 </div>
                               )}
                             </>
                           ) : (
                             <div className="h-full flex flex-col items-center justify-center text-slate-600">
                               <Code className="w-16 h-16 mb-4 opacity-20" />
                               <p>Chọn một file từ danh sách bên trái để xem code.</p>
                             </div>
                           )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'docs' && (
                       <div className="p-8 h-[600px] overflow-y-auto bg-black/20">
                          <div className="max-w-3xl mx-auto">
                            <h2 className="text-2xl font-display font-bold text-white mb-6 border-b border-white/10 pb-4">Tài Liệu Kỹ Thuật</h2>
                            <div className="prose prose-invert prose-cyan max-w-none">
                              <p className="whitespace-pre-line text-slate-300 leading-relaxed">
                                {result.documentation}
                              </p>
                            </div>
                            
                            {/* VOICE STUDIO INTEGRATION */}
                            <div className="mt-12 pt-8 border-t border-white/10">
                              <VoiceStudio textToRead={result.documentation} />
                            </div>
                          </div>
                       </div>
                    )}

                    {activeTab === 'viz' && (
                      <div className="h-[600px] flex items-center justify-center bg-black/20 flex-col">
                        <h3 className="text-lg text-white mb-4 font-display">Tỷ Lệ Tái Sử Dụng Code</h3>
                        <div className="w-full h-[400px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={result.diagramData || []}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={140}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                              >
                                {(result.diagramData || []).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <RechartsTooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                              />
                              <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-8 text-center mt-8">
                          <div>
                             <p className="text-4xl font-bold text-green-400">{result.diagramData?.find(d => d.name.includes('Reuse'))?.value || 0}%</p>
                             <p className="text-xs text-slate-500 uppercase mt-1">Code Tái Sử Dụng</p>
                          </div>
                          <div>
                             <p className="text-4xl font-bold text-cyan-400">{result.reusedSnippets?.length || 0}</p>
                             <p className="text-xs text-slate-500 uppercase mt-1">Modules Được Kế Thừa</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              // Empty State
              <div className="h-full flex flex-col items-center justify-center glass-panel rounded-2xl border-dashed border-2 border-slate-700 p-12 text-center opacity-50">
                <div className="w-32 h-32 rounded-full bg-cyan-900/20 flex items-center justify-center mb-6 animate-pulse">
                  <Cpu className="w-16 h-16 text-cyan-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Sẵn Sàng Kiến Tạo</h3>
                <p className="text-slate-400 max-w-md">
                  Nhập thông tin bên trái để kích hoạt AI. Hệ thống sẽ quét, phân tích và đề xuất kiến trúc tối ưu nhất từ kho tàng code của bạn.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;