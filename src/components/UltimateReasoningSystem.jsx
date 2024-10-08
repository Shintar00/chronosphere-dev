import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { performAdvancedReasoning } from '@/utils/reasoningUtils';
import { motion } from "framer-motion";
import { Brain, RefreshCw, Download, RotateCw } from 'lucide-react';
import ReasoningReport from './ReasoningReport';
import { generatePDF } from '@/utils/pdfUtils';

const UltimateReasoningSystem = () => {
  const [userInput, setUserInput] = useState('');
  const [reasoning, setReasoning] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getCurrentTimestamp = () => {
    const now = new Date();
    return now.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) {
      toast({
        title: "入力エラー",
        description: "質問を入力してください。",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const timestamp = getCurrentTimestamp();
      const result = await performAdvancedReasoning(userInput, timestamp);
      if (!result || Object.keys(result).length === 0) {
        throw new Error('空の結果が返されました');
      }
      setReasoning(result);
      toast({
        title: "完了",
        description: "分析が完了しました。",
        variant: "success",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "エラー",
        description: `分析プロセス中にエラーが発生しました: ${error.message}`,
        variant: "destructive",
      });
      setReasoning(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setReasoning(null);
    setUserInput('');
  };

  const handleDownloadPDF = async () => {
    if (!reasoning) return;
    try {
      const pdfBlob = await generatePDF(reasoning);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'advanced_reasoning_report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "成功",
        description: "PDFのダウンロードが完了しました。",
        variant: "success",
      });
    } catch (error) {
      console.error('PDF生成エラー:', error);
      toast({
        title: "エラー",
        description: `PDFの生成中にエラーが発生しました: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleReanalyze = async () => {
    if (!reasoning) return;
    setIsLoading(true);
    try {
      const timestamp = getCurrentTimestamp();
      const reanalyzedResult = await performAdvancedReasoning(userInput, timestamp);
      setReasoning(reanalyzedResult);
      toast({
        title: "再分析完了",
        description: "分析結果が更新されました。",
        variant: "success",
      });
    } catch (error) {
      console.error('再分析エラー:', error);
      toast({
        title: "エラー",
        description: "再分析中にエラーが発生しました。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-gray-800 flex items-center justify-center">
          <Brain className="mr-2" /> 究極的自己一致的推論システム
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              id="userInput"
              name="userInput"
              placeholder="分析したい質問を入力してください"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="border-2 border-gray-300 focus:border-blue-500 rounded-lg flex-grow"
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" disabled={isLoading} className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center">
              {isLoading ? "分析中..." : "分析開始"}
            </Button>
            <Button type="button" onClick={handleRefresh} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
              <RefreshCw className="mr-2" /> リセット
            </Button>
            <Button type="button" onClick={handleReanalyze} disabled={!reasoning || isLoading} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
              <RotateCw className="mr-2" /> 再分析
            </Button>
            <Button type="button" onClick={handleDownloadPDF} disabled={!reasoning} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
              <Download className="mr-2" /> PDF
            </Button>
          </div>
        </form>
        {reasoning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ReasoningReport reasoning={reasoning} />
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default UltimateReasoningSystem;
