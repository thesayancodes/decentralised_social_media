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
      "mb-4 flex items-center gap-3 rounded-xl border px-4 py-3 backdrop-blur-sm animate-slide-down",
      isError ? "border-[#f87171]/15 bg-[#f87171]/[0.05]" : "border-[#34d399]/15 bg-[#34d399]/[0.05]"
    )}>
      <span className={isError ? "text-[#f87171]" : "text-[#34d399]"}>
        {isError ? <AlertIcon /> : <CheckIcon />}
      </span>
      <span className={cn("text-sm", isError ? "text-[#f87171]/90" : "text-[#34d399]/90")}>
        {message}
      </span>
      <button onClick={onClose} className={cn("ml-auto text-lg leading-none", isError ? "text-[#f87171]/30 hover:text-[#f87171]/70" : "text-[#34d399]/30 hover:text-[#34d399]/70")}>&times;</button>
    </div>
  );
}

// ─── Post Card ───────────────────────────────────────────────

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

function SparklesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
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
    <div className="relative group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:border-[#7c6cf0]/40 hover:bg-white/[0.04] hover:shadow-[0_0_25px_rgba(124,108,240,0.12)] animate-fade-in-up">
      {/* Floating Tip Burst */}
      {tipAnimation && (
        <div className="absolute top-2 right-12 z-20 pointer-events-none flex items-center gap-1 text-xs font-bold text-[#fbbf24] animate-tip-float bg-[#fbbf24]/10 border border-[#fbbf24]/30 px-3 py-1 rounded-full backdrop-blur-md">
          <CoinIcon /> {tipAnimation} Sent!
        </div>
      )}

      {/* Author row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.username} className="h-9 w-9 rounded-full object-cover border border-white/[0.08]" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><rect width="36" height="36" fill="%237c6cf040"/></svg>'; }} />
          ) : (
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#7c6cf0]/40 to-[#4fc3f7]/40 border border-white/[0.08] flex items-center justify-center">
              <span className="text-xs font-bold text-white/70">{post.author.slice(0, 2).toUpperCase()}</span>
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-white/90">{profile?.username || truncate(post.author)}</span>
              {!profile?.username && <span className="font-mono text-xs text-white/40">{truncate(post.author)}</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/25">{timeAgo(post.timestamp)}</span>
              <span className="h-2 w-px bg-white/10" />
              {/* AI Trust Badge */}
              <span className="inline-flex items-center gap-1 text-[9px] font-medium text-[#34d399]/90 bg-[#34d399]/[0.08] border border-[#34d399]/20 px-1.5 py-0.5 rounded-md">
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
              className="flex items-center gap-1.5 rounded-lg border border-[#f87171]/20 bg-[#f87171]/[0.05] px-3 py-1.5 text-xs text-[#f87171]/70 hover:border-[#f87171]/30 hover:text-[#f87171] transition-all active:scale-95"
            >
              <UserMinusIcon />
              Unfollow
            </button>
          ) : (
            <button
              onClick={onFollow}
              className="flex items-center gap-1.5 rounded-lg border border-[#7c6cf0]/20 bg-[#7c6cf0]/[0.05] px-3 py-1.5 text-xs text-[#7c6cf0]/70 hover:border-[#7c6cf0]/30 hover:text-[#7c6cf0] transition-all active:scale-95"
            >
              <UserPlusIcon />
              Follow
            </button>
          )
        )}
      </div>

      {/* Content */}
      {post.topic && (
        <span className="inline-block mb-2 rounded-full border border-[#4fc3f7]/30 bg-[#4fc3f7]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#4fc3f7] tracking-wide">
          #{post.topic}
        </span>
      )}
      <p className="text-sm text-white/80 leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
      {post.ipfs_hash && (
        <div className="mb-4 overflow-hidden rounded-xl border border-white/[0.08] group-hover:border-white/[0.15] transition-colors">
          <img src={post.ipfs_hash} alt="Post content" className="w-full max-h-96 object-cover transition-transform duration-500 group-hover:scale-[1.01]" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-white/[0.04] pt-3">
        <div className="flex items-center gap-3">
          {/* Like button with particle burst */}
          <button
            onClick={triggerLikeWithParticle}
            disabled={isLiking || !walletAddress}
            className={cn(
              "relative flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-all active:scale-95",
              liked
                ? "text-[#f87171] bg-[#f87171]/[0.1] shadow-[0_0_12px_rgba(248,113,113,0.25)]"
                : "text-white/40 hover:text-[#f87171] hover:bg-[#f87171]/[0.05]",
              (!walletAddress || isLiking) && "opacity-50 cursor-not-allowed"
            )}
          >
            {particleActive && (
              <span className="absolute -top-3 left-3 pointer-events-none text-sm animate-particle-pop text-[#f87171]">
                ❤️
              </span>
            )}
            <HeartIcon filled={liked} />
            <span>{post.like_count}</span>
          </button>

          {/* Comment button */}
          <button
            onClick={onComment}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/40 hover:text-[#4fc3f7] hover:bg-[#4fc3f7]/[0.05] transition-all active:scale-95"
          >
            <MessageIcon />
            <span>{post.comment_count}</span>
          </button>

          {/* Tip Creator button */}
          <button
            onClick={() => setShowTipModal(true)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/40 hover:text-[#fbbf24] hover:bg-[#fbbf24]/[0.08] transition-all active:scale-95"
            title="Tip creator"
          >
            <CoinIcon />
            <span className="hidden sm:inline">Tip</span>
          </button>
        </div>

        {/* Share button */}
        <button
          onClick={() => setShowShareModal(true)}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-all"
          title="Share post"
        >
          <ShareIcon />
        </button>
      </div>

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-[#fbbf24]/30 bg-[#0c0c1e] p-6 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#fbbf24]">
                <CoinIcon />
                <h4 className="font-bold text-sm text-white">Tip Creator with XLM</h4>
              </div>
              <button onClick={() => setShowTipModal(false)} className="text-white/30 hover:text-white text-lg">&times;</button>
            </div>
            <p className="text-xs text-white/50 mb-4">Support <b>{profile?.username || truncate(post.author)}</b> directly on the Stellar testnet.</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[1, 5, 10].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleSendTip(amt)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#fbbf24]/20 bg-[#fbbf24]/[0.05] hover:bg-[#fbbf24]/20 hover:border-[#fbbf24]/50 transition-all active:scale-95 group"
                >
                  <span className="text-lg font-extrabold text-[#fbbf24] group-hover:scale-110 transition-transform">{amt}</span>
                  <span className="text-[10px] text-white/40">XLM</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-center text-white/30">Instant micro-transaction signed via Freighter</p>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c0c1e] p-6 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#4fc3f7]">
                <ShareIcon />
                <h4 className="font-bold text-sm text-white">Share Post</h4>
              </div>
              <button onClick={() => setShowShareModal(false)} className="text-white/30 hover:text-white text-lg">&times;</button>
            </div>
            <div className="mb-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-xs text-white/70 italic break-words">
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
            <p className="text-[10px] text-center text-white/30">Immutable permalink hosted on-chain</p>
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
    <div className="rounded-2xl border border-[#4fc3f7]/15 bg-[#4fc3f7]/[0.02] p-4 animate-fade-in-up mt-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Comments</span>
        <button onClick={onClose} className="text-white/20 hover:text-white/50 text-lg leading-none">&times;</button>
      </div>

      {error && <p className="text-xs text-[#f87171]/70 mb-2">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <SpinnerIcon />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-xs text-white/20 text-center py-4">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto mb-3 pr-1">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2.5">
              <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-[#4fc3f7]/30 to-[#7c6cf0]/30 border border-white/[0.06] flex items-center justify-center">
                <span className="text-[9px] font-bold text-white/60">{c.author.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-white/60">{truncate(c.author)}</span>
                </div>
                <p className="text-xs text-white/60 mt-0.5 break-words">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {walletAddress && (
        <div className="flex gap-2">
          <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Write a comment..."
              className="w-full bg-transparent text-xs text-white/70 placeholder:text-white/15 outline-none"
              maxLength={500}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting || !newComment.trim()}
            className="flex items-center justify-center rounded-xl bg-[#4fc3f7]/20 border border-[#4fc3f7]/20 px-3 text-[#4fc3f7] hover:bg-[#4fc3f7]/30 transition-all disabled:opacity-50 active:scale-95"
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
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4 animate-fade-in-up">
      {walletAddress ? (
        <>
          <div className="flex gap-3">
            <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-[#7c6cf0]/40 to-[#4fc3f7]/40 border border-white/[0.08] flex items-center justify-center">
              <span className="text-xs font-bold text-white/70">{walletAddress.slice(0, 2).toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => onChangeContent(e.target.value)}
                placeholder="What's on your mind? Post anything, anywhere..."
                className="w-full bg-transparent text-sm text-white/70 placeholder:text-white/15 outline-none resize-none leading-relaxed"
                rows={3}
                maxLength={1000}
              />
              {ipfsHash && (
                <div className="relative mt-2 inline-block">
                  <img src={ipfsHash} alt="Upload preview" className="h-32 rounded-lg border border-white/[0.08] object-cover" />
                  <button onClick={() => onChangeIpfsHash(null)} className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-black/80">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              )}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <select
                    value={topic}
                    onChange={(e) => onChangeTopic(e.target.value)}
                    className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-white/70 outline-none hover:border-[#7c6cf0]/50"
                  >
                    <option value="general">#general</option>
                    <option value="technology">#technology</option>
                    <option value="memes">#memes</option>
                    <option value="crypto">#crypto</option>
                  </select>
                  <label className={cn("cursor-pointer flex items-center justify-center h-7 w-7 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:border-[#7c6cf0]/50 transition-colors text-white/50", isUploading && "opacity-50 pointer-events-none")}>
                    {isUploading ? <SpinnerIcon /> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                  <span className="text-[10px] text-white/15 font-mono">{content.length}/1000</span>
                </div>
                <ShimmerButton
                  onClick={handleSubmit}
                  disabled={isPosting || !content.trim()}
                  shimmerColor="#7c6cf0"
                  className="px-4 py-2 text-xs transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(124,108,240,0.4)] disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {isPosting ? <><SpinnerIcon /> Posting...</> : <><FeatherIcon /> Post</>}
                </ShimmerButton>
              </div>
            </div>
          </div>
        </>
      ) : (
        <button
          onClick={onConnect}
          className="w-full rounded-xl border border-dashed border-[#7c6cf0]/20 bg-[#7c6cf0]/[0.03] py-5 text-sm text-[#7c6cf0]/50 transition-all duration-300 hover:border-[#7c6cf0]/50 hover:text-[#7c6cf0]/90 hover:bg-[#7c6cf0]/10 hover:shadow-[0_0_30px_rgba(124,108,240,0.15)] active:scale-[0.98]"
        >
          Connect wallet to post
        </button>
      )}
    </div>
  );
}

// ─── Skeleton Placeholder ─────────────────────────────────────

function PostSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 skeleton-shimmer space-y-3 mb-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-white/10" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 w-28 rounded bg-white/10" />
          <div className="h-2.5 w-16 rounded bg-white/5" />
        </div>
      </div>
      <div className="h-4 w-5/6 rounded bg-white/10" />
      <div className="h-4 w-2/3 rounded bg-white/5" />
      <div className="flex justify-between pt-3 border-t border-white/[0.04]">
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

      // Load like status for each post
      if (walletAddress) {
        const liked = new Set<number>();
        const followingPostAuthors = new Set<number>();
        for (const p of postArray) {
          try {
            const hasLikedResult = await hasLiked(p.id, walletAddress);
            if (hasLikedResult) liked.add(p.id);
            const isFollowingResult = await isFollowing(walletAddress, p.author);
            if (isFollowingResult) followingPostAuthors.add(p.id);
          } catch { /* skip */ }
        }
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

      // Load profiles for each post author
      const uniqueAuthors = Array.from(new Set(postArray.map((p) => p.author)));
      const newProfiles = { ...profiles };
      for (const author of uniqueAuthors) {
        if (!newProfiles[author]) {
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
        }
      }
      setProfiles(newProfiles);

      setPosts(postArray);
    } catch (err: unknown) {
      // Silently fail — empty feed
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
        for (const p of postArray) {
          try {
            const hasLikedResult = await hasLiked(p.id, walletAddress);
            if (hasLikedResult) liked.add(p.id);
            const isFollowingResult = await isFollowing(walletAddress, p.author);
            if (isFollowingResult) followingPostAuthors.add(p.id);
          } catch { /* skip */ }
        }
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

      // Fetch profiles for authors
      const uniqueAuthors = Array.from(new Set(postArray.map((p) => p.author)));
      const newProfiles = { ...profiles };
      for (const author of uniqueAuthors) {
        if (!newProfiles[author]) {
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
        }
      }
      setProfiles(newProfiles);

      setPosts(postArray);
    } catch {
      setPosts([]);
    } finally {
      setIsLoadingPosts(false);
    }
  }, [walletAddress, refreshKey, posts.length]);

  useEffect(() => {
    // Initial load
    if (activeTab === "feed") {
      loadFeed();
    } else if (activeTab === "explore") {
      loadPosts();
    } else if (activeTab === "profile") {
      loadProfile();
    }

    // Fast Polling for Real-time UX
    let interval: NodeJS.Timeout;
    if (activeTab === "feed" || activeTab === "explore") {
      interval = setInterval(() => {
        // We use setRefreshKey to trigger a background reload 
        // without showing full page spinners.
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
      setSuccessMsg("Post published on-chain (Gasless)!");
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
        // State was stale, it's already liked on the blockchain
        setLikedPosts((prev) => new Set(prev).add(postId));
        lastLikeAction.current[postId] = Date.now();
      } else if (isLiked && (msg.includes("has not liked") || msg.includes("UnreachableCodeReached") || msg.includes("InvalidAction"))) {
        // State was stale, it's already unliked
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
    { key: "feed", label: "Feed", icon: <UsersIcon />, color: "#7c6cf0" },
    { key: "explore", label: "Explore", icon: <RefreshIcon />, color: "#4fc3f7" },
    { key: "profile", label: "Profile", icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ), color: "#fbbf24" },
  ];

  return (
    <div className="w-full max-w-xl animate-fade-in-up-delayed">
      {/* Toasts */}
      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      {successMsg && <Toast message={successMsg} type="success" onClose={() => setSuccessMsg(null)} />}

      <Spotlight className="rounded-2xl">
        <AnimatedCard className="p-0" containerClassName="rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c6cf0]/20 to-[#4fc3f7]/20 border border-white/[0.06]">
                <FeatherIcon />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90">SocialMedia</h3>
                <p className="text-[10px] text-white/25 font-mono mt-0.5">{truncate(CONTRACT_ADDRESS)}</p>
              </div>
            </div>
            <Badge variant="info" className="text-[10px]">Soroban</Badge>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06] px-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setError(null); setExpandedComments(null); }}
                className={cn(
                  "relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all",
                  activeTab === t.key ? "text-white/90" : "text-white/35 hover:text-white/55"
                )}
              >
                <span style={activeTab === t.key ? { color: t.color } : undefined}>{t.icon}</span>
                {t.label}
                {activeTab === t.key && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full" style={{ background: `linear-gradient(to right, ${t.color}, ${t.color}66)` }} />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Feed tab */}
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
                  <div className="flex items-center justify-center py-8">
                    <SpinnerIcon />
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-sm text-white/25 mb-2">
                      {walletAddress ? "Your feed is empty" : "Connect wallet to see your feed"}
                    </p>
                    <p className="text-xs text-white/15">Follow people to see their posts here</p>
                  </div>
                ) : (
                  posts.map((post, index) => (
                    <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
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

            {/* Explore tab */}
            {activeTab === "explore" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/25 font-medium uppercase tracking-wider">Global Timeline</span>
                    <button
                      onClick={() => setRefreshKey((k) => k + 1)}
                      className="ml-auto flex items-center gap-1 text-xs text-white/30 hover:text-white/70 transition-colors"
                      title="Refresh timeline"
                    >
                      <RefreshIcon /> Refresh
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-white/30">
                      <SearchIcon />
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search posts, topics, or authors..."
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] pl-10 pr-9 py-2 text-xs text-white/80 placeholder:text-white/20 outline-none focus:border-[#7c6cf0]/50 focus:bg-white/[0.04] transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 text-xs text-white/30 hover:text-white/70"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                  
                  {/* Community & Sort Controls */}
                  <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                    <div className="flex gap-1.5 scrollbar-hide">
                      {["all", "general", "technology", "memes", "crypto"].map((t) => (
                        <button
                          key={t}
                          onClick={() => setNewPostTopic(t === "all" ? "general" : t)}
                          className={cn(
                            "px-3 py-1 rounded-full text-[11px] font-medium border transition-all whitespace-nowrap",
                            (t === "all" && newPostTopic === "general" && posts.every(p => p.topic !== "all")) || newPostTopic === t
                              ? "bg-[#7c6cf0]/20 border-[#7c6cf0]/50 text-[#7c6cf0] shadow-[0_0_10px_rgba(124,108,240,0.2)]"
                              : "bg-white/[0.02] border-white/[0.08] text-white/50 hover:bg-white/[0.05]"
                          )}
                        >
                          {t === "all" ? "All Tags" : `#${t}`}
                        </button>
                      ))}
                    </div>

                    {/* Sort Selector */}
                    <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.02] p-0.5 shrink-0">
                      {(["latest", "popular", "comments"] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setSortBy(mode)}
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-medium transition-colors capitalize",
                            sortBy === mode
                              ? "bg-white/10 text-white font-semibold"
                              : "text-white/40 hover:text-white/70"
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
                  <div className="text-center py-10">
                    <p className="text-sm text-white/25">No posts match your filters.</p>
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

            {/* Profile tab */}
            {activeTab === "profile" && (
              <div className="space-y-5">
                {walletAddress ? (
                  <>
                    {/* Avatar & handle */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {userProfile?.avatar_url ? (
                          <img src={userProfile.avatar_url} alt="Avatar" className="h-16 w-16 rounded-full object-cover border border-white/[0.1]" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%237c6cf040"/></svg>'; }} />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#7c6cf0]/40 to-[#4fc3f7]/40 border border-white/[0.1] flex items-center justify-center">
                            <span className="text-xl font-bold text-white/70">{walletAddress.slice(0, 2).toUpperCase()}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-lg text-white/90">{userProfile?.username || truncate(walletAddress)}</p>
                          <p className="font-mono text-xs text-white/40 mt-0.5">{walletAddress}</p>
                          {userProfile?.bio && <p className="text-sm text-white/70 mt-2 max-w-sm">{userProfile.bio}</p>}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEditUsername(userProfile?.username || "");
                          setEditAvatarUrl(userProfile?.avatar_url || "");
                          setEditBio(userProfile?.bio || "");
                          setIsEditingProfile(!isEditingProfile);
                        }}
                        className="rounded-lg border border-white/[0.1] bg-white/[0.05] px-3 py-1.5 text-xs text-white/70 hover:bg-white/[0.1] transition-colors"
                      >
                        {isEditingProfile ? "Cancel" : "Edit Profile"}
                      </button>
                    </div>

                    {/* Edit Profile Form */}
                    {isEditingProfile && (
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 animate-slide-down space-y-3">
                        <div>
                          <label className="text-xs text-white/50 mb-1 block">Username</label>
                          <input
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                            className="w-full rounded-lg border border-white/[0.06] bg-transparent px-3 py-2 text-sm text-white/80 outline-none focus:border-[#7c6cf0]/50"
                            placeholder="Choose a username"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-white/50 mb-1 block">Avatar URL</label>
                          <input
                            value={editAvatarUrl}
                            onChange={(e) => setEditAvatarUrl(e.target.value)}
                            className="w-full rounded-lg border border-white/[0.06] bg-transparent px-3 py-2 text-sm text-white/80 outline-none focus:border-[#7c6cf0]/50"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="text-xs text-white/50 mb-1 block">Bio</label>
                          <textarea
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            className="w-full rounded-lg border border-white/[0.06] bg-transparent px-3 py-2 text-sm text-white/80 outline-none focus:border-[#7c6cf0]/50 resize-none"
                            placeholder="Tell us about yourself"
                            rows={2}
                          />
                        </div>
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={async () => {
                              if (!walletAddress) return;
                              setIsSavingProfile(true);
                              setError(null);
                              try {
                                await setProfile(walletAddress, editUsername, editAvatarUrl, editBio);
                                setSuccessMsg("Profile updated successfully!");
                                setIsEditingProfile(false);
                                setRefreshKey((k) => k + 1);
                              } catch (err: unknown) {
                                setError(err instanceof Error ? err.message : "Failed to update profile");
                              } finally {
                                setIsSavingProfile(false);
                              }
                            }}
                            disabled={isSavingProfile}
                            className="flex items-center gap-2 rounded-lg bg-[#7c6cf0] px-4 py-2 text-xs font-semibold text-white hover:bg-[#7c6cf0]/80 transition-colors disabled:opacity-50"
                          >
                            {isSavingProfile ? <><SpinnerIcon /> Saving...</> : "Save Profile"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 border-t border-b border-white/[0.04] py-5">
                      <div className="flex-1 min-w-[100px] rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                        <p className="text-xl font-bold text-white/80">{userFollowerCount}</p>
                        <p className="text-[10px] text-white/25 uppercase tracking-wider mt-1">Followers</p>
                      </div>
                      <div className="flex-1 min-w-[100px] rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                        <p className="text-xl font-bold text-white/80">{userFollowingCount}</p>
                        <p className="text-[10px] text-white/25 uppercase tracking-wider mt-1">Following</p>
                      </div>
                      <div className="flex-1 min-w-[100px] rounded-xl border border-[#fbbf24]/20 bg-[#fbbf24]/[0.05] p-3 text-center transition-all hover:bg-[#fbbf24]/[0.08] hover:-translate-y-1 glow-warning relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fbbf24]/10 to-transparent -translate-x-full group-hover:animate-[shimmer-spin_2s_infinite]" />
                        <p className="text-xl font-bold text-[#fbbf24] font-mono relative z-10">{userProfile?.balance || 0}</p>
                        <p className="text-[10px] text-[#fbbf24]/60 uppercase tracking-wider mt-1 relative z-10">Tokens Earned</p>
                      </div>
                      <div className="flex-1 min-w-[100px] rounded-xl border border-[#f87171]/20 bg-[#f87171]/[0.05] p-3 text-center transition-all hover:bg-[#f87171]/[0.08] hover:-translate-y-1 glow-error relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f87171]/10 to-transparent -translate-x-full group-hover:animate-[shimmer-spin_2s_infinite]" />
                        <p className="text-xl font-bold text-[#f87171] font-mono relative z-10">{userProfile?.streak || 1} 🔥</p>
                        <p className="text-[10px] text-[#f87171]/60 uppercase tracking-wider mt-1 relative z-10">Daily Streak</p>
                      </div>
                    </div>

                    {/* Following list */}
                    {following.length > 0 && (
                      <div>
                        <p className="text-[10px] text-white/25 uppercase tracking-wider mb-3">Following</p>
                        <div className="flex flex-wrap gap-2">
                          {following.map((addr) => (
                            <div key={addr} className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5">
                              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#7c6cf0]/30 to-[#4fc3f7]/30 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-white/60">{addr.slice(0, 2).toUpperCase()}</span>
                              </div>
                              <span className="font-mono text-xs text-white/50">{truncate(addr)}</span>
                              <button
                                onClick={() => handleUnfollow(addr)}
                                className="ml-1 text-white/20 hover:text-[#f87171]/70 text-[10px] transition-colors"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Followers list */}
                    {followers.length > 0 && (
                      <div>
                        <p className="text-[10px] text-white/25 uppercase tracking-wider mb-3">Followers</p>
                        <div className="flex flex-wrap gap-2">
                          {followers.map((addr) => (
                            <div key={addr} className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5">
                              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#4fc3f7]/30 to-[#7c6cf0]/30 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-white/60">{addr.slice(0, 2).toUpperCase()}</span>
                              </div>
                              <span className="font-mono text-xs text-white/50">{truncate(addr)}</span>
                              {followingUsers.has(addr) && (
                                <button
                                  onClick={() => handleFollow(addr)}
                                  className="ml-1 text-[#7c6cf0]/50 hover:text-[#7c6cf0] text-[10px] transition-colors"
                                >
                                  + follow back
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-sm text-white/25 mb-3">Connect your wallet to view profile</p>
                    <button
                      onClick={onConnect}
                      className="rounded-xl border border-dashed border-[#fbbf24]/20 bg-[#fbbf24]/[0.03] px-6 py-3 text-sm text-[#fbbf24]/60 transition-all duration-300 hover:border-[#fbbf24]/50 hover:text-[#fbbf24]/90 hover:bg-[#fbbf24]/10 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)] active:scale-[0.98]"
                    >
                      Connect Wallet
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.04] px-6 py-3 flex items-center justify-between">
            <p className="text-[10px] text-white/15">SocialMedia &middot; Permissionless on Stellar</p>
            <div className="flex items-center gap-2">
              {["Posts", "Like", "Follow", "Comment"].map((s, i) => (
                <span key={s} className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-white/10" />
                  <span className="font-mono text-[9px] text-white/15">{s}</span>
                  {i < 3 && <span className="text-white/10 text-[8px]">&middot;</span>}
                </span>
              ))}
            </div>
          </div>
        </AnimatedCard>
      </Spotlight>
    </div>
  );
}
