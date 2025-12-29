'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/types/database';
import CardEditor from './CardEditor';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableCardItem({
  card,
  yearId,
  editingCardId,
  setEditingCardId,
  onDelete,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onOrderChange,
  currentOrder,
  totalCards,
}: {
  card: Card;
  yearId: string;
  editingCardId: string | null;
  setEditingCardId: (id: string | null) => void;
  onDelete: (id: string) => void;
  onUpdate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onOrderChange: (newOrder: number) => void;
  currentOrder: number;
  totalCards: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const safeCurrentOrder = currentOrder ?? 0;
  const [orderInput, setOrderInput] = useState(String(safeCurrentOrder + 1));

  // currentOrderが変更されたときにorderInputを更新
  useEffect(() => {
    setOrderInput(String(safeCurrentOrder + 1));
  }, [safeCurrentOrder]);

  const handleOrderSubmit = () => {
    const newOrder = parseInt(orderInput, 10) - 1;
    if (!isNaN(newOrder) && newOrder >= 0 && newOrder < totalCards && newOrder !== safeCurrentOrder) {
      onOrderChange(newOrder);
    } else {
      setOrderInput(String(safeCurrentOrder + 1));
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-50 rounded-lg p-4 border-2 ${
        isDragging ? 'border-blue-500 opacity-50' : 'border-transparent'
      }`}
    >
      {editingCardId === card.id ? (
        <CardEditor
          yearId={yearId}
          card={card}
          onSave={() => {
            setEditingCardId(null);
            onUpdate();
          }}
          onCancel={() => setEditingCardId(null)}
        />
      ) : (
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div
                {...attributes}
                {...listeners}
                className="cursor-move text-gray-600 hover:text-gray-800"
                title="ドラッグして並び替え"
              >
                ☰
              </div>
              <span className="text-xs text-gray-800 font-mono bg-gray-200 px-2 py-1 rounded">
                {safeCurrentOrder + 1}
              </span>
              <h3 className="font-bold text-lg text-gray-900">{card.title}</h3>
              <span className="text-sm text-gray-800">({card.month})</span>
            </div>
            {card.by_text && (
              <p className="text-sm text-gray-800 mb-2">By {card.by_text}</p>
            )}
            {card.description && (
              <p className="text-sm text-gray-700 line-clamp-2">{card.description}</p>
            )}
            {card.thumbnail_url && (
              <img
                src={card.thumbnail_url}
                alt={card.title}
                className="mt-2 w-32 h-20 object-cover rounded"
              />
            )}
          </div>
          <div className="flex flex-col gap-2 ml-4">
            <div className="flex gap-1">
              <button
                onClick={onMoveUp}
                disabled={safeCurrentOrder === 0}
                className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="上に移動"
              >
                ↑
              </button>
              <button
                onClick={onMoveDown}
                disabled={safeCurrentOrder === totalCards - 1}
                className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="下に移動"
              >
                ↓
              </button>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max={totalCards}
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                onBlur={handleOrderSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleOrderSubmit();
                  }
                }}
                className="w-12 px-1 py-1 text-xs border border-gray-300 rounded text-center"
                title="順序を直接入力（Enterで確定）"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingCardId(card.id)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                編集
              </button>
              <button
                onClick={() => onDelete(card.id)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CardList({
  yearId,
  cards,
  onUpdate,
}: {
  yearId: string;
  cards: Card[];
  onUpdate: () => void;
}) {
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [showNewCard, setShowNewCard] = useState(false);
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = cards.findIndex((card) => card.id === active.id);
    const newIndex = cards.findIndex((card) => card.id === over.id);

    await updateCardOrder(oldIndex, newIndex);
  };

  const updateCardOrder = async (oldIndex: number, newIndex: number) => {
    const newCards = arrayMove(cards, oldIndex, newIndex);

    // 並び順を更新
    try {
      const updates = newCards.map((card, index) => ({
        id: card.id,
        display_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from('cards')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      onUpdate();
    } catch (err: any) {
      alert('並び替えに失敗しました: ' + err.message);
    }
  };

  const handleMoveUp = async (cardIndex: number) => {
    if (cardIndex > 0) {
      await updateCardOrder(cardIndex, cardIndex - 1);
    }
  };

  const handleMoveDown = async (cardIndex: number) => {
    if (cardIndex < cards.length - 1) {
      await updateCardOrder(cardIndex, cardIndex + 1);
    }
  };

  const handleOrderChange = async (cardIndex: number, newOrder: number) => {
    if (newOrder >= 0 && newOrder < cards.length && newOrder !== cardIndex) {
      await updateCardOrder(cardIndex, newOrder);
    }
  };

  const handleDelete = async (cardId: string) => {
    if (!confirm('このカードを削除しますか？')) return;

    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;

      onUpdate();
    } catch (err: any) {
      alert('削除に失敗しました: ' + err.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">カード一覧</h2>
        <button
          onClick={() => setShowNewCard(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          新規カードを追加
        </button>
      </div>

      {showNewCard && (
        <CardEditor
          yearId={yearId}
          onSave={() => {
            setShowNewCard(false);
            onUpdate();
          }}
          onCancel={() => setShowNewCard(false)}
        />
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {cards.map((card, index) => (
              <SortableCardItem
                key={card.id}
                card={card}
                yearId={yearId}
                editingCardId={editingCardId}
                setEditingCardId={setEditingCardId}
                onDelete={handleDelete}
                onUpdate={onUpdate}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
                onOrderChange={(newOrder) => handleOrderChange(index, newOrder)}
                currentOrder={index}
                totalCards={cards.length}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
