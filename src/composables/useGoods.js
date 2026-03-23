import { ref } from 'vue'

// Вся логика товаров: CRUD + seed + sync с localStorage.
// Будем хранить данные в одном ключе, чтобы админ-страницы и товары
// работали синхронно между перезагрузками.

const GOODS_KEY = 'beatstars_goods'

const CATEGORIES = [
  'Beat',
  'Drum Kit',
  'Loop Pack',
  'Sample Pack',
  'Melody Loop'
]

function safeJsonParse(raw) {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function hasWindow() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function seedGoods() {
  // 6–8 товаров по умолчанию, разные категории.
  // Поля соответствуют ТЗ: id, title, price, bpm, musicalKey, genre, category,
  // description, image, seller, isExclusive.
  return [
    {
      id: 'g_beat_01',
      title: 'Neon Groove Beat',
      price: 29.99,
      bpm: 128,
      musicalKey: 'F#m',
      genre: 'Hip-Hop',
      category: 'Beat',
      description: 'Готовый beat с драйвовым грувом и плотным low-end.',
      image: 'https://placehold.co/600x600/png?text=Neon+Groove',
      seller: 'SynthLab',
      isExclusive: false
    },
    {
      id: 'g_drumkit_01',
      title: 'Street Drum Kit Pro',
      price: 19.99,
      bpm: 0,
      musicalKey: '—',
      genre: 'Drum & Perc',
      category: 'Drum Kit',
      description: 'Качественные ударные: кик, снипы, томы, hats и fills.',
      image: 'https://placehold.co/600x600/png?text=Street+Drums',
      seller: 'PercWorks',
      isExclusive: false
    },
    {
      id: 'g_loops_01',
      title: 'Summer Loop Pack 2026',
      price: 24.0,
      bpm: 96,
      musicalKey: 'C',
      genre: 'Lo-Fi',
      category: 'Loop Pack',
      description: 'Тёплые лупы для грува: вокал-чопы, перкуссия, басовые текстуры.',
      image: 'https://placehold.co/600x600/png?text=Summer+Loops',
      seller: 'LoFiCartel',
      isExclusive: true
    },
    {
      id: 'g_samples_01',
      title: 'Analog Sample Pack',
      price: 17.5,
      bpm: 110,
      musicalKey: 'Dm',
      genre: 'Electronic',
      category: 'Sample Pack',
      description: 'Аналоговые сэмплы: пачки для синтов, FX и атмосфер.',
      image: 'https://placehold.co/600x600/png?text=Analog+Samples',
      seller: 'TapeTown',
      isExclusive: false
    },
    {
      id: 'g_melody_01',
      title: 'Dark Melody Loops',
      price: 21.99,
      bpm: 124,
      musicalKey: 'Am',
      genre: 'Melodic Rap',
      category: 'Melody Loop',
      description: 'Мелодии с характером: эмоциональные хуки и вариации.',
      image: 'https://placehold.co/600x600/png?text=Dark+Melodies',
      seller: 'KeyFactory',
      isExclusive: true
    },
    {
      id: 'g_beat_02',
      title: 'Velvet Night Beat',
      price: 34.0,
      bpm: 140,
      musicalKey: 'Gm',
      genre: 'R&B',
      category: 'Beat',
      description: 'Плавный R&B beat с сочными струнными и мягкой динамикой.',
      image: 'https://placehold.co/600x600/png?text=Velvet+Night',
      seller: 'VelvetRoom',
      isExclusive: false
    }
  ]
}

function normalizeGood(g) {
  // Небольшая нормализация типов; валидация формы будет позже.
  return {
    id: String(g.id),
    title: String(g.title || ''),
    price: Number(g.price || 0),
    bpm: Number(g.bpm || 0),
    musicalKey: String(g.musicalKey || ''),
    genre: String(g.genre || ''),
    category: String(g.category || CATEGORIES[0]),
    description: String(g.description || ''),
    image: String(g.image || ''),
    seller: String(g.seller || ''),
    isExclusive: Boolean(g.isExclusive)
  }
}

function loadGoodsFromStorage() {
  if (!hasWindow()) return seedGoods().map(normalizeGood)

  const raw = localStorage.getItem(GOODS_KEY)
  const parsed = safeJsonParse(raw)
  if (!Array.isArray(parsed) || parsed.length === 0) {
    const seeded = seedGoods().map(normalizeGood)
    localStorage.setItem(GOODS_KEY, JSON.stringify(seeded))
    return seeded
  }

  return parsed.map(normalizeGood)
}

function saveGoodsToStorage(goods) {
  if (!hasWindow()) return
  localStorage.setItem(GOODS_KEY, JSON.stringify(goods))
}

function genId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return `g_${crypto.randomUUID()}`
  return `g_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

export function useGoods() {
  // Делим состояние между всеми компонентами, чтобы вкладки товара
  // отображали те же данные, и изменения CRUD не расходились.
  if (!hasWindow()) {
    const goods = ref(loadGoodsFromStorage())
    return {
      goods,
      list: () => goods.value,
      getById: (id) => goods.value.find((g) => String(g.id) === String(id)) || null,
      create: (input) => {
        const good = normalizeGood({
          ...input,
          id: input?.id ? String(input.id) : genId()
        })
        goods.value = [good, ...goods.value]
        return good
      },
      update: (id, updates) => {
        const clean = String(id)
        const idx = goods.value.findIndex((g) => String(g.id) === clean)
        if (idx === -1) return null
        const updated = normalizeGood({
          ...goods.value[idx],
          ...updates,
          id: clean
        })
        goods.value = goods.value.map((g) => (String(g.id) === clean ? updated : g))
        return updated
      },
      remove: (id) => {
        const clean = String(id)
        const before = goods.value.length
        goods.value = goods.value.filter((g) => String(g.id) !== clean)
        return goods.value.length !== before
      },
      resetToSeed: () => {
        goods.value = seedGoods().map(normalizeGood)
      }
    }
  }

  // Singleton state for browser
  if (!useGoods._goodsRef) {
    useGoods._goodsRef = ref(loadGoodsFromStorage())
  }

  const goods = useGoods._goodsRef

  function sync() {
    saveGoodsToStorage(goods.value)
  }

  function list() {
    return goods.value
  }

  function getById(id) {
    const clean = String(id)
    return goods.value.find((g) => String(g.id) === clean) || null
  }

  function create(input) {
    const good = normalizeGood({
      ...input,
      id: input?.id ? String(input.id) : genId()
    })
    goods.value = [good, ...goods.value]
    sync()
    return good
  }

  function update(id, updates) {
    const clean = String(id)
    const idx = goods.value.findIndex((g) => String(g.id) === clean)
    if (idx === -1) return null

    const updated = normalizeGood({
      ...goods.value[idx],
      ...updates,
      id: clean
    })

    goods.value = goods.value.map((g) => (String(g.id) === clean ? updated : g))
    sync()
    return updated
  }

  function remove(id) {
    const clean = String(id)
    const before = goods.value.length
    goods.value = goods.value.filter((g) => String(g.id) !== clean)
    const changed = goods.value.length !== before
    if (changed) sync()
    return changed
  }

  function resetToSeed() {
    goods.value = seedGoods().map(normalizeGood)
    sync()
  }

  return {
    goods,
    list,
    getById,
    create,
    update,
    remove,
    resetToSeed
  }
}

// eslint-disable-next-line no-underscore-dangle
useGoods._goodsRef = null

