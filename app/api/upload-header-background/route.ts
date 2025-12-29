import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import sharp from 'sharp';

/**
 * ヘッダー背景画像のアップロード
 * 背景画像は全幅表示のため、より大きなサイズで最適化
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'ファイルがありません' }, { status: 400 });
    }

    // ファイルをバッファに変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 背景画像の最適化: 全幅表示用（最大幅 1920px、WebP形式）
    const optimizedImage = await sharp(buffer)
      .rotate() // EXIF回転補正
      .resize(1920, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: 85 })
      .toBuffer();

    // Supabase Storage にアップロード
    const supabase = createAdminClient();
    const timestamp = Date.now();
    const imagePath = `headers/${timestamp}-header.webp`;

    const { data: imageData, error: imageError } = await supabase.storage
      .from('greeting-images')
      .upload(imagePath, optimizedImage, {
        contentType: 'image/webp',
        upsert: false,
      });

    if (imageError) throw imageError;

    // 公開URLを取得
    const { data: { publicUrl: imageUrl } } = supabase.storage
      .from('greeting-images')
      .getPublicUrl(imagePath);

    return NextResponse.json({
      imageUrl,
    });
  } catch (error: any) {
    console.error('Header background upload error:', error);
    return NextResponse.json(
      { error: '画像のアップロードに失敗しました: ' + error.message },
      { status: 500 }
    );
  }
}

