export const needsSearch = (response, timestamp) => {
  if (!response || typeof response !== 'object') {
    return false;
  }
  
  const learningCutoffDate = new Date('2022-09-01'); // GPT-4の学習データカットオフ日
  const currentDate = new Date(timestamp);
  const daysSinceCutoff = (currentDate - learningCutoffDate) / (1000 * 60 * 60 * 24);

  // 学習データカットオフから1年以上経過している場合、検索を推奨
  if (daysSinceCutoff > 365) {
    return true;
  }

  const combinedText = Object.values(response)
    .filter(value => typeof value === 'string')
    .join(' ')
    .toLowerCase();

  // 時間依存性の高いキーワードを検出
  const timelyKeywords = ['最新', '現在', '最近', '変更', '改正', '新法', '新規制'];
  const hasTimelyKeywords = timelyKeywords.some(keyword => combinedText.includes(keyword));

  // 究極的自己一致性分析で不確実性が高いと判断された場合
  const uncertaintyIndicators = ['不確実', '変化の可能性', '最新データが必要'];
  const hasUncertainty = uncertaintyIndicators.some(indicator => response.究極的自己一致性分析.toLowerCase().includes(indicator));

  return hasTimelyKeywords || hasUncertainty;
};

export const needsFurtherIteration = (response) => {
  if (!response || typeof response !== 'object' || !response.次のステップ) {
    return false;
  }
  const nextStep = response.次のステップ.toLowerCase();
  return nextStep.includes('最新のデータを確認');
};

export const generateErrorResponse = (errorMessage, thinkingProcess) => ({
  error: errorMessage,
  最終回答: 'エラーが発生したため、回答を生成できませんでした。',
  補足事項: ['データ取得または処理中にエラーが発生しました。'],
  シナリオ: { シナリオ1: 'エラーにより分析できませんでした。' },
  整合性チェック: 'エラーにより実行できませんでした。',
  多角的考察: { 経済的観点: 'エラーにより分析できませんでした。' },
  究極的自己一致性分析: 'エラーにより実行できませんでした。',
  メタ分析: 'エラーにより実行できませんでした。',
  自己修正プロセス: 'エラーにより実行できませんでした。',
  代替解釈: 'エラーにより提示できませんでした。',
  次のステップ: 'エラーにより決定できませんでした。',
  thinkingProcess: thinkingProcess,
});