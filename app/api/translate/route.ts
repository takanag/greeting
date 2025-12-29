import { NextRequest, NextResponse } from 'next/server';

// 翻訳API（DeepL APIを使用）
// 環境変数: DEEPL_API_KEY または OPENAI_API_KEY
export async function POST(request: NextRequest) {
  try {
    const { text, targetLang = 'en' } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // 空のテキストの場合はそのまま返す
    if (!text.trim()) {
      return NextResponse.json({ translatedText: '' });
    }

    // DeepL APIを使用（優先）
    const deeplApiKey = process.env.DEEPL_API_KEY;
    if (deeplApiKey) {
      // DeepL APIのエンドポイント（無料版と有料版で異なる）
      const deeplEndpoint = deeplApiKey.endsWith(':fx') 
        ? 'https://api-free.deepl.com/v2/translate'
        : 'https://api.deepl.com/v2/translate';
      
      const response = await fetch(deeplEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `DeepL-Auth-Key ${deeplApiKey}`,
        },
        body: new URLSearchParams({
          text: text,
          target_lang: targetLang.toUpperCase(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepL API error:', errorText);
        throw new Error(`DeepL API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json({
        translatedText: data.translations[0]?.text || text,
      });
    }

    // OpenAI APIを使用（フォールバック）
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (openaiApiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional translator. Translate the given text to English. Preserve line breaks and formatting.',
            },
            {
              role: 'user',
              content: text,
            },
          ],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', errorText);
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json({
        translatedText: data.choices[0]?.message?.content || text,
      });
    }

    // APIキーが設定されていない場合は、テキストをそのまま返す（翻訳なし）
    console.warn('No translation API key found. Returning original text.');
    return NextResponse.json({ translatedText: text });
  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: error.message || 'Translation failed' },
      { status: 500 }
    );
  }
}

