import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { YearWithCards } from '@/types/database';
import CardModal from '@/components/CardModal';
import ContactInfo from '@/components/ContactInfo';
import FooterText from '@/components/FooterText';

async function getYearData(year: number): Promise<YearWithCards | null> {
  const supabase = await createClient();
  
  const { data: yearData, error: yearError } = await supabase
    .from('years')
    .select('*')
    .eq('year', year)
    .single();

  if (yearError || !yearData) {
    return null;
  }

  const { data: cards, error: cardsError } = await supabase
    .from('cards')
    .select('*')
    .eq('year_id', yearData.id)
    .order('display_order', { ascending: true });

  if (cardsError) {
    return null;
  }

  return {
    ...yearData,
    cards: cards || [],
  };
}

export default async function GreetingPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const yearNum = parseInt(year, 10);

  if (isNaN(yearNum)) {
    notFound();
  }

  const data = await getYearData(yearNum);

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー背景画像 */}
      {data.header_background_url && (
        <div className="relative w-full h-[43.2vh] min-h-[288px] max-h-[432px] overflow-hidden">
          <Image
            src={data.header_background_url}
            alt="Header background"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            quality={90}
          />
          {/* オーバーレイ（テキストの可読性向上） */}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          {/* テキストオーバーレイ */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-[1.575rem] md:text-[2.1rem] lg:text-[2.625rem] font-bold text-white mb-4 drop-shadow-lg">
              {data.title_text}
            </h1>
            {data.greeting_text && (
              <div className="text-[0.7875rem] md:text-[0.875rem] lg:text-[1.05rem] text-white whitespace-pre-line drop-shadow-md max-w-3xl">
                {data.greeting_text}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 背景画像がない場合のフォールバック */}
      {!data.header_background_url && (
        <div className="bg-gradient-to-b from-blue-400 to-blue-600 py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-[1.575rem] md:text-[2.1rem] lg:text-[2.625rem] font-bold text-white mb-4">
              {data.title_text}
            </h1>
            {data.greeting_text && (
              <div className="text-[0.7875rem] md:text-[0.875rem] lg:text-[1.05rem] text-white whitespace-pre-line">
                {data.greeting_text}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">

        {/* カード一覧（3列グリッド） */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {data.cards.map((card, index) => (
            <CardItem key={card.id} card={card} priority={index < 9} />
          ))}
        </div>

        {/* フッター（住所・連絡先） */}
        {data.footer_visible && (
          <div className="mt-16 pt-8 border-t border-gray-300">
            {/* 連絡先情報（3列レイアウト） */}
            {data.contact_info && (
              <ContactInfo contactInfo={data.contact_info} />
            )}

            {/* 従来の footer_text（後方互換性のため） */}
            {data.footer_text && (
              <FooterText text={data.footer_text} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CardItem({ card, priority = false }: { card: YearWithCards['cards'][0]; priority?: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="p-4 md:p-6 flex-1 flex flex-col">
        {/* カードヘッダー */}
        <div className="mb-3">
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">{card.title}</h2>
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
            <span className="font-semibold">{card.month}</span>
            {card.by_text && <span>By {card.by_text}</span>}
          </div>
        </div>

        {/* サムネイル画像 */}
        <div className="mb-3 flex-shrink-0">
          <CardModal
            imageUrl={card.image_url}
            thumbnailUrl={card.thumbnail_url}
            title={card.title}
            priority={priority}
          />
        </div>

        {/* 説明文 */}
        {card.description && (
          <div className="text-sm md:text-base text-gray-700 whitespace-pre-line flex-1">
            {card.description}
          </div>
        )}
      </div>
    </div>
  );
}

