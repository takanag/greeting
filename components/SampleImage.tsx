'use client';

export default function SampleImage() {
  return (
    <div className="flex justify-center">
      <div className="relative w-[52%] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <img
          src="/greeting-sample.png"
          alt="Greeting Pageのサンプル"
          className="w-full h-auto"
          onError={(e) => {
            // 画像が存在しない場合は非表示にする
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.style.display = 'none';
            }
          }}
        />
      </div>
    </div>
  );
}

