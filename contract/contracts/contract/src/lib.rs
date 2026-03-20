#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec};

#[contracttype]
#[derive(Clone)]
pub struct Post {
    pub id: u64,
    pub author: Address,
    pub content: String,
    pub timestamp: u64,
    pub like_count: u64,
    pub comment_count: u64,
}

#[contracttype]
#[derive(Clone)]
pub struct Comment {
    pub id: u64,
    pub post_id: u64,
    pub author: Address,
    pub content: String,
    pub timestamp: u64,
}

#[contracttype]
pub enum DataKey {
    PostCount,
    Post(u64),
    Comments(u64),
    CommentCount(u64),
    Likes(u64),
    LikeCount(u64),
    Followers(Address),
    Following(Address),
    FollowerCount(Address),
    FollowingCount(Address),
}

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    // ─── POSTS (fully permissionless) ─────────────────────────────────────

    /// Anyone can create a post — no admin, no initialization.
    pub fn create_post(env: Env, author: Address, content: String) -> u64 {
        author.require_auth();
        let count_key = DataKey::PostCount;
        let post_count: u64 = env.storage().instance().get(&count_key).unwrap_or(0);
        let new_id = post_count + 1;

        let post = Post {
            id: new_id,
            author: author.clone(),
            content,
            timestamp: env.ledger().timestamp(),
            like_count: 0,
            comment_count: 0,
        };

        env.storage().instance().set(&DataKey::Post(new_id), &post);
        env.storage().instance().set(&count_key, &new_id);
        new_id
    }

    pub fn get_post(env: Env, post_id: u64) -> Post {
        env.storage()
            .instance()
            .get(&DataKey::Post(post_id))
            .unwrap_or_else(|| panic!("post not found"))
    }

    pub fn get_post_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::PostCount)
            .unwrap_or(0)
    }

    /// Get recent posts newest-first, paginated.
    pub fn get_recent_posts(env: Env, offset: u32, limit: u32) -> Vec<Post> {
        let total: u64 = env
            .storage()
            .instance()
            .get(&DataKey::PostCount)
            .unwrap_or(0);
        let mut results: Vec<Post> = Vec::new(&env);
        if total == 0 || offset >= total as u32 {
            return results;
        }
        let mut id = total.saturating_sub(offset as u64);
        let mut added = 0u32;
        while id >= 1 && added < limit {
            if let Some(post) = env.storage().instance().get::<_, Post>(&DataKey::Post(id)) {
                results.push_back(post);
                added += 1;
            }
            id -= 1;
        }
        results
    }

    // ─── COMMENTS (fully permissionless) ─────────────────────────────────

    pub fn add_comment(env: Env, post_id: u64, commenter: Address, content: String) {
        commenter.require_auth();

        let count_key = DataKey::CommentCount(post_id);
        let comment_count: u64 = env.storage().instance().get(&count_key).unwrap_or(0);
        let new_comment_id = comment_count + 1;

        let comment = Comment {
            id: new_comment_id,
            post_id,
            author: commenter.clone(),
            content,
            timestamp: env.ledger().timestamp(),
        };

        let mut comments: Vec<Comment> = env
            .storage()
            .instance()
            .get(&DataKey::Comments(post_id))
            .unwrap_or_else(|| Vec::new(&env));
        comments.push_back(comment);

        let mut post: Post = env
            .storage()
            .instance()
            .get(&DataKey::Post(post_id))
            .unwrap_or_else(|| panic!("post not found"));
        post.comment_count += 1;

        env.storage()
            .instance()
            .set(&DataKey::Comments(post_id), &comments);
        env.storage().instance().set(&DataKey::Post(post_id), &post);
        env.storage().instance().set(&count_key, &new_comment_id);
    }

    pub fn get_comments(env: Env, post_id: u64, offset: u32, limit: u32) -> Vec<Comment> {
        let all: Vec<Comment> = env
            .storage()
            .instance()
            .get(&DataKey::Comments(post_id))
            .unwrap_or_else(|| Vec::new(&env));
        let total = all.len();
        let mut results: Vec<Comment> = Vec::new(&env);
        let mut i = offset;
        let end = (offset + limit).min(total);
        while i < end {
            if let Some(c) = all.get(i) {
                results.push_back(c);
            }
            i += 1;
        }
        results
    }

    // ─── LIKES (fully permissionless, one like per address per post) ──────

    pub fn like_post(env: Env, post_id: u64, liker: Address) {
        liker.require_auth();

        let mut likes: Vec<Address> = env
            .storage()
            .instance()
            .get(&DataKey::Likes(post_id))
            .unwrap_or_else(|| Vec::new(&env));
        assert!(!likes.contains(&liker), "already liked this post");

        likes.push_back(liker.clone());

        let count_key = DataKey::LikeCount(post_id);
        let current: u64 = env.storage().instance().get(&count_key).unwrap_or(0);

        let mut post: Post = env
            .storage()
            .instance()
            .get(&DataKey::Post(post_id))
            .unwrap_or_else(|| panic!("post not found"));
        post.like_count = current + 1;

        env.storage()
            .instance()
            .set(&DataKey::Likes(post_id), &likes);
        env.storage().instance().set(&count_key, &(current + 1));
        env.storage().instance().set(&DataKey::Post(post_id), &post);
    }

    pub fn unlike_post(env: Env, post_id: u64, liker: Address) {
        liker.require_auth();

        let mut likes: Vec<Address> = env
            .storage()
            .instance()
            .get(&DataKey::Likes(post_id))
            .unwrap_or_else(|| Vec::new(&env));

        let len = likes.len();
        let mut found = false;
        let mut i = 0u32;
        while i < len {
            if let Some(addr) = likes.get(i) {
                if addr == liker {
                    likes.remove(i);
                    found = true;
                    break;
                }
            }
            i += 1;
        }
        assert!(found, "has not liked this post");

        let count_key = DataKey::LikeCount(post_id);
        let current: u64 = env.storage().instance().get(&count_key).unwrap_or(0);

        let mut post: Post = env
            .storage()
            .instance()
            .get(&DataKey::Post(post_id))
            .unwrap_or_else(|| panic!("post not found"));
        post.like_count = current.saturating_sub(1);

        env.storage()
            .instance()
            .set(&DataKey::Likes(post_id), &likes);
        env.storage()
            .instance()
            .set(&count_key, &current.saturating_sub(1));
        env.storage().instance().set(&DataKey::Post(post_id), &post);
    }

    pub fn get_like_count(env: Env, post_id: u64) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::LikeCount(post_id))
            .unwrap_or(0)
    }

    pub fn has_liked(env: Env, post_id: u64, address: Address) -> bool {
        let likes: Vec<Address> = env
            .storage()
            .instance()
            .get(&DataKey::Likes(post_id))
            .unwrap_or_else(|| Vec::new(&env));
        likes.contains(&address)
    }

    // ─── FOLLOW SYSTEM (fully permissionless) ─────────────────────────────

    pub fn follow(env: Env, follower: Address, target: Address) {
        follower.require_auth();
        assert!(follower != target, "cannot follow yourself");

        let mut followers: Vec<Address> = env
            .storage()
            .instance()
            .get(&DataKey::Followers(target.clone()))
            .unwrap_or_else(|| Vec::new(&env));
        assert!(!followers.contains(&follower), "already following");

        followers.push_back(follower.clone());

        let mut following: Vec<Address> = env
            .storage()
            .instance()
            .get(&DataKey::Following(follower.clone()))
            .unwrap_or_else(|| Vec::new(&env));
        following.push_back(target.clone());

        let follower_count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::FollowerCount(target.clone()))
            .unwrap_or(0);
        let following_count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::FollowingCount(follower.clone()))
            .unwrap_or(0);

        env.storage()
            .instance()
            .set(&DataKey::Followers(target.clone()), &followers);
        env.storage()
            .instance()
            .set(&DataKey::Following(follower.clone()), &following);
        env.storage().instance().set(
            &DataKey::FollowerCount(target.clone()),
            &(follower_count + 1),
        );
        env.storage().instance().set(
            &DataKey::FollowingCount(follower.clone()),
            &(following_count + 1),
        );
    }

    pub fn unfollow(env: Env, follower: Address, target: Address) {
        follower.require_auth();

        let mut followers: Vec<Address> = env
            .storage()
            .instance()
            .get(&DataKey::Followers(target.clone()))
            .unwrap_or_else(|| Vec::new(&env));
        let mut found_f = false;
        let mut i = 0u32;
        while i < followers.len() {
            if let Some(addr) = followers.get(i) {
                if addr == follower {
                    followers.remove(i);
                    found_f = true;
                    break;
                }
            }
            i += 1;
        }
        assert!(found_f, "not following this user");

        let mut following: Vec<Address> = env
            .storage()
            .instance()
            .get(&DataKey::Following(follower.clone()))
            .unwrap_or_else(|| Vec::new(&env));
        let mut i = 0u32;
        while i < following.len() {
            if let Some(addr) = following.get(i) {
                if addr == target {
                    following.remove(i);
                    break;
                }
            }
            i += 1;
        }

        let follower_count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::FollowerCount(target.clone()))
            .unwrap_or(0);
        let following_count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::FollowingCount(follower.clone()))
            .unwrap_or(0);

        env.storage()
            .instance()
            .set(&DataKey::Followers(target.clone()), &followers);
        env.storage()
            .instance()
            .set(&DataKey::Following(follower.clone()), &following);
        env.storage().instance().set(
            &DataKey::FollowerCount(target.clone()),
            &(follower_count.saturating_sub(1)),
        );
        env.storage().instance().set(
            &DataKey::FollowingCount(follower.clone()),
            &(following_count.saturating_sub(1)),
        );
    }

    pub fn get_follower_count(env: Env, address: Address) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::FollowerCount(address))
            .unwrap_or(0)
    }

    pub fn get_following_count(env: Env, address: Address) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::FollowingCount(address))
            .unwrap_or(0)
    }

    pub fn is_following(env: Env, follower: Address, target: Address) -> bool {
        let following: Vec<Address> = env
            .storage()
            .instance()
            .get(&DataKey::Following(follower))
            .unwrap_or_else(|| Vec::new(&env));
        following.contains(&target)
    }

    pub fn get_followers(env: Env, address: Address, offset: u32, limit: u32) -> Vec<Address> {
        let all: Vec<Address> = env
            .storage()
            .instance()
            .get(&DataKey::Followers(address))
            .unwrap_or_else(|| Vec::new(&env));
        let total = all.len();
        let mut results: Vec<Address> = Vec::new(&env);
        let mut i = offset;
        let end = (offset + limit).min(total);
        while i < end {
            if let Some(a) = all.get(i) {
                results.push_back(a);
            }
            i += 1;
        }
        results
    }

    pub fn get_following(env: Env, address: Address, offset: u32, limit: u32) -> Vec<Address> {
        let all: Vec<Address> = env
            .storage()
            .instance()
            .get(&DataKey::Following(address))
            .unwrap_or_else(|| Vec::new(&env));
        let total = all.len();
        let mut results: Vec<Address> = Vec::new(&env);
        let mut i = offset;
        let end = (offset + limit).min(total);
        while i < end {
            if let Some(a) = all.get(i) {
                results.push_back(a);
            }
            i += 1;
        }
        results
    }

    // ─── FEED (posts from followed users) ─────────────────────────────────

    pub fn get_followed_feed(env: Env, viewer: Address, offset: u32, limit: u32) -> Vec<Post> {
        let following: Vec<Address> = env
            .storage()
            .instance()
            .get(&DataKey::Following(viewer))
            .unwrap_or_else(|| Vec::new(&env));

        let total: u64 = env
            .storage()
            .instance()
            .get(&DataKey::PostCount)
            .unwrap_or(0);
        let mut feed_posts: Vec<Post> = Vec::new(&env);
        let mut id = total;
        while id >= 1 {
            if let Some(post) = env.storage().instance().get::<_, Post>(&DataKey::Post(id)) {
                if following.contains(&post.author) {
                    feed_posts.push_back(post);
                }
            }
            id -= 1;
        }

        let total_feed = feed_posts.len();
        let mut results: Vec<Post> = Vec::new(&env);
        let mut i = offset;
        let end = (offset + limit).min(total_feed);
        while i < end {
            if let Some(p) = feed_posts.get(i) {
                results.push_back(p);
            }
            i += 1;
        }
        results
    }
}

mod test;
