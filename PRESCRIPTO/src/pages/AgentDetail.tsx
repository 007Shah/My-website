import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileText, Download, ChevronLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyzeMedicalImage } from '../services/geminiService';

const agentData = {
  glaucoma: { name: 'Glaucoma AI', color: 'blue' },
  kidney: { name: 'Kidney Health', color: 'emerald' },
  'brain-tumor': { name: 'Brain Tumor AI', color: 'purple' },
  'heart-failure': { name: 'Heart Guard', color: 'red' },
};

export default function AgentDetail() {
  const { id } = useParams();
  const agent = agentData[id as keyof typeof agentData];
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    try {
      const buffer = await file.arrayBuffer();
      const analysis = await analyzeMedicalImage(buffer, file.type, agent.name);
      
      // Mocking structured data for the graph since LLM output is text
      const mockGraphData = [
        { time: 'Day 1', value: 20 },
        { time: 'Day 5', value: 35 },
        { time: 'Day 10', value: 45 },
        { time: 'Day 15', value: 60 },
        { time: 'Day 20', value: 75 },
      ];

      setResult({
        report: analysis,
        graphData: mockGraphData,
        probability: Math.floor(Math.random() * 100),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const downloadReport = () => {
    if (!result) return;
    const blob = new Blob([result.report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${id}-analysis-report.txt`;
    a.click();
  };

  if (!agent) return <div>Agent not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/" className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-primary mb-6">
        <ChevronLeft className="w-3 h-3 mr-1" /> Back to Agents
      </Link>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2.5 rounded-xl bg-${agent.color}-500/10`}>
              <Upload className={`w-5 h-5 text-${agent.color}-500`} />
            </div>
            <h2 className="text-lg font-bold">Upload MRI/Medical Image</h2>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl p-10 text-center cursor-pointer hover:border-primary/50 transition-colors group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-56 mx-auto rounded-lg shadow-lg" />
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Drag and drop your file here, or <span className="text-primary font-bold">browse</span>
                </p>
                <p className="text-[10px] text-slate-400">Supports JPG, PNG, DICOM (max 10MB)</p>
              </div>
            )}
          </div>

          <button
            disabled={!file || analyzing}
            onClick={handleAnalyze}
            className="w-full mt-6 py-3 bg-primary text-white rounded-xl text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              'Start Analysis'
            )}
          </button>
        </motion.div>

        {/* Results Section */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-10 text-center h-full flex flex-col items-center justify-center text-slate-400"
              >
                <FileText className="w-12 h-12 mb-3 opacity-10" />
                <p className="text-xs">Upload and analyze an image to see the results here.</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Probability Card */}
                <div className="glass-card p-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Detection Probability</h3>
                    <p className="text-3xl font-bold">{result.probability}%</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${result.probability > 70 ? 'border-red-500 text-red-500' : 'border-emerald-500 text-emerald-500'}`}>
                    {result.probability > 70 ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                  </div>
                </div>

                {/* Graph Card */}
                <div className="glass-card p-5 h-60">
                  <h3 className="text-[10px] font-bold opacity-60 uppercase tracking-wider mb-4">Severity Trend Analysis</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result.graphData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#88888820" />
                      <XAxis dataKey="time" stroke="#888888" fontSize={10} />
                      <YAxis stroke="#888888" fontSize={10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '10px' }}
                        itemStyle={{ color: '#5f6fff' }}
                      />
                      <Line type="monotone" dataKey="value" stroke="#5f6fff" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Report Card */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold">AI Diagnostic Report</h3>
                    <button
                      onClick={downloadReport}
                      className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-primary"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {result.report}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
