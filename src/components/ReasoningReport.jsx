import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, AlertTriangle, BarChart2, Layers, Zap, RefreshCw, GitFork, CheckCircle, MessageSquare, Clock, Search, TreePine } from 'lucide-react';

const ReasoningReport = ({ reasoning }) => {
  const renderSection = (title, content, icon) => {
    if (!content) return null;
    return (
      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-700 flex items-center">
          {icon && React.createElement(icon, { className: "mr-2", size: 24 })}
          {title}
        </h3>
        {typeof content === 'string' ? (
          <p className="text-gray-800">{content}</p>
        ) : Array.isArray(content) ? (
          content.map((item, index) => <p key={index} className="text-gray-800 mb-2">{item}</p>)
        ) : (
          Object.entries(content).map(([key, value], index) => (
            <div key={index} className="mb-2">
              <h4 className="font-semibold">{key}</h4>
              <p className="text-gray-800">{value}</p>
            </div>
          ))
        )}
      </section>
    );
  };

  const renderTimeline = (timeline) => {
    if (!timeline || timeline.length === 0) return null;
    return (
      <section className="mt-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-700 flex items-center">
          <Clock className="mr-2" size={24} />
          タイムライン
        </h3>
        <ul className="space-y-2">
          {timeline.map((item, index) => (
            <li key={index} className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">{new Date(item.date).toLocaleDateString()}</span>
              <span className="text-gray-800">{item.event}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  };

  const renderAnalysisHistory = (analysisHistory) => {
    if (!analysisHistory || analysisHistory.length === 0) return null;
    return (
      <section className="mt-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-700 flex items-center">
          <TreePine className="mr-2" size={24} />
          分析の進化
        </h3>
        {analysisHistory.map((analysis, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold text-lg mb-2">イテレーション {analysis.iteration}</h4>
            <p><strong>サマリー:</strong> {analysis.summary}</p>
            <p><strong>主要な洞察:</strong> {analysis.keyInsights.join(', ')}</p>
            <p><strong>変更点:</strong> {analysis.changesFromPrevious}</p>
          </div>
        ))}
      </section>
    );
  };

  if (!reasoning || reasoning.error) {
    return (
      <Card className="w-full bg-white shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center">
            <Brain className="mr-2" /> エラー
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{reasoning?.error || 'データの取得中にエラーが発生しました。'}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center">
          <Brain className="mr-2" /> 究極的自己一致的推論レポート
        </CardTitle>
        <p className="text-center text-gray-600">分析日時: {reasoning.timestamp}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderSection('最終回答', reasoning.最終回答, Zap)}
        {renderSection('思考プロセス', reasoning.thinkingProcess, Search)}
        {renderSection('補足事項', reasoning.補足事項, Layers)}
        {renderSection('時間的考察', reasoning.時間的考察, Clock)}
        {renderSection('シナリオ分析', reasoning.シナリオ, BarChart2)}
        {renderSection('整合性チェック', reasoning.整合性チェック, AlertTriangle)}
        {renderSection('多角的考察', reasoning.多角的考察, MessageSquare)}
        {renderSection('究極的自己一致性分析', reasoning.究極的自己一致性分析, CheckCircle)}
        {renderSection('メタ分析', reasoning.メタ分析, RefreshCw)}
        {renderSection('自己修正プロセス', reasoning.自己修正プロセス, GitFork)}
        {renderSection('代替解釈', reasoning.代替解釈, MessageSquare)}
        {renderSection('次のステップ', reasoning.次のステップ, Zap)}
        {renderTimeline(reasoning.timeline)}
        {renderAnalysisHistory(reasoning.analysisHistory)}
      </CardContent>
    </Card>
  );
};

export default ReasoningReport;