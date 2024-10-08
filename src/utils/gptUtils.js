import { toast } from "@/components/ui/use-toast";

export const generatePrompt = (query, searchResults) => {
  let formattedResults = '';
  if (searchResults.length > 0) {
    formattedResults = searchResults.slice(0, 1).map(result => 
      `タイトル: ${result.title}\nURL: ${result.URL}\n内容: ${result.content}\n`
    ).join('\n');
  } else {
    formattedResults = '最新情報が入手できませんでした。';
  }

  let promptText = `
質問: ${query}

検索結果:
${formattedResults}

以下の形式で回答してください。各セクションは必ず指定されたキーワードで始めてください：

最終回答: [質問に対する簡潔な回答]

補足事項:
- [関連する詳細情報]
`;

  return promptText;
};

export const parseGPTResponse = (response) => {
  if (typeof response !== 'string' || response.trim() === '') {
    console.error('GPTの応答が無効です:', response);
    toast({
      title: "エラー",
      description: "GPTの応答を解析できませんでした。",
      variant: "destructive",
    });
    return {
      最終回答: 'エラーが発生したため、回答を生成できませんでした。',
      補足事項: ['GPTの応答が無効でした。'],
      シナリオ: { シナリオ1: 'エラーにより分析できませんでした。' },
      整合性チェック: 'エラーにより実行できませんでした。',
      不足情報: 'エラーにより特定できませんでした。',
      多角的考察: { 経済的観点: 'エラーにより分析できませんでした。' },
      究極的自己一致性分析: 'エラーにより実行できませんでした。',
      メタ分析: 'エラーにより実行できませんでした。',
      自己修正プロセス: 'エラーにより実行できませんでした。',
      代替解釈: 'エラーにより提示できませんでした。',
    };
  }

  const sections = response.split('\n\n');
  let result = {
    最終回答: '',
    補足事項: [],
    シナリオ: {},
    整合性チェック: '',
    不足情報: '',
    多角的考察: {},
    究極的自己一致性分析: '',
    メタ分析: '',
    自己修正プロセス: '',
    代替解釈: ''
  };

  const parseSection = (sectionName, content, parser) => {
    try {
      result[sectionName] = parser(content);
    } catch (error) {
      console.error(`${sectionName}のパース中にエラーが発生しました:`, error);
      result[sectionName] = `${sectionName}のパース中にエラーが発生しました`;
    }
  };

  sections.forEach(section => {
    if (section.startsWith('最終回答:')) {
      parseSection('最終回答', section.replace('最終回答:', '').trim(), content => content);
    } else if (section.startsWith('補足事項:')) {
      parseSection('補足事項', section, content => content.split('\n').slice(1).map(item => item.trim()));
    } else if (section.startsWith('シナリオ分析:')) {
      parseSection('シナリオ', section, content => {
        const scenarios = content.split('\n').slice(1);
        const result = {};
        scenarios.forEach(scenario => {
          const match = scenario.match(/シナリオ(\d+): (.+) \(妥当性評価: (.+)\)/);
          if (match) {
            result[`シナリオ${match[1]}`] = `${match[2]} (妥当性評価: ${match[3]})`;
          }
        });
        return result;
      });
    } else if (section.startsWith('整合性チェック:')) {
      parseSection('整合性チェック', section.replace('整合性チェック:', '').trim(), content => content);
    } else if (section.startsWith('不足情報と課題:')) {
      parseSection('不足情報', section.replace('不足情報と課題:', '').trim(), content => content);
    } else if (section.startsWith('多角的考察:')) {
      parseSection('多角的考察', section, content => {
        const perspectives = content.split('\n').slice(1);
        const result = {};
        perspectives.forEach(perspective => {
          const [key, value] = perspective.split(': ');
          if (key && value) {
            result[key] = value.trim();
          }
        });
        return result;
      });
    } else if (section.startsWith('究極的自己一致性分析:')) {
      parseSection('究極的自己一致性分析', section.replace('究極的自己一致性分析:', '').trim(), content => content);
    } else if (section.startsWith('メタ分析:')) {
      parseSection('メタ分析', section.replace('メタ分析:', '').trim(), content => content);
    } else if (section.startsWith('自己修正プロセス:')) {
      parseSection('自己修正プロセス', section.replace('自己修正プロセス:', '').trim(), content => content);
    } else if (section.startsWith('代替解釈:')) {
      parseSection('代替解釈', section.replace('代替解釈:', '').trim(), content => content);
    }
  });

  return result;
};
