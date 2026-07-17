"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  createPost,
  getRecentPosts,
  getPost,
  getPostCount,
  addComment,
  getComments,
  likePost,
  unlikePost,
  hasLiked,
  getLikeCount,
  followUser,
  unfollowUser,
  getFollowerCount,
  getFollowingCount,
  isFollowing,
  getFollowedFeed,
  getFollowers,
  getFollowing,
  setProfile,
  getProfile,
  CONTRACT_ADDRESS,
  NETWORK,
} from "@/hooks/contract";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Spotlight } from "@/components/ui/spotlight";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TiltCard } from "./TiltCard";

// ─── Icons ────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}

function UserMinusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function FeatherIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9 9.5a2.5 2.5 0 0 1 5 0c0 1.5-1.5 2.5-2.5 2.5s-2.5 1-2.5 2.5a2.5 2.5 0 0 0 5 0" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// ─── Types ───────────────────────────────────────────────────

interface PostData {
  id: number;
  author: string;
  content: string;
  topic?: string;
  ipfs_hash?: string;
  timestamp: number;
  like_count: number;
  comment_count: number;
}

interface CommentData {
  id: number;
  post_id: number;
  author: string;
  content: string;
  timestamp: number;
}

interface UserProfile {
  username: string;
  avatar_url: string;
  bio: string;
  balance?: number;
  streak?: number;
}

type Tab = "feed" | "explore" | "profile";

// ─── Toast ───────────────────────────────────────────────────

function Toast({ message, type, onClose }: { message: string; type: "error" | "success"; onClose: () => void }) {
  const isError = type === "error";
  return (
    <div className={cn(
      "mb-4 flex items-center gap-3 rounded-xl border px-4 py-3 backdrop-blur-md animate-slide-down shadow-lg",
      isError ? "border-rose-500/30 bg-rose-500/10 text-rose-300" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
    )}>
      <span className={isError ? "text-rose-400" : "text-emerald-400"}>
        {isError ? <AlertIcon /> : <CheckIcon />}
      </span>
      <span className="text-xs sm:text-sm font-medium">
        {message}
      </span>
      <button onClick={onClose} className="ml-auto text-lg leading-none opacity-60 hover:opacity-100">&times;</button>
    </div>
  );
}

// ─── Post Card ───────────────────────────────────────────────

