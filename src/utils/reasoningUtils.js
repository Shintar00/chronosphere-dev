import { fetchNews, performGPTReasoning } from './apiUtils';
import { generatePrompt, parseGPTResponse } from './gptUtils';
import { logThinkingProcess } from './logging';
import { generateInitialPrompt, generateIterativePrompt, updateWithNews } from './promptGenerators';
import { needsSearch, needsFurtherIteration, generateErrorResponse } from './reasoningHelpers';

const MAX_ITERATIONS = 5;
const LEARNING_CUTOFF_DATE = '2023-10-01';

export const performAdvancedReasoning = async (query, timestamp) => {
  try {
    let currentResponse = null;
    let thinkingProcess = [];
    let analysisHistory = [];

    thinkingProcess.push(`初期クエリ: ${query}`);
    
    for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
      const prompt = iteration === 0
        ? generateInitialPrompt(query, timestamp)
        : generateIterativePrompt(query, currentResponse, timestamp, analysisHistory);

      thinkingProcess.push(`GPT推論開始 (イテレーション ${iteration + 1})`);
      const gptResponse = await performGPTReasoning(prompt);
      
      if (!gptResponse) {
        thinkingProcess.push('GPTからの応答が空でした');
        return generateErrorResponse('GPTからの応答が空でした。', thinkingProcess);
      }
      
      currentResponse = parseGPTResponse(gptResponse);
      thinkingProcess.push(`GPT推論完了 (イテレーション ${iteration + 1})`);
      
      const iterationSummary = summarizeIteration(currentResponse, iteration + 1);
      analysisHistory.push(iterationSummary);
      
      if (iteration === MAX_ITERATIONS - 1 && needsSearch(currentResponse, timestamp)) {
        thinkingProcess.push('最終イテレーション後、最新情報の検索が必要と判断');
        try {
          const news = await fetchNews(query);
          thinkingProcess.push(`ニュース検索結果: ${news.length}件取得`);
          currentResponse = await updateWithNews(query, news, currentResponse, timestamp);
        } catch (error) {
          thinkingProcess.push(`最新情報の取得に失敗: ${error.message}`);
        }
      }

      if (!needsFurtherIteration(currentResponse)) {
        thinkingProcess.push(`イテレーション ${iteration + 1} で十分な回答が得られたため、プロセスを終了します。`);
        break;
      }
    }
    
    const timeline = generateTimeline(analysisHistory, timestamp);
    
    logThinkingProcess(thinkingProcess, currentResponse.最終回答, timeline);
    
    return {
      ...currentResponse,
      timestamp: timestamp,
      thinkingProcess: thinkingProcess,
      timeline: timeline,
      analysisHistory: analysisHistory,
    };
  } catch (error) {
    console.error('推論プロセス中にエラーが発生しました:', error);
    return generateErrorResponse(`処理中にエラーが発生しました: ${error.message}`, ['エラーが発生しました']);
  }
};

const summarizeIteration = (response, iteration) => {
  return {
    iteration: iteration,
    summary: `イテレーション ${iteration}: ${response.最終回答.substring(0, 50)}...`,
    keyInsights: extractKeyInsights(response),
    changesFromPrevious: identifyChanges(response, iteration)
  };
};

const extractKeyInsights = (response) => {
  // 重要な洞察を抽出するロジックを実装
  return [
    response.究極的自己一致性分析.substring(0, 100),
    response.メタ分析.substring(0, 100),
    response.自己修正プロセス.substring(0, 100)
  ];
};

const identifyChanges = (response, iteration) => {
  // 前回のイテレーションからの変更を特定するロジックを実装
  return `イテレーション ${iteration} での主な変更: ${response.自己修正プロセス.substring(0, 100)}`;
};

const generateTimeline = (analysisHistory, timestamp) => {
  const timeline = [];
  const currentDate = new Date(timestamp);
  const learningCutoffDate = new Date(LEARNING_CUTOFF_DATE);

  if (isValidDate(learningCutoffDate)) {
    timeline.push({
      date: learningCutoffDate.toISOString(),
      event: 'GPTの学習データカットオフ日'
    });
  }

  analysisHistory.forEach((analysis) => {
    if (isValidDate(currentDate)) {
      timeline.push({
        date: new Date(currentDate.getTime() - (analysisHistory.length - analysis.iteration) * 86400000).toISOString(),
        event: analysis.summary
      });
    }
  });

  if (isValidDate(currentDate)) {
    timeline.push({
      date: currentDate.toISOString(),
      event: '現在の分析時点'
    });
  }

  return timeline;
};

const isValidDate = (date) => date instanceof Date && !isNaN(date);