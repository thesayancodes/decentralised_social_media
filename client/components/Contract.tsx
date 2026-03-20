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
  CONTRACT_ADDRESS,
} from "@/hooks/contract";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Spotlight } from "@/components/ui/spotlight";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
}) {
  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const timeAgo = (ts: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - ts;
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const isOwnPost = walletAddress === post.author;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/[0.08] animate-fade-in-up">
      {/* Author row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#7c6cf0]/40 to-[#4fc3f7]/40 border border-white/[0.08] flex items-center justify-center">
            <span className="text-xs font-bold text-white/70">{post.author.slice(0, 2).toUpperCase()}</span>
          </div>
          <div>
            <span className="font-mono text-sm text-white/80">{truncate(post.author)}</span>
            <span className="ml-2 text-xs text-white/25">{timeAgo(post.timestamp)}</span>
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
      <p className="text-sm text-white/70 leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-4 border-t border-white/[0.04] pt-3">
        <button
          onClick={onLike}
          disabled={isLiking || !walletAddress}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs transition-all active:scale-95",
            liked
              ? "text-[#f87171] bg-[#f87171]/[0.08]"
              : "text-white/40 hover:text-[#f87171] hover:bg-[#f87171]/[0.05]",
            (!walletAddress || isLiking) && "opacity-50 cursor-not-allowed"
          )}
        >
          <HeartIcon filled={liked} />
          <span>{post.like_count}</span>
        </button>

        <button
          onClick={onComment}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-white/40 hover:text-[#4fc3f7] hover:bg-[#4fc3f7]/[0.05] transition-all active:scale-95"
        >
          <MessageIcon />
          <span>{post.comment_count}</span>
        </button>
      </div>
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
}: {
  walletAddress: string | null;
  onConnect: () => void;
  onPost: () => void;
  isPosting: boolean;
}) {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;
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
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? Post anything, anywhere..."
                className="w-full bg-transparent text-sm text-white/70 placeholder:text-white/15 outline-none resize-none leading-relaxed"
                rows={3}
                maxLength={1000}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-white/15 font-mono">{content.length}/1000</span>
                <ShimmerButton
                  onClick={handleSubmit}
                  disabled={isPosting || !content.trim()}
                  shimmerColor="#7c6cf0"
                  className="px-4 py-2 text-xs"
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
          className="w-full rounded-xl border border-dashed border-[#7c6cf0]/20 bg-[#7c6cf0]/[0.03] py-5 text-sm text-[#7c6cf0]/50 hover:border-[#7c6cf0]/30 hover:text-[#7c6cf0]/80 transition-all"
        >
          Connect wallet to post
        </button>
      )}
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

  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [expandedComments, setExpandedComments] = useState<number | null>(null);

  const [userFollowerCount, setUserFollowerCount] = useState(0);
  const [userFollowingCount, setUserFollowingCount] = useState(0);
  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);

  const [refreshKey, setRefreshKey] = useState(0);

  // Load posts
  const loadPosts = useCallback(async () => {
    setIsLoadingPosts(true);
    try {
      const result = await getRecentPosts(0, 30);
      const postArray: PostData[] = Array.isArray(result) ? result.map((p: unknown) => {
        const obj = p as Record<string, unknown>;
        return {
          id: typeof obj.id === "bigint" ? Number(obj.id) : (obj.id as number),
          author: obj.author as string,
          content: obj.content as string,
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
        setLikedPosts(liked);
        setFollowingPosts(followingPostAuthors);
      }

      setPosts(postArray);
    } catch (err: unknown) {
      // Silently fail — empty feed
      setPosts([]);
    } finally {
      setIsLoadingPosts(false);
    }
  }, [walletAddress, refreshKey]);

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
    } catch { /* skip */ }
  }, [walletAddress, refreshKey]);

  // Load feed
  const loadFeed = useCallback(async () => {
    if (!walletAddress) return;
    setIsLoadingPosts(true);
    try {
      const result = await getFollowedFeed(walletAddress, 0, 30);
      const postArray: PostData[] = Array.isArray(result) ? result.map((p: unknown) => {
        const obj = p as Record<string, unknown>;
        return {
          id: typeof obj.id === "bigint" ? Number(obj.id) : (obj.id as number),
          author: obj.author as string,
          content: obj.content as string,
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
        setLikedPosts(liked);
        setFollowingPosts(followingPostAuthors);
      }

      setPosts(postArray);
    } catch {
      setPosts([]);
    } finally {
      setIsLoadingPosts(false);
    }
  }, [walletAddress, refreshKey]);

  useEffect(() => {
    if (activeTab === "feed") {
      loadFeed();
    } else if (activeTab === "explore") {
      loadPosts();
    } else if (activeTab === "profile") {
      loadProfile();
    }
  }, [activeTab, loadFeed, loadPosts, loadProfile]);

  // ── Actions ──────────────────────────────────────────────

  const handleCreatePost = useCallback(async () => {
    if (!walletAddress || !newPostContent.trim()) return;
    setIsPosting(true);
    setError(null);
    try {
      await createPost(walletAddress, newPostContent.trim());
      setNewPostContent("");
      setSuccessMsg("Post published on-chain!");
      setTimeout(() => setSuccessMsg(null), 4000);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to post");
    } finally {
      setIsPosting(false);
    }
  }, [walletAddress, newPostContent]);

  const handleLike = useCallback(async (postId: number) => {
    if (!walletAddress) return;
    const isLiked = likedPosts.has(postId);
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
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Action failed");
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
                <h3 className="text-sm font-semibold text-white/90">SociaLink</h3>
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
                />

                {/* Hidden textarea synced with state for create post */}
                <div className="hidden">
                  <textarea
                    id="postContent"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full bg-transparent text-sm text-white/70 outline-none resize-none"
                    rows={3}
                    maxLength={1000}
                  />
                </div>

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
                  posts.map((post) => (
                    <div key={post.id}>
                      <PostCard
                        post={post}
                        walletAddress={walletAddress}
                        liked={likedPosts.has(post.id)}
                        following={followingPosts.has(post.id)}
                        isLiking={false}
                        isFollowingUser={followingUsers.has(post.author)}
                        onLike={() => handleLike(post.id)}
                        onComment={() => toggleComments(post.id)}
                        onFollow={() => handleFollow(post.author)}
                        onUnfollow={() => handleUnfollow(post.author)}
                      />
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
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-white/25 font-medium uppercase tracking-wider">Global Timeline</span>
                  <button
                    onClick={() => setRefreshKey((k) => k + 1)}
                    className="ml-auto text-white/20 hover:text-white/50 transition-colors"
                    title="Refresh"
                  >
                    <RefreshIcon />
                  </button>
                </div>

                {isLoadingPosts ? (
                  <div className="flex items-center justify-center py-8">
                    <SpinnerIcon />
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-sm text-white/25">No posts yet. Be the first!</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id}>
                      <PostCard
                        post={post}
                        walletAddress={walletAddress}
                        liked={likedPosts.has(post.id)}
                        following={followingPosts.has(post.id)}
                        isLiking={false}
                        isFollowingUser={followingUsers.has(post.author)}
                        onLike={() => handleLike(post.id)}
                        onComment={() => toggleComments(post.id)}
                        onFollow={() => handleFollow(post.author)}
                        onUnfollow={() => handleUnfollow(post.author)}
                      />
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
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#7c6cf0]/40 to-[#4fc3f7]/40 border border-white/[0.1] flex items-center justify-center">
                        <span className="text-xl font-bold text-white/70">{walletAddress.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-mono text-sm text-white/80">{truncate(walletAddress)}</p>
                        <p className="text-xs text-white/30 mt-0.5">{walletAddress}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 border-t border-b border-white/[0.04] py-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-white/80">{userFollowerCount}</p>
                        <p className="text-[10px] text-white/25 uppercase tracking-wider">Followers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-white/80">{userFollowingCount}</p>
                        <p className="text-[10px] text-white/25 uppercase tracking-wider">Following</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-white/80">{posts.length}</p>
                        <p className="text-[10px] text-white/25 uppercase tracking-wider">Posts</p>
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
                      className="rounded-xl border border-dashed border-[#fbbf24]/20 bg-[#fbbf24]/[0.03] px-6 py-3 text-sm text-[#fbbf24]/60 hover:border-[#fbbf24]/30 hover:text-[#fbbf24]/80 transition-all"
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
            <p className="text-[10px] text-white/15">SociaLink &middot; Permissionless on Stellar</p>
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