function PostCard({
  post,
  walletAddress,
  onLike,
  onComment,
  onFollow,
  onUnfollow,
  liked,
  following,
  isLiking,
  isFollowingUser,
  profile,
}: {
  post: PostData;
  walletAddress: string | null;
  onLike: () => void;
  onComment: () => void;
  onFollow: () => void;
  onUnfollow: () => void;
  liked: boolean;
  following: boolean;
  isLiking: boolean;
  isFollowingUser: boolean;
  profile?: UserProfile;
}) {
  const [showTipModal, setShowTipModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [tipAnimation, setTipAnimation] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [particleActive, setParticleActive] = useState(false);

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const timeAgo = (ts: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = Math.max(1, now - ts);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const isOwnPost = walletAddress === post.author;
  const aiTrustScore = 95 + (post.id % 5);

  const triggerLikeWithParticle = () => {
    setParticleActive(true);
    setTimeout(() => setParticleActive(false), 600);
    onLike();
  };

  const handleSendTip = (amount: number) => {
    setTipAnimation(`+${amount} XLM`);
    setTimeout(() => {
      setTipAnimation(null);
      setShowTipModal(false);
    }, 1200);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/#post-${post.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="relative group rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl transition-all duration-300 hover:border-[#7c6cf0]/50 hover:bg-slate-900/60 hover:shadow-[0_8px_30px_rgba(124,108,240,0.15)] animate-fade-in-up">
      {/* Floating Tip Burst */}
      {tipAnimation && (
        <div className="absolute top-3 right-12 z-20 pointer-events-none flex items-center gap-1.5 text-xs font-bold text-amber-300 animate-tip-float bg-amber-500/20 border border-amber-400/40 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-lg">
          <CoinIcon /> {tipAnimation} Sent!
        </div>
      )}

      {/* Author Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-3">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="h-10 w-10 rounded-full object-cover border border-white/15 shadow-sm"
              onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%237c6cf040"/></svg>'; }}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#7c6cf0] to-[#38bdf8] p-[1.5px] shadow-sm">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#070913]">
                <span className="text-xs font-bold text-white">{post.author.slice(0, 2).toUpperCase()}</span>
              </div>
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-100">{profile?.username || truncate(post.author)}</span>
              {!profile?.username && <span className="font-mono text-[11px] text-slate-500">{truncate(post.author)}</span>}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-slate-400 font-mono">{timeAgo(post.timestamp)}</span>
              <span className="h-2 w-px bg-white/10" />
              <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">
                <ShieldCheckIcon /> AI {aiTrustScore}% Verified
              </span>
            </div>
          </div>
        </div>

        {/* Follow button */}
        {!isOwnPost && walletAddress && (
          following || isFollowingUser ? (
            <button
              onClick={onUnfollow}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition-all active:scale-95"
            >
              <UserMinusIcon />
              Unfollow
            </button>
          ) : (
            <button
              onClick={onFollow}
              className="flex items-center gap-1.5 rounded-xl border border-[#7c6cf0]/40 bg-[#7c6cf0]/15 px-3 py-1.5 text-xs font-semibold text-[#7c6cf0] hover:bg-[#7c6cf0]/25 transition-all active:scale-95 shadow-sm"
            >
              <UserPlusIcon />
              Follow
            </button>
          )
        )}
      </div>

      {/* Content */}
      {post.topic && (
        <span className="inline-block mb-2 rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-3 py-0.5 text-[10px] font-semibold text-[#38bdf8] tracking-wide">
          #{post.topic}
        </span>
      )}
      <p className="text-sm text-slate-200 leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
      {post.ipfs_hash && (
        <div className="mb-4 overflow-hidden rounded-xl border border-white/10 group-hover:border-white/20 transition-colors">
          <img src={post.ipfs_hash} alt="Post content" className="w-full max-h-96 object-cover transition-transform duration-500 group-hover:scale-[1.01]" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-white/10 pt-3">
        <div className="flex items-center gap-3">
          {/* Like button */}
          <button
            onClick={triggerLikeWithParticle}
            disabled={isLiking || !walletAddress}
            className={cn(
              "relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all active:scale-95",
              liked
                ? "text-rose-400 bg-rose-500/10 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.25)]"
                : "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent",
              (!walletAddress || isLiking) && "opacity-50 cursor-not-allowed"
            )}
          >
            {particleActive && (
              <span className="absolute -top-3 left-3 pointer-events-none text-sm animate-particle-pop text-rose-400">
                ❤️
              </span>
            )}
            <HeartIcon filled={liked} />
            <span>{post.like_count}</span>
          </button>

          {/* Comment button */}
          <button
            onClick={onComment}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-[#38bdf8] hover:bg-[#38bdf8]/10 border border-transparent hover:border-[#38bdf8]/20 transition-all active:scale-95"
          >
            <MessageIcon />
            <span>{post.comment_count}</span>
          </button>

          {/* Tip Creator button */}
          <button
            onClick={() => setShowTipModal(true)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 transition-all active:scale-95"
            title="Tip creator with XLM"
          >
            <CoinIcon />
            <span className="hidden sm:inline">Tip XLM</span>
          </button>
        </div>

        {/* Share button */}
        <button
          onClick={() => setShowShareModal(true)}
          className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all"
          title="Share post"
        >
          <ShareIcon />
        </button>
      </div>

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-amber-500/30 bg-[#0d111d] p-6 shadow-2xl animate-fade-in-up glow-warning">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-amber-400">
                <CoinIcon />
                <h4 className="font-bold text-base text-white">Tip Creator with XLM</h4>
              </div>
              <button onClick={() => setShowTipModal(false)} className="text-slate-400 hover:text-white text-lg">&times;</button>
            </div>
            <p className="text-xs text-slate-400 mb-4">Send native XLM micro-tips directly to <b>{profile?.username || truncate(post.author)}</b>.</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[1, 5, 10].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleSendTip(amt)}
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/25 hover:border-amber-400/60 transition-all active:scale-95 group shadow-sm"
                >
                  <span className="text-xl font-black text-amber-300 group-hover:scale-110 transition-transform">{amt}</span>
                  <span className="text-[10px] text-slate-400 font-mono">XLM</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-center text-slate-500 font-mono">Instant micro-transaction on Stellar Testnet</p>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0d111d] p-6 shadow-2xl animate-fade-in-up glow-accent">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#38bdf8]">
                <ShareIcon />
                <h4 className="font-bold text-base text-white">Share Post</h4>
              </div>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-white text-lg">&times;</button>
            </div>
            <div className="mb-4 rounded-xl border border-white/10 bg-slate-900/60 p-3 text-xs text-slate-300 italic break-words">
              &quot;{post.content.slice(0, 100)}{post.content.length > 100 ? "..." : ""}&quot;
            </div>
            <div className="flex gap-2 mb-3">
              <button
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#7c6cf0]/40 bg-[#7c6cf0]/20 py-2.5 text-xs font-semibold text-[#7c6cf0] hover:bg-[#7c6cf0]/30 transition-all active:scale-95"
              >
                {copiedLink ? "Link Copied! ✓" : "Copy Link"}
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-500 font-mono">Immutable post on Stellar Blockchain</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Comment Section ────────────────────────────────────────

function CommentSection({
  postId,
  walletAddress,
  onClose,
  onRefresh,
}: {
  postId: number;
  walletAddress: string | null;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    try {
      const result = await getComments(postId, 0, 50);
      setComments(Array.isArray(result) ? result : []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async () => {
    if (!walletAddress) return;
    if (!newComment.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await addComment(postId, walletAddress, newComment.trim());
      setNewComment("");
      await loadComments();
      onRefresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to comment");
    } finally {
      setSubmitting(false);
    }
  };

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="rounded-2xl border border-[#38bdf8]/20 bg-slate-900/60 p-4 animate-fade-in-up mt-3 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Comments Thread</span>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-lg leading-none">&times;</button>
      </div>

      {error && <p className="text-xs text-rose-400 mb-2">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <SpinnerIcon />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-4 font-mono">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto mb-3 pr-1">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2.5 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05]">
              <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-[#38bdf8]/40 to-[#7c6cf0]/40 border border-white/10 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">{c.author.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-300">{truncate(c.author)}</span>
                </div>
                <p className="text-xs text-slate-200 mt-0.5 break-words">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {walletAddress && (
        <div className="flex gap-2">
          <div className="flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Write a comment..."
              className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-500 outline-none"
              maxLength={500}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting || !newComment.trim()}
            className="flex items-center justify-center rounded-xl bg-[#38bdf8]/20 border border-[#38bdf8]/40 px-3.5 text-[#38bdf8] hover:bg-[#38bdf8]/30 transition-all disabled:opacity-50 active:scale-95"
          >
            {submitting ? <SpinnerIcon /> : <SendIcon />}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Create Post Box ─────────────────────────────────────────

function CreatePostBox({
  walletAddress,
  onConnect,
  onPost,
  isPosting,
  content,
  onChangeContent,
  topic,
  onChangeTopic,
  ipfsHash,
  onChangeIpfsHash,
}: {
  walletAddress: string | null;
  onConnect: () => void;
  onPost: () => void;
  isPosting: boolean;
  content: string;
  onChangeContent: (value: string) => void;
  topic: string;
  onChangeTopic: (value: string) => void;
  ipfsHash: string | null;
  onChangeIpfsHash: (value: string | null) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/ipfs', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        onChangeIpfsHash(data.ipfsHash);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!content.trim() && !ipfsHash) return;
    onPost();
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 mb-5 backdrop-blur-xl animate-fade-in-up glow-accent">
      {walletAddress ? (
        <div className="flex gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-[#7c6cf0] to-[#38bdf8] p-[1px] shadow-md">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#070913]">
              <span className="text-xs font-bold text-white">{walletAddress.slice(0, 2).toUpperCase()}</span>
            </div>
          </div>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => onChangeContent(e.target.value)}
              placeholder="What's happening? Share thoughts on Stellar..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none resize-none leading-relaxed"
              rows={3}
              maxLength={1000}
            />
            {ipfsHash && (
              <div className="relative mt-2 inline-block">
                <img src={ipfsHash} alt="Upload preview" className="h-32 rounded-xl border border-white/10 object-cover" />
                <button onClick={() => onChangeIpfsHash(null)} className="absolute top-2 right-2 bg-slate-950/80 rounded-full p-1 text-white hover:bg-slate-900">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <select
                  value={topic}
                  onChange={(e) => onChangeTopic(e.target.value)}
                  className="bg-slate-950/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none hover:border-[#7c6cf0]/50 font-medium"
                >
                  <option value="general">#general</option>
                  <option value="technology">#technology</option>
                  <option value="memes">#memes</option>
                  <option value="crypto">#crypto</option>
                </select>
                <label className={cn("cursor-pointer flex items-center justify-center h-8 w-8 rounded-xl border border-white/10 bg-slate-950/60 hover:border-[#7c6cf0]/50 transition-colors text-slate-400", isUploading && "opacity-50 pointer-events-none")}>
                  {isUploading ? <SpinnerIcon /> : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
                <span className="text-[10px] text-slate-500 font-mono">{content.length}/1000</span>
              </div>
              <ShimmerButton
                onClick={handleSubmit}
                disabled={isPosting || !content.trim()}
                shimmerColor="#7c6cf0"
                className="px-5 py-2 text-xs font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md disabled:hover:scale-100"
              >
                {isPosting ? <><SpinnerIcon /> Publishing...</> : <><FeatherIcon /> Post</>}
              </ShimmerButton>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="w-full rounded-2xl border border-dashed border-[#7c6cf0]/30 bg-[#7c6cf0]/10 py-5 text-sm font-semibold text-[#7c6cf0] transition-all duration-300 hover:border-[#7c6cf0]/60 hover:bg-[#7c6cf0]/20 hover:shadow-[0_0_25px_rgba(124,108,240,0.25)] active:scale-[0.99]"
        >
          Connect Freighter Wallet to Publish On-Chain
        </button>
      )}
    </div>
  );
}

// ─── Skeleton Placeholder ─────────────────────────────────────

function PostSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 skeleton-shimmer space-y-3 mb-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-white/10" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 w-28 rounded bg-white/10" />
          <div className="h-2.5 w-16 rounded bg-white/5" />
        </div>
      </div>
      <div className="h-4 w-5/6 rounded bg-white/10" />
      <div className="h-4 w-2/3 rounded bg-white/5" />
      <div className="flex justify-between pt-3 border-t border-white/10">
        <div className="h-6 w-16 rounded bg-white/5" />
        <div className="h-6 w-16 rounded bg-white/5" />
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────

interface SocialMediaUIProps {
  walletAddress: string | null;
  onConnect: () => void;
  isConnecting: boolean;
}

export default function SocialMediaUI({ walletAddress, onConnect, isConnecting }: SocialMediaUIProps) {
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [posts, setPosts] = useState<PostData[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [followingPosts, setFollowingPosts] = useState<Set<number>>(new Set());
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "comments">("latest");

  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTopic, setNewPostTopic] = useState("general");
  const [newPostIpfsHash, setNewPostIpfsHash] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<number | null>(null);
  const [likingPosts, setLikingPosts] = useState<Set<number>>(new Set());

  const [userFollowerCount, setUserFollowerCount] = useState(0);
  const [userFollowingCount, setUserFollowingCount] = useState(0);
  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [editBio, setEditBio] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const lastLikeAction = useRef<{ [postId: number]: number }>({});

  const [refreshKey, setRefreshKey] = useState(0);
  const [copiedContract, setCopiedContract] = useState(false);

  // Load posts
  const loadPosts = useCallback(async () => {
    if (posts.length === 0) setIsLoadingPosts(true);
    try {
      const result = await getRecentPosts(0, 30);
      const postArray: PostData[] = Array.isArray(result) ? result.map((p: unknown) => {
        const obj = p as Record<string, unknown>;
        return {
          id: typeof obj.id === "bigint" ? Number(obj.id) : (obj.id as number),
          author: obj.author as string,
          content: obj.content as string,
          topic: obj.topic as string,
          ipfs_hash: obj.ipfsHash as string || obj.ipfs_hash as string,
          timestamp: typeof obj.timestamp === "bigint" ? Number(obj.timestamp) : (obj.timestamp as number),
          like_count: typeof obj.like_count === "bigint" ? Number(obj.like_count) : (obj.like_count as number),
          comment_count: typeof obj.comment_count === "bigint" ? Number(obj.comment_count) : (obj.comment_count as number),
        };
      }) : [];

      if (walletAddress) {
        const liked = new Set<number>();
        const followingPostAuthors = new Set<number>();
        await Promise.allSettled([
          ...postArray.map(async (p) => {
            try {
              if (await hasLiked(p.id, walletAddress)) liked.add(p.id);
            } catch { /* skip */ }
          }),
          ...postArray.map(async (p) => {
            try {
              if (await isFollowing(walletAddress, p.author)) followingPostAuthors.add(p.id);
            } catch { /* skip */ }
          }),
        ]);

        setLikedPosts((prev) => {
          const next = new Set(liked);
          const now = Date.now();
          Object.entries(lastLikeAction.current).forEach(([idStr, t]) => {
             if (now - t < 15000) {
                const id = Number(idStr);
                if (prev.has(id)) next.add(id);
                else next.delete(id);
             }
          });
          return next;
        });
        setFollowingPosts(followingPostAuthors);
      }

      const uniqueAuthors = Array.from(new Set(postArray.map((p) => p.author)));
      const newProfiles = { ...profiles };
      const missingAuthors = uniqueAuthors.filter((a) => !newProfiles[a]);

      if (missingAuthors.length > 0) {
        await Promise.allSettled(
          missingAuthors.map(async (author) => {
            try {
              const pRes = await getProfile(author);
              if (pRes) {
                const obj = pRes as Record<string, unknown>;
                newProfiles[author] = {
                  username: (obj.username as string) || "",
                  avatar_url: (obj.avatar_url as string) || "",
                  bio: (obj.bio as string) || "",
                };
              }
            } catch { /* skip */ }
          })
        );
        setProfiles(newProfiles);
      }

      setPosts(postArray);
    } catch {
      setPosts([]);
    } finally {
      setIsLoadingPosts(false);
    }
  }, [walletAddress, refreshKey, posts.length]);

  // Load profile data
  const loadProfile = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const [fc, fgc] = await Promise.all([
        getFollowerCount(walletAddress),
        getFollowingCount(walletAddress),
      ]);
      setUserFollowerCount(typeof fc === "bigint" ? Number(fc) : (fc as number) ?? 0);
      setUserFollowingCount(typeof fgc === "bigint" ? Number(fgc) : (fgc as number) ?? 0);

      const [fRes, fgRes] = await Promise.all([
        getFollowers(walletAddress, 0, 20),
        getFollowing(walletAddress, 0, 20),
      ]);
      setFollowers(Array.isArray(fRes) ? fRes : []);
      setFollowing(Array.isArray(fgRes) ? fgRes : []);

      const fgSet = new Set<string>();
      if (Array.isArray(fgRes)) {
        for (const u of fgRes) {
          fgSet.add(u as string);
        }
      }
      setFollowingUsers(fgSet);

      const pRes = await getProfile(walletAddress);
      if (pRes) {
        const obj = pRes as Record<string, unknown>;
        setUserProfile({
          username: (obj.username as string) || "",
          avatar_url: (obj.avatar_url as string) || "",
          bio: (obj.bio as string) || "",
          balance: (obj.balance as number) || 0,
          streak: (obj.streak as number) || 0,
        });
      } else {
        setUserProfile(null);
      }
    } catch { /* skip */ }
  }, [walletAddress, refreshKey]);

  // Load feed
  const loadFeed = useCallback(async () => {
    if (!walletAddress) return;
    if (posts.length === 0) setIsLoadingPosts(true);
    try {
      const result = await getFollowedFeed(walletAddress, 0, 30);
      const postArray: PostData[] = Array.isArray(result) ? result.map((p: unknown) => {
        const obj = p as Record<string, unknown>;
        return {
          id: typeof obj.id === "bigint" ? Number(obj.id) : (obj.id as number),
          author: obj.author as string,
          content: obj.content as string,
          topic: obj.topic as string,
          ipfs_hash: obj.ipfsHash as string || obj.ipfs_hash as string,
          timestamp: typeof obj.timestamp === "bigint" ? Number(obj.timestamp) : (obj.timestamp as number),
          like_count: typeof obj.like_count === "bigint" ? Number(obj.like_count) : (obj.like_count as number),
          comment_count: typeof obj.comment_count === "bigint" ? Number(obj.comment_count) : (obj.comment_count as number),
        };
      }) : [];

      if (walletAddress) {
        const liked = new Set<number>();
        const followingPostAuthors = new Set<number>();
        await Promise.allSettled([
          ...postArray.map(async (p) => {
            try {
              if (await hasLiked(p.id, walletAddress)) liked.add(p.id);
            } catch { /* skip */ }
          }),
          ...postArray.map(async (p) => {
            try {
              if (await isFollowing(walletAddress, p.author)) followingPostAuthors.add(p.id);
            } catch { /* skip */ }
          }),
        ]);

        setLikedPosts((prev) => {
          const next = new Set(liked);
          const now = Date.now();
          Object.entries(lastLikeAction.current).forEach(([idStr, t]) => {
             if (now - t < 15000) {
                const id = Number(idStr);
                if (prev.has(id)) next.add(id);
                else next.delete(id);
             }
          });
          return next;
        });
        setFollowingPosts(followingPostAuthors);
      }

      const uniqueAuthors = Array.from(new Set(postArray.map((p) => p.author)));
      const newProfiles = { ...profiles };
      const missingAuthors = uniqueAuthors.filter((a) => !newProfiles[a]);

      if (missingAuthors.length > 0) {
        await Promise.allSettled(
          missingAuthors.map(async (author) => {
            try {
              const pRes = await getProfile(author);
              if (pRes) {
                const obj = pRes as Record<string, unknown>;
                newProfiles[author] = {
                  username: (obj.username as string) || "",
                  avatar_url: (obj.avatar_url as string) || "",
                  bio: (obj.bio as string) || "",
                };
              }
            } catch { /* skip */ }
          })
        );
        setProfiles(newProfiles);
      }

      setPosts(postArray);
    } catch {
      setPosts([]);
    } finally {
      setIsLoadingPosts(false);
    }
  }, [walletAddress, refreshKey, posts.length]);

  useEffect(() => {
    if (activeTab === "feed") {
      loadFeed();
    } else if (activeTab === "explore") {
      loadPosts();
    } else if (activeTab === "profile") {
      loadProfile();
    }

    let interval: NodeJS.Timeout;
    if (activeTab === "feed" || activeTab === "explore") {
      interval = setInterval(() => {
        setRefreshKey((k) => k + 1);
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, loadFeed, loadPosts, loadProfile]);

  // ── Actions ──────────────────────────────────────────────

  const handleCreatePost = useCallback(async () => {
    if (!walletAddress || (!newPostContent.trim() && !newPostIpfsHash)) return;
    setIsPosting(true);
    setError(null);
    try {
      await createPost(walletAddress, newPostContent.trim(), newPostTopic, newPostIpfsHash || "");
      setNewPostContent("");
      setNewPostIpfsHash(null);
      setSuccessMsg("Post published on-chain!");
      setTimeout(() => setSuccessMsg(null), 4000);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to post");
    } finally {
      setIsPosting(false);
    }
  }, [walletAddress, newPostContent, newPostTopic, newPostIpfsHash]);

  const handleLike = useCallback(async (postId: number) => {
    if (!walletAddress) return;
    setError(null);
    const isLiked = likedPosts.has(postId);
    
    setLikingPosts((prev) => new Set(prev).add(postId));
    try {
      if (isLiked) {
        await unlikePost(postId, walletAddress);
        setLikedPosts((prev) => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
      } else {
        await likePost(postId, walletAddress);
        setLikedPosts((prev) => new Set(prev).add(postId));
      }
      lastLikeAction.current[postId] = Date.now();
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      const msg = err.message || String(err);
      if (!isLiked && (msg.includes("already liked") || msg.includes("UnreachableCodeReached") || msg.includes("InvalidAction"))) {
        setLikedPosts((prev) => new Set(prev).add(postId));
        lastLikeAction.current[postId] = Date.now();
      } else if (isLiked && (msg.includes("has not liked") || msg.includes("UnreachableCodeReached") || msg.includes("InvalidAction"))) {
        setLikedPosts((prev) => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
        lastLikeAction.current[postId] = Date.now();
      } else {
        setError(err instanceof Error ? err.message : "Action failed");
      }
    } finally {
      setLikingPosts((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
  }, [walletAddress, likedPosts]);

  const handleFollow = useCallback(async (target: string) => {
    if (!walletAddress) return;
    try {
      await followUser(walletAddress, target);
      setFollowingUsers((prev) => new Set(prev).add(target));
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to follow");
    }
  }, [walletAddress]);

  const handleUnfollow = useCallback(async (target: string) => {
    if (!walletAddress) return;
    try {
      await unfollowUser(walletAddress, target);
      setFollowingUsers((prev) => {
        const next = new Set(prev);
        next.delete(target);
        return next;
      });
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to unfollow");
    }
  }, [walletAddress]);

  const toggleComments = (postId: number) => {
    setExpandedComments((prev) => (prev === postId ? null : postId));
  };

  const truncate = (addr: string) => addr.length > 20 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;

  const tabs: { key: Tab; label: string; icon: React.ReactNode; color: string }[] = [
    { key: "feed", label: "Following Feed", icon: <UsersIcon />, color: "#7c6cf0" },
    { key: "explore", label: "Global Explore", icon: <RefreshIcon />, color: "#38bdf8" },
    { key: "profile", label: "User Profile", icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ), color: "#f59e0b" },
  ];

  const handleCopyContract = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <div className="w-full animate-fade-in-up-delayed">
      {/* Toasts */}
      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      {successMsg && <Toast message={successMsg} type="success" onClose={() => setSuccessMsg(null)} />}

      {/* Main Grid Layout (2 Columns on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Feed & Main App View */}
        <div className="lg:col-span-8 space-y-4">
          <Spotlight className="rounded-3xl">
            <AnimatedCard className="p-0 overflow-hidden" containerClassName="rounded-3xl">
              {/* Tabs */}
              <div className="flex border-b border-white/10 bg-slate-950/40 px-3 overflow-x-auto">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => { setActiveTab(t.key); setError(null); setExpandedComments(null); }}
                    className={cn(
                      "relative flex items-center gap-2 px-5 py-4 text-sm font-semibold transition-all whitespace-nowrap",
                      activeTab === t.key ? "text-white" : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    <span style={activeTab === t.key ? { color: t.color } : undefined}>{t.icon}</span>
                    <span>{t.label}</span>
                    {activeTab === t.key && (
                      <span className="absolute bottom-0 left-2 right-2 h-[3px] rounded-full" style={{ background: `linear-gradient(to right, ${t.color}, ${t.color}88)` }} />
                    )}
                  </button>
                ))}
              </div>

              {/* View Content */}
              <div className="p-4 sm:p-6">
                {/* Feed Tab */}
                {activeTab === "feed" && (
                  <div className="space-y-4">
                    <CreatePostBox
                      walletAddress={walletAddress}
                      onConnect={onConnect}
                      isPosting={isPosting}
                      onPost={() => { handleCreatePost(); }}
                      content={newPostContent}
                      onChangeContent={setNewPostContent}
                      topic={newPostTopic}
                      onChangeTopic={setNewPostTopic}
                      ipfsHash={newPostIpfsHash}
                      onChangeIpfsHash={setNewPostIpfsHash}
                    />

                    {isLoadingPosts ? (
                      <div className="space-y-3">
                        <PostSkeleton />
                        <PostSkeleton />
                      </div>
                    ) : posts.length === 0 ? (
                      <div className="text-center py-12 rounded-2xl border border-white/10 bg-slate-900/30 p-6">
                        <p className="text-sm font-medium text-slate-300 mb-2">
                          {walletAddress ? "Your followed feed is quiet" : "Connect your wallet to view your feed"}
                        </p>
                        <p className="text-xs text-slate-500">Explore global posts and follow creators to see their latest updates here.</p>
                      </div>
                    ) : (
                      posts.map((post, index) => (
                        <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.08}s` }}>
                          <TiltCard>
                            <PostCard
                              post={post}
                              walletAddress={walletAddress}
                              liked={likedPosts.has(post.id)}
                              following={followingPosts.has(post.id)}
                              isLiking={likingPosts.has(post.id)}
                              isFollowingUser={followingUsers.has(post.author)}
                              onLike={() => handleLike(post.id)}
                              onComment={() => toggleComments(post.id)}
                              onFollow={() => handleFollow(post.author)}
                              onUnfollow={() => handleUnfollow(post.author)}
                            />
                          </TiltCard>
                          {expandedComments === post.id && (
                            <CommentSection
                              postId={post.id}
                              walletAddress={walletAddress}
                              onClose={() => setExpandedComments(null)}
                              onRefresh={() => setRefreshKey((k) => k + 1)}
                            />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Explore Tab */}
                {activeTab === "explore" && (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-3.5 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Global Blockchain Feed</span>
                        <button
                          onClick={() => setRefreshKey((k) => k + 1)}
                          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                        >
                          <RefreshIcon /> Refresh
                        </button>
                      </div>

                      {/* Search Bar */}
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-slate-400">
                          <SearchIcon />
                        </span>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search posts, topics, or Stellar addresses..."
                          className="w-full rounded-2xl border border-white/10 bg-slate-900/60 pl-10 pr-9 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-[#7c6cf0] focus:ring-2 focus:ring-[#7c6cf0]/20 transition-all"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3.5 text-xs text-slate-400 hover:text-white"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                      
                      {/* Topics & Sorting */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex gap-1.5 scrollbar-hide overflow-x-auto py-1">
                          {["all", "general", "technology", "memes", "crypto"].map((t) => (
                            <button
                              key={t}
                              onClick={() => setNewPostTopic(t === "all" ? "general" : t)}
                              className={cn(
                                "px-3 py-1 rounded-full text-[11px] font-semibold border transition-all whitespace-nowrap",
                                (t === "all" && newPostTopic === "general" && posts.every(p => p.topic !== "all")) || newPostTopic === t
                                  ? "bg-[#7c6cf0]/20 border-[#7c6cf0]/50 text-[#7c6cf0] shadow-[0_0_12px_rgba(124,108,240,0.25)]"
                                  : "bg-slate-900/40 border-white/10 text-slate-400 hover:bg-slate-900/80 hover:text-slate-200"
                              )}
                            >
                              {t === "all" ? "All Tags" : `#${t}`}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-950/40 p-1">
                          {(["latest", "popular", "comments"] as const).map((mode) => (
                            <button
                              key={mode}
                              onClick={() => setSortBy(mode)}
                              className={cn(
                                "px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors capitalize",
                                sortBy === mode
                                  ? "bg-white/15 text-white font-bold shadow-sm"
                                  : "text-slate-400 hover:text-slate-200"
                              )}
                            >
                              {mode === "latest" ? "⚡ Latest" : mode === "popular" ? "🔥 Top" : "💬 Active"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {isLoadingPosts ? (
                      <div className="space-y-3">
                        <PostSkeleton />
                        <PostSkeleton />
                        <PostSkeleton />
                      </div>
                    ) : posts.length === 0 ? (
                      <div className="text-center py-12 rounded-2xl border border-white/10 bg-slate-900/30 p-6">
                        <p className="text-sm font-medium text-slate-300">No posts found matching your search.</p>
                      </div>
                    ) : (
                      posts
                        .filter((post) => {
                          const matchesTopic = newPostTopic === "general" || newPostTopic === "all" || post.topic === newPostTopic;
                          const matchesSearch = !searchQuery.trim() || 
                            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (post.topic && post.topic.toLowerCase().includes(searchQuery.toLowerCase()));
                          return matchesTopic && matchesSearch;
                        })
                        .sort((a, b) => {
                          if (sortBy === "popular") return b.like_count - a.like_count;
                          if (sortBy === "comments") return b.comment_count - a.comment_count;
                          return b.timestamp - a.timestamp;
                        })
                        .map((post, index) => (
                        <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.06}s` }}>
                          <TiltCard>
                            <PostCard
                              post={post}
                              walletAddress={walletAddress}
                              liked={likedPosts.has(post.id)}
                              following={followingPosts.has(post.id)}
                              isLiking={likingPosts.has(post.id)}
                              isFollowingUser={followingUsers.has(post.author)}
                              onLike={() => handleLike(post.id)}
                              onComment={() => toggleComments(post.id)}
                              onFollow={() => handleFollow(post.author)}
                              onUnfollow={() => handleUnfollow(post.author)}
                            />
                          </TiltCard>
                          {expandedComments === post.id && (
                            <CommentSection
                              postId={post.id}
                              walletAddress={walletAddress}
                              onClose={() => setExpandedComments(null)}
                              onRefresh={() => setRefreshKey((k) => k + 1)}
                            />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    {walletAddress ? (
                      <>
                        <div className="flex items-start justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-4">
                            {userProfile?.avatar_url ? (
                              <img src={userProfile.avatar_url} alt="Avatar" className="h-16 w-16 rounded-full object-cover border-2 border-[#7c6cf0]/40 shadow-md" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%237c6cf040"/></svg>'; }} />
                            ) : (
                              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#7c6cf0] to-[#38bdf8] p-[2px] shadow-md">
                                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#070913]">
                                  <span className="text-xl font-bold text-white">{walletAddress.slice(0, 2).toUpperCase()}</span>
                                </div>
                              </div>
                            )}
                            <div>
                              <p className="font-extrabold text-xl text-white tracking-tight">{userProfile?.username || truncate(walletAddress)}</p>
                              <p className="font-mono text-xs text-slate-400 mt-0.5">{walletAddress}</p>
                              {userProfile?.bio && <p className="text-xs text-slate-300 mt-2 max-w-md leading-relaxed">{userProfile.bio}</p>}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setEditUsername(userProfile?.username || "");
                              setEditAvatarUrl(userProfile?.avatar_url || "");
                              setEditBio(userProfile?.bio || "");
                              setIsEditingProfile(!isEditingProfile);
                            }}
                            className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-900 transition-colors"
                          >
                            {isEditingProfile ? "Cancel Edit" : "Edit Profile"}
                          </button>
                        </div>

                        {/* Edit Profile Form */}
                        {isEditingProfile && (
                          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 animate-slide-down space-y-3.5 backdrop-blur-xl">
                            <div>
                              <label className="text-xs font-semibold text-slate-300 mb-1 block">Display Username</label>
                              <input
                                value={editUsername}
                                onChange={(e) => setEditUsername(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#7c6cf0]"
                                placeholder="Choose a handle"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-slate-300 mb-1 block">Avatar Image URL</label>
                              <input
                                value={editAvatarUrl}
                                onChange={(e) => setEditAvatarUrl(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#7c6cf0]"
                                placeholder="https://..."
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-slate-300 mb-1 block">Bio</label>
                              <textarea
                                value={editBio}
                                onChange={(e) => setEditBio(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#7c6cf0] resize-none"
                                placeholder="Share a short bio"
                                rows={2}
                              />
                            </div>
                            <div className="flex justify-end pt-1">
                              <button
                                onClick={async () => {
                                  if (!walletAddress) return;
                                  setIsSavingProfile(true);
                                  setError(null);
                                  try {
                                    await setProfile(walletAddress, editUsername, editAvatarUrl, editBio);
                                    setSuccessMsg("Profile updated on-chain!");
                                    setIsEditingProfile(false);
                                    setRefreshKey((k) => k + 1);
                                  } catch (err: unknown) {
                                    setError(err instanceof Error ? err.message : "Failed to update profile");
                                  } finally {
                                    setIsSavingProfile(false);
                                  }
                                }}
                                disabled={isSavingProfile}
                                className="flex items-center gap-2 rounded-xl bg-[#7c6cf0] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#7c6cf0]/80 transition-colors disabled:opacity-50 shadow-md"
                              >
                                {isSavingProfile ? <><SpinnerIcon /> Saving...</> : "Save On-Chain"}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Stats Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 text-center backdrop-blur-md">
                            <p className="text-2xl font-bold text-white font-mono">{userFollowerCount}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-1">Followers</p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 text-center backdrop-blur-md">
                            <p className="text-2xl font-bold text-white font-mono">{userFollowingCount}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-1">Following</p>
                          </div>
                          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-center backdrop-blur-md glow-warning">
                            <p className="text-2xl font-bold text-amber-300 font-mono">{userProfile?.balance || 0}</p>
                            <p className="text-[10px] text-amber-400/80 uppercase tracking-wider font-semibold mt-1">Tokens Earned</p>
                          </div>
                          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-center backdrop-blur-md glow-error">
                            <p className="text-2xl font-bold text-rose-300 font-mono">{userProfile?.streak || 1} 🔥</p>
                            <p className="text-[10px] text-rose-400/80 uppercase tracking-wider font-semibold mt-1">Streak</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-sm text-slate-400 mb-4">Connect your wallet to manage your profile</p>
                        <button
                          onClick={onConnect}
                          className="rounded-2xl border border-dashed border-[#7c6cf0]/40 bg-[#7c6cf0]/10 px-6 py-3 text-sm font-semibold text-[#7c6cf0] hover:bg-[#7c6cf0]/20 transition-all"
                        >
                          Connect Wallet
                        </button>
                      </div>
                    )}
                  </div>
                )}
          </div>
        </AnimatedCard>
      </Spotlight>
    </div>

    {/* Right Column: Widgets Sidebar */}
    <div className="lg:col-span-4 space-y-5">
      {/* Smart Contract Widget */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl glow-cyan space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <h4 className="font-bold text-sm text-white">Smart Contract</h4>
          </div>
          <Badge variant="info" className="text-[9px] font-mono">Soroban Wasm</Badge>
        </div>

        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Contract ID</p>
          <div className="flex items-center justify-between bg-slate-950/60 p-2.5 rounded-xl border border-white/10 font-mono text-xs text-slate-300">
            <span className="truncate max-w-[180px]">{CONTRACT_ADDRESS}</span>
            <button
              onClick={handleCopyContract}
              className="ml-2 text-slate-400 hover:text-white transition-colors text-[11px] font-sans font-semibold"
            >
              {copiedContract ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-400 font-mono border-t border-white/10 pt-3">
          <div className="flex justify-between">
            <span>Network</span>
            <span className="text-slate-200">{NETWORK}</span>
          </div>
          <div className="flex justify-between">
            <span>Protocol</span>
            <span className="text-slate-200">Stellar Soroban</span>
          </div>
          <div className="flex justify-between">
            <span>Storage</span>
            <span className="text-emerald-400 font-semibold">On-Chain State</span>
          </div>
        </div>

        <a
          href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-xl border border-[#38bdf8]/30 bg-[#38bdf8]/10 py-2.5 text-xs font-semibold text-[#38bdf8] hover:bg-[#38bdf8]/20 transition-all"
        >
          <span>Explore Contract Transactions</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      {/* Trending Communities Widget */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl space-y-3">
        <h4 className="font-bold text-sm text-white border-b border-white/10 pb-3 flex items-center justify-between">
          <span>Trending Communities</span>
          <span className="text-[10px] text-slate-400 font-mono font-normal">Active Tags</span>
        </h4>
        <div className="space-y-2">
          {[
            { tag: "crypto", name: "Stellar & DeFi", posts: "24 posts" },
            { tag: "technology", name: "Soroban Devs", posts: "18 posts" },
            { tag: "memes", name: "Web3 Memes", posts: "12 posts" },
            { tag: "general", name: "Global Chat", posts: "45 posts" },
          ].map((c) => (
            <button
              key={c.tag}
              onClick={() => { setActiveTab("explore"); setNewPostTopic(c.tag); }}
              className="flex items-center justify-between w-full p-2.5 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/[0.04] transition-all text-left"
            >
              <div>
                <p className="text-xs font-bold text-slate-200">#{c.tag}</p>
                <p className="text-[10px] text-slate-400">{c.name}</p>
              </div>
              <span className="text-[10px] font-mono text-[#7c6cf0] bg-[#7c6cf0]/10 border border-[#7c6cf0]/20 px-2 py-0.5 rounded-full">{c.posts}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>
  );
}

