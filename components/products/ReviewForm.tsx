'use client';

import { useState, useRef, useCallback } from 'react';
import { Star, Upload, X, ImageIcon, CheckCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

type Props = {
  productId: string;
  productName: string;
  onReviewSubmitted?: () => void;
};

export default function ReviewForm({ productId, productName, onReviewSubmitted }: Props) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [quote, setQuote] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 5;

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    const validImages = arr.filter((f) => f.type.startsWith('image/'));
    const remaining = MAX_IMAGES - images.length;
    const toAdd = validImages.slice(0, remaining);

    if (toAdd.length === 0) return;

    setImages((prev) => [...prev, ...toAdd]);
    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, [images.length]);

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return toast.error('Please select a rating');
    if (!quote.trim()) return toast.error('Please write your review');
    if (quote.trim().length < 20) return toast.error('Review must be at least 20 characters');

    setSubmitting(true);
    try {
      // 1. Upload images first
      let imageUrls: string[] = [];
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append('files', img));
        const uploadRes = await fetch('/api/reviews/upload', {
          method: 'POST',
          body: formData,
        });
        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.error || 'Image upload failed');
        }
        const uploadData = await uploadRes.json();
        imageUrls = uploadData.urls || [];
      }

      // 2. Submit review
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, quote: quote.trim(), images: imageUrls }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit review');
      }

      setSubmitted(true);
      toast.success('Review submitted! Thank you.');
      onReviewSubmitted?.();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircle className="text-primary" size={48} strokeWidth={1.5} />
        <h3 className="font-headline text-2xl text-primary italic">Thank you for your review!</h3>
        <p className="text-on-surface-variant text-sm">Your experience helps others make informed choices.</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-10 space-y-4">
        <p className="text-on-surface-variant">Sign in to share your experience with {productName}.</p>
        <Link
          href={`/signin?callbackUrl=/product/${productId}`}
          className="inline-block bg-primary text-on-primary px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Sign in to Review
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="font-headline text-2xl text-primary italic">Write a Review</h3>

      {/* Star Rating */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          Your Rating *
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={`transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-on-surface-variant/30'
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-xs text-primary">
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </p>
        )}
      </div>

      {/* Review Text */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          Your Review *
        </label>
        <textarea
          className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 resize-none focus:outline-none focus:border-primary/50 transition-colors"
          placeholder={`Share your experience with ${productName}...`}
          rows={4}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          minLength={20}
          maxLength={1000}
        />
        <p className="text-xs text-on-surface-variant/60 text-right">{quote.length}/1000</p>
      </div>

      {/* Image Upload */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          Add Photos (up to {MAX_IMAGES})
        </label>

        {/* Previews */}
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {previews.map((src, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-outline-variant/20">
                <Image src={src} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white hover:bg-black/80 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Drop Zone */}
        {images.length < MAX_IMAGES && (
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-low'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="mx-auto mb-2 text-on-surface-variant/40" size={24} />
            <p className="text-xs text-on-surface-variant">
              Drag & drop photos here, or <span className="text-primary font-medium">click to browse</span>
            </p>
            <p className="text-[11px] text-on-surface-variant/50 mt-1">JPG, PNG up to 5MB each</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || !rating || !quote.trim()}
        className="w-full bg-primary text-on-primary py-4 rounded-xl font-semibold uppercase tracking-widest text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-on-primary/40 border-t-on-primary rounded-full animate-spin" />
            Submitting…
          </>
        ) : (
          'Submit Review'
        )}
      </button>
    </form>
  );
}
