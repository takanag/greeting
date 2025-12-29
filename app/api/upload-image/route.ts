import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import sharp from 'sharp';

/**
 * 画像最適化処理
 * 
 * 実装方針: Vercel API Routes を使用
 * 理由:
 * - Next.js と統合しやすく、デプロイが簡単
 * - sharp が Vercel の環境で安定して動作
 * - サーバーサイドで処理するため、クライアントの負荷が少ない
 * - エラーハンドリングとログが容易
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'ファイルがありません' }, { status: 400 });
    }

    // ファイルサイズチェック（10MB制限）
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'ファイルサイズが大きすぎます（最大10MB）' }, { status: 400 });
    }

    // ファイルをバッファに変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 画像最適化: 拡大表示用（最大幅 1200px、WebP形式）
    let optimizedImage: Buffer;
    let thumbnail: Buffer;
    
    try {
      optimizedImage = await sharp(buffer)
        .rotate() // EXIF回転補正
        .resize(1200, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .webp({ quality: 85 })
        .toBuffer();

      // サムネイル生成: 一覧表示用（最大幅 400px、WebP形式）
      thumbnail = await sharp(buffer)
        .rotate() // EXIF回転補正
        .resize(400, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .webp({ quality: 80 })
        .toBuffer();
    } catch (sharpError: any) {
      console.error('Sharp processing error:', sharpError);
      return NextResponse.json(
        { error: '画像の処理に失敗しました: ' + sharpError.message },
        { status: 500 }
      );
    }

    // Supabase Storage にアップロード
    const supabase = createAdminClient();
    const timestamp = Date.now();
    const imagePath = `images/${timestamp}-optimized.webp`;
    const thumbnailPath = `thumbnails/${timestamp}-thumbnail.webp`;

    // 拡大表示用画像をアップロード
    const { data: imageData, error: imageError } = await supabase.storage
      .from('greeting-images')
      .upload(imagePath, optimizedImage, {
        contentType: 'image/webp',
        upsert: false,
      });

    if (imageError) throw imageError;

    // サムネイルをアップロード
    const { data: thumbnailData, error: thumbnailError } = await supabase.storage
      .from('greeting-images')
      .upload(thumbnailPath, thumbnail, {
        contentType: 'image/webp',
        upsert: false,
      });

    if (thumbnailError) throw thumbnailError;

    // 公開URLを取得
    const { data: { publicUrl: imageUrl } } = supabase.storage
      .from('greeting-images')
      .getPublicUrl(imagePath);

    const { data: { publicUrl: thumbnailUrl } } = supabase.storage
      .from('greeting-images')
      .getPublicUrl(thumbnailPath);

    return NextResponse.json({
      imageUrl,
      thumbnailUrl,
    });
  } catch (error: any) {
    console.error('Image upload error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: '画像のアップロードに失敗しました: ' + (error.message || '不明なエラー'),
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

