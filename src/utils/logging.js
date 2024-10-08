export const logThinkingProcess = (thinking_process, final_answer, timelines) => {
  console.group('思考プロセス');
  thinking_process.forEach((step, index) => {
    console.log(`${index + 1}. ${step}`);
  });
  console.groupEnd();

  console.group('タイムライン情報');
  Object.entries(timelines).forEach(([id, info]) => {
    console.log(`タイムライン${id}: ${info}`);
  });
  console.groupEnd();

  console.log('最終回答:', final_answer);
};