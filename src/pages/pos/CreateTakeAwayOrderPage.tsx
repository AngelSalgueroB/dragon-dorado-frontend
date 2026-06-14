import { Client } from '@stomp/stompjs';
import {
  ImageOff,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreateTakeAwayOrderRequest,
  OrderItemRequest,
  OrderType,
} from '../../actions/orders/orders.interface';
import { getMenu } from '../../actions/products/get-menu';
import { ProductResponse } from '../../actions/products/products.interfaces';
import { connectWebSocket } from '../../config/websocket';

interface CartItem {
  product: ProductResponse;
  quantity: number;
  details: string;
}

export default function CreateTakeAwayOrderPage() {
  const navigate = useNavigate();
  const [wsClient, setWSClient] = useState<Client | null>(null);

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [orderDetails, setOrderDetails] = useState('');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [itemDetailsOpen, setItemDetailsOpen] = useState<number | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const menu = await getMenu();
        setProducts(menu);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    connectWebSocket((client) => {
      setWSClient(client);
    });
  }, []);

  const categories = [
    'ALL',
    ...Array.from(new Set(products.map((p) => p.category.name))),
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(productSearch.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' || p.category.name === selectedCategory;

    return matchesSearch && matchesCategory && p.active;
  });

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.unitPrice * item.quantity,
    0,
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product: ProductResponse) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);

      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }

      return [...prev, { product, quantity: 1, details: '' }];
    });
  }

  function removeFromCart(productId: number) {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (itemDetailsOpen === productId) setItemDetailsOpen(null);
  }

  function updateQuantity(productId: number, delta: number) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === productId
            ? { ...i, quantity: i.quantity + delta }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }

  function updateItemDetails(productId: number, details: string) {
    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, details } : i)),
    );
  }

  function getCartQty(productId: number) {
    return cart.find((i) => i.product.id === productId)?.quantity ?? 0;
  }

  function handleSubmit() {
    if (cart.length === 0 || !wsClient) return;

    setSubmitting(true);
    setError(null);

    const items: OrderItemRequest[] = cart.map((i) => ({
      productId: i.product.id,
      quantity: i.quantity,
      details: i.details || undefined,
    }));

    const request: CreateTakeAwayOrderRequest = {
      orderType: OrderType.TAKEAWAY,
      details: orderDetails || undefined,
      items,
    };

    try {
      wsClient.publish({
        destination: '/app/orders/create',
        body: JSON.stringify(request),
      });
      navigate('/pedidos');
    } catch {
      setError('Error al enviar la orden. Intenta de nuevo.');
      setSubmitting(false);
    }
  }

  const canSubmit = cart.length > 0 && !!wsClient && !submitting;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center animate-pulse">
            <ShoppingBag size={20} className="text-white" />
          </div>
          <p className="text-sm text-gray-400 font-semibold uppercase tracking-widest">
            Cargando…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <ShoppingBag size={17} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900 uppercase tracking-tighter leading-tight">
              Nueva orden · <span className="text-blue-600">Para llevar</span>
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
              Orden sin mesa ni delivery
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200">
          <div className="bg-white border-b border-gray-100 px-4 py-3 space-y-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar producto…"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'ALL' ? 'Todos' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {filteredProducts.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-gray-300 text-sm font-semibold">
                Sin resultados
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredProducts.map((product) => {
                  const qty = getCartQty(product.id);

                  return (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className={`relative text-left rounded-2xl border p-3 transition-all hover:shadow-md active:scale-95 ${
                        qty > 0
                          ? 'border-blue-400 bg-blue-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      {qty > 0 && (
                        <span className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shadow">
                          {qty}
                        </span>
                      )}

                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-24 object-cover rounded-xl mb-2 bg-gray-100"
                        />
                      ) : (
                        <div className="w-full h-24 rounded-xl bg-gray-100 flex items-center justify-center mb-2">
                          <ImageOff size={24} className="text-gray-300" />
                        </div>
                      )}

                      <p className="text-xs font-black text-gray-800 leading-tight line-clamp-2 min-h-[32px]">
                        {product.name}
                      </p>

                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium truncate">
                        {product.category.name}
                      </p>

                      <p className="text-sm font-black text-blue-700 mt-1">
                        S/ {product.unitPrice.toFixed(2)}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <aside className="w-[380px] bg-white flex flex-col flex-shrink-0">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <ShoppingCart size={12} /> Pedido para llevar
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-300 gap-1">
                <ShoppingCart size={28} />
                <p className="text-xs font-semibold">Sin productos</p>
              </div>
            ) : (
              <div className="px-3 py-3 space-y-1.5">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 p-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-5 h-5 rounded-md bg-gray-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="w-5 text-center text-xs font-black text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-5 h-5 rounded-md bg-gray-200 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center transition-colors"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          S/ {item.product.unitPrice.toFixed(2)} c/u
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageOff size={15} className="text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-blue-700">
                          S/{' '}
                          {(item.product.unitPrice * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() =>
                            setItemDetailsOpen(
                              itemDetailsOpen === item.product.id
                                ? null
                                : item.product.id,
                            )
                          }
                          className="text-[10px] text-gray-400 hover:text-gray-600 font-bold transition-colors"
                        >
                          {itemDetailsOpen === item.product.id ? '▲' : '▼'}
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>

                    {itemDetailsOpen === item.product.id && (
                      <div className="px-2 pb-2">
                        <input
                          type="text"
                          placeholder="Notas del ítem"
                          value={item.details}
                          onChange={(e) =>
                            updateItemDetails(item.product.id, e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-400 transition-all placeholder:text-gray-300"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 p-4 space-y-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                Notas de la orden
              </label>
              <textarea
                rows={3}
                placeholder="Ej. cliente recoge en barra, cubiertos, etc."
                value={orderDetails}
                onChange={(e) => setOrderDetails(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none placeholder:text-gray-300"
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-3 space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  {cartCount} producto{cartCount !== 1 ? 's' : ''}
                </span>
                <span>S/ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 border-t border-gray-200 pt-1 mt-1">
                <span>Total</span>
                <span className="text-blue-700">S/ {cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {cart.length === 0 && (
              <p className="text-[10px] text-amber-600 font-bold text-center">
                Agrega al menos un producto
              </p>
            )}
            {!wsClient && (
              <p className="text-[10px] text-amber-600 font-bold text-center">
                Esperando conexión WebSocket
              </p>
            )}
            {error && (
              <p className="text-[10px] text-red-600 font-bold text-center">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`w-full py-3 rounded-xl text-white text-sm font-black uppercase tracking-wide transition-all ${
                canSubmit
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {submitting ? 'Enviando…' : 'Confirmar orden'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
