import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, ShoppingBag, Star, Loader2, User as UserIcon } from 'lucide-react';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AnimatedPage from '../components/AnimatedPage';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const { addToCart } = useCart();
  const { user, token, isAuthenticated } = useAuth();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setProduct(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <AnimatedPage className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-800 border-t-white rounded-full animate-spin" />
      </AnimatedPage>
    );
  }

  if (!product) {
    return (
      <AnimatedPage className="min-h-screen pt-32 px-4 text-center">
        <h2 className="text-2xl font-mono mb-4 text-white">Product not found.</h2>
        <Link to="/" className="text-neutral-400 hover:text-white underline">Return to store</Link>
      </AnimatedPage>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !token || !product) return;
    
    setSubmittingReview(true);
    setReviewError('');
    
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
      });
      
      const data = await res.json();
      if (res.ok) {
        setProduct({
          ...product,
          reviews: [...(product.reviews || []), data]
        });
        setReviewComment('');
        setReviewRating(5);
      } else {
        setReviewError(data.error || 'Failed to submit review');
      }
    } catch (err) {
      setReviewError('Network error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <AnimatedPage className="min-h-screen pt-4 pb-20 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">
      
      {/* Product Section */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start">
        {/* Product Visuals (Left) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full md:w-[50%] lg:w-[55%] relative border border-[#222222] rounded-[32px] overflow-hidden bg-black/40 backdrop-blur-md shadow-2xl mt-8 aspect-square flex items-center justify-center max-h-[600px]"
        >
        <div className="absolute top-8 left-8 z-10 w-full pr-16 flex justify-between">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-[#888888] hover:text-[#E5E5E5] transition-colors mb-4 bg-black/50 px-3 py-1.5 rounded-full border border-[#222222] backdrop-blur-md">
              <ArrowLeft className="w-3 h-3" /> Collection
            </Link>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#666666] mb-2 block font-bold mt-4">Object Ref / {product.id.padStart(4, '0')}</span>
            <div className="h-[1px] w-12 bg-[#333333]"></div>
          </div>
        </div>
        
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 opacity-80"
        />

        <div className="absolute bottom-8 right-8 flex gap-4 z-10">
          <div className="w-12 h-12 border border-[#333] flex items-center justify-center rounded-full text-[#E5E5E5] backdrop-blur-md bg-black/50">
             <span className="text-[10px] font-bold">360°</span>
          </div>
        </div>
      </motion.div>
      
      {/* Product Interaction (Right) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-[50%] lg:w-[45%] flex flex-col py-8 md:py-16 sticky top-24"
      >
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.4em] text-[#666666] font-semibold">{product.category}</h2>
              <span className="text-[#666666] text-[12px] italic">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-light tracking-tight mb-6">
              {product.name}
            </h1>
            <p className="text-[#888888] text-sm leading-relaxed max-w-[360px]">
              {product.description}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-y border-[#222222] py-8">
              <span className="text-4xl font-light">${product.price.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2">
               <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`h-14 rounded-full font-bold uppercase text-[11px] tracking-[0.2em] flex items-center justify-center transition-all ${
                    !product.inStock 
                      ? 'bg-[#111111] text-[#444444] border border-[#222222] cursor-not-allowed'
                      : added
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-black hover:bg-neutral-200 active:scale-[0.99]'
                  }`}
                >
                  {!product.inStock ? 'Out of Stock' : added ? 'Added to Cart' : 'Add to Cart'}
                </button>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 border-t border-[#222222] pt-8 text-[11px] uppercase tracking-widest text-[#666666]">
          <div>
            <span className="block mb-1 text-white">Shipping</span>
            <span className="text-[#888888] tracking-normal">Free dispatch</span>
          </div>
          <div>
            <span className="block mb-1 text-white">Returns</span>
            <span className="text-[#888888] tracking-normal">30-day hassle-free</span>
          </div>
        </div>
      </motion.div>
      </div>

      {/* Reviews Section */}
      <div className="mt-24 md:mt-32 max-w-4xl pt-16 border-t border-[#222222]">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-2xl font-light tracking-tight text-white">Reviews</h3>
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#666666]">{product.reviews?.length || 0} REVIEWS</span>
        </div>
        
        {isAuthenticated ? (
          <form onSubmit={submitReview} className="mb-16 bg-black/40 backdrop-blur-md p-8 border border-[#222222] rounded-3xl">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-white mb-6">Write a review</h4>
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className={`p-1 transition-colors ${star <= reviewRating ? 'text-white' : 'text-[#333333]'}`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
            
            <textarea 
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              className="w-full h-32 bg-[#111111] border border-[#222222] rounded-2xl p-4 text-white placeholder-[#666666] focus:outline-none focus:border-[#444444] transition-all resize-none mb-4"
              required
            />
            {reviewError && <p className="text-red-500 text-xs tracking-wide mb-4">{reviewError}</p>}
            
            <button
              type="submit"
              disabled={submittingReview}
              className="px-8 h-12 bg-white text-black hover:bg-neutral-200 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submittingReview ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting</> : "Submit Review"}
            </button>
          </form>
        ) : (
          <div className="mb-16 bg-black/40 backdrop-blur-md p-8 border border-[#222222] rounded-3xl flex flex-col items-center justify-center text-center">
            <span className="text-[#888888] mb-4 text-sm">Please sign in to write a review for {product.name}.</span>
            <Link to="/auth" className="px-6 h-10 bg-white text-black rounded-full text-[10px] uppercase tracking-[0.2em] font-bold flex items-center justify-center hover:bg-neutral-200 transition-colors">
              Sign In
            </Link>
          </div>
        )}

        <div className="space-y-8 mb-20">
          {!product.reviews || product.reviews.length === 0 ? (
            <p className="text-[#666666] text-sm italic">No reviews yet.</p>
          ) : (
            product.reviews.map((review) => (
              <div key={review.id} className="border-b border-[#222222] pb-8 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-[#666666] border border-[#222222]">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[12px] font-bold text-white uppercase tracking-wider">{review.userName}</span>
                      <span className="block text-[10px] text-[#666666] uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-white fill-white' : 'text-[#333333] fill-[#333333]'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-[#BBBBBB] text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

    </AnimatedPage>
  );
}
